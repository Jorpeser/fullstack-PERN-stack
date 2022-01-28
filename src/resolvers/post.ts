import { Post } from '../entitities/Post';
import { Arg, Ctx, Mutation, Query, Resolver, } from 'type-graphql';
import { MyContext } from '../types.js'


@Resolver()
export class PostResolver {

    // QUERY ALL
    @Query(() => [Post])
    posts( @Ctx() {em}: MyContext ) : Promise<Post[]> {
        return em.find(Post, {});
    }

    // QUERY
    @Query(() => Post, { nullable: true })
    post( 
        @Arg('id') Id: number, 
        @Ctx() {em}: MyContext 
    ) : Promise<Post | null> {
        return em.findOne(Post, { Id });
    }

    // CREATE
    @Mutation(() => Post)
    async createPost( 
        @Arg('title') title: string, 
        @Ctx() { em }: MyContext 
    ) : Promise<Post> {
        const post = em.create(Post, { title });
        await em.persistAndFlush(post);
        return post;
    }

    // UPDATE
    @Mutation(() => Post)
    async updatePost(
        @Arg("id") Id: number,
        @Arg('title', () => String, { nullable : true }) title: string, 
        @Ctx() {em}: MyContext 
    ) : Promise<Post | null> {
        const post = await em.findOne(Post, {Id});
        if(!post) {
            return null;
        }
        if(typeof title !=='undefined') {
            post.title = title;
            await em.persistAndFlush(post)
        }
        return post;
    }

    // DELETE
    @Mutation(() => Post)
    async deletePost( 
        @Arg('id') Id: number, 
        @Ctx() { em }: MyContext 
    ) : Promise<boolean> {
        await em.nativeDelete(Post, { Id })
        return true;
    }
}