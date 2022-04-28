import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver} from 'type-graphql';
import { MyContext } from '../types';
import argon2  from 'argon2';
import { User } from '../entitities/User';
import { EntityManager } from '@mikro-orm/postgresql';


// InputType se usa para los argumentos de las mutations
// ObjectType es para los tipos de datos que se devuelven
@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;
}

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

    @Query(() => User, {nullable: true})
    async me(
        @Ctx() { req, em } : MyContext
    ) {
        console.log(JSON.stringify(req.session, null, 4))

        if(!req.session.userId){
            //console.log("req.session.userId === null")
            return null;
        }
        //console.log("(ME) req.session.userId === " + req.session.userId)
        const user = await em.findOne(User, req.session.userId);
        return user;
    }

    @Query(() => [User])
    getUsers(
        @Ctx() { em }: MyContext
    ){
        return em.find(User, {})
    }
     
    // Register
    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ){
        if(options.username.length <= 2) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "Length must be greater than 2"
                    }
                ]
            }
        }

        if(options.password.length <= 3){
            return {
                errors: [
                    {
                        field: "password",
                        message: "Length must be greater than 3"
                    }
                ]
            }
        }

        const hashedPassword = await argon2.hash(options.password)
        let user;
        try{
            // No funcionaba el persistAndFlush asi que lo hacemos asi
            const result = await (em as EntityManager)
                .createQueryBuilder(User)
                .getKnexQuery()
                .insert({
                    username: options.username,
                    password: hashedPassword,
                    created_at: new Date(),
                    updated_at: new Date()
                })
                .returning("*");
            user = result[0];
        } catch(err) {
            //duplicate username error
            if(err.code === "23505") {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "Username already taken"
                        }
                    ]
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
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { req, em }: MyContext
    ): Promise<UserResponse> {
        //console.log("Hola")
        const user = await em.findOne(User, {username: options.username})
        if(!user){
            return {
                errors: [
                    {
                        field: 'username',
                        message: "That username doesn't exist"
                    }
                ]
            }
        }
        const valid = await argon2.verify(user.password, options.password)
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

        //console.log('REQ_SESSION_USER_ID ==== ' + req.session.userId)
        //console.log(JSON.stringify(req.session, null, 4))

        return { user }
    }
}