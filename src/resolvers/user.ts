import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver} from 'type-graphql';
import { MyContext } from '../types';
import argon2  from 'argon2';
import { User } from '../entitities/User';


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

    @Query(() => [User])
    getUsers(
        @Ctx() { em }: MyContext
    ){
        return em.find(User, {})
    }
     
    // Register
    @Mutation(() => String)
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
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
        const user = em.create(User, {
            username: options.username,
            password: hashedPassword
        })
        try{
            await em.persistAndFlush(user);
        } catch(err) {
            if(err.code === "23505") {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "username already taken"
                        }
                    ]
                }
            }
        }
        return user;
    }

    // Login
    @Mutation(() => String)
    async login(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ): Promise<UserResponse> {
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
        return { user }
    }
}