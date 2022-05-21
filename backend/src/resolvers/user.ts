import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver} from 'type-graphql';
import { MyContext } from '../types';
import argon2  from 'argon2';
import { User } from '../entitities/User';
//import { EntityManager } from '@mikro-orm/postgresql';
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from '../constants';
import { UsernamePasswordInput } from './UsernamePasswordInput';
import { validateRegister } from '../validators/validateRegister';
import { sendEmail } from '../utils/sendEmail';
import { v4 } from 'uuid'; // Para generar tokens
import AppDataSource from '../type-orm.config';


@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => User, {nullable: true})
    user?: User;
}

@Resolver(User)
export class UserResolver {

    @Mutation(() => UserResponse)
    async changePassword(
        @Arg("token") token: string,
        @Arg("newPassword") newPassword: string,
        @Ctx() { redis }: MyContext
    ): Promise<UserResponse> {
        if(newPassword.length <= 3){
            return {
                errors: [
                    {
                        field: "newPassword",
                        message: "Password must be at least 3 characters long"
                    }
                ]
            };
        }
        const key = FORGOT_PASSWORD_PREFIX + token;
        const userId = await redis.get(key);
        if(!userId){
            return {
                errors: [
                    {
                        field: "token",
                        message: "Invalid or expired token"
                    }
                ]
            }
        }
        const userIdNum = parseInt(userId);
        const user = await User.findOneBy({id: userIdNum});
        if(!user) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "User no longer exists"
                    }
                ]
            }
        }

        await User.update({id: userIdNum}, {password: await argon2.hash(newPassword)});

        await redis.del(key);

        return { user };
    }

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg("email") email: string,
        @Ctx() { redis }: MyContext
    ){
        const user = await User.findOneBy({ email: email});
        if(!user){
            return true;
        }

        const token = v4();
        await redis.set(FORGOT_PASSWORD_PREFIX + token, user.id, "ex", 1000 * 60 * 60 * 3); // 3 horas
        await sendEmail(email, `<a href="http://localhost:3000/change-password/${token}"> Click here to reset your password </a>`);
        
        return true;
    }

    // Me
    @Query(() => User, {nullable: true})
    async me(
        @Ctx() { req } : MyContext
    ) {
        if(!req.session.userId){
            return null;
        }
        return User.findOneBy({id: req.session.userId});
    }

    // GetUsers
    @Query(() => [User])
    getUsers(
    ){
        return User.find()
    }
     
    // Register
    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { req }: MyContext
    ){
        const errors = validateRegister(options);
        if(errors) {
            return { errors };
        }

        const hashedPassword = await argon2.hash(options.password)
        let user;
        try{

            // Equivalente a User.create({username: options.username, email: options.email, password: hashedPassword}).save()
            const result = await AppDataSource
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({
                    username: options.username,
                    email: options.email,
                    password: hashedPassword
                })
                .returning("*")
                .execute();
            
            user = result.raw[0];
        } catch(err) {
            //duplicate username error
            console.log(err)
            if(err.code === "23505") {
                if(err.detail.includes("email")) {
                    return {
                        errors: [
                            {
                                field: "email",
                                message: "Email already registered"
                            }
                        ]
                    }
                } else if(err.detail.includes("username")) {
                    return {
                        errors: [
                            {
                                field: "username",
                                message: "Username already taken"
                            }
                        ]
                    }
                }
            }
        }

        //Set cookie on the user the keep him logged in
        req.session.userId = user.id;

        return { user };
    }

    // Login
    @Mutation(() => UserResponse)
    async login(
        @Arg("usernameOrEmail") usernameOrEmail: string,
        @Arg("password") password: string,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        const user = await User.findOneBy(usernameOrEmail.includes("@") 
            ? { email: usernameOrEmail } 
            : { username: usernameOrEmail }
        );
        if(!user){
            return {
                errors: [
                    {
                        field: 'usernameOrEmail',
                        message: "That username doesn't exist"
                    }
                ]
            }
        }
        const valid = await argon2.verify(user.password, password)
        if(!valid){
            return {
                errors: [
                    {
                        field: 'password',
                        message: "Incorrect password"
                    }
                ]
            }
        }
        
        //console.log('USER_ID ==== ' + user.id)
        
        req.session.userId = user.id;
        
        req.session.save(err => {
            if(err){
                console.log(err)
            }
            return { user }
        })

        return { user }
    }

    // Logout
    @Mutation(() => Boolean)
    async logout(
        @Ctx() { req, res }: MyContext
    ){
        return new Promise((resolve) => {
            req.session.destroy(err => {
                res.clearCookie(COOKIE_NAME);
                if(err) {
                    console.log(err);
                    resolve(false)
                    return;
                }
                resolve(true);
            });
        });
    }
}