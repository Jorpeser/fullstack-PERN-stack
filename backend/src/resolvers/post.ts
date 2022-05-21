import { Post } from '../entitities/Post';
import { Arg, Mutation, Query, Resolver, } from 'type-graphql';

@Resolver()
export class PostResolver {

    // QUERY ALL
    @Query(() => [Post])
    async posts() : Promise<Post[]> {
        return Post.find();
    }

    // QUERY
    @Query(() => Post, { nullable: true })
    post( 
        @Arg("id") id: number, 
    ) : Promise<Post | null> {
        return Post.findOneBy({id: id});
    }

    // CREATE
    @Mutation(() => Post)
    async createPost( 
        @Arg('title') title: string, 
    ) : Promise<Post> {
        // const post = em.create(Post, { title });
        // await em.persistAndFlush(post);
        return Post.create({title}).save();
    }

    // UPDATE
    @Mutation(() => Post)
    async updatePost(
        @Arg("id") id: number,
        @Arg('title', () => String, { nullable : true }) title: string, 
    ) : Promise<Post | null> {
        const post = await Post.findOneBy({ id: id });
        if(!post) {
            return null;
        }
        if(typeof title !=='undefined') {
            // post.title = title;
            // await em.persistAndFlush(post)
            await Post.update({id}, {title});
        }
        return post;
    }

    // DELETE
    @Mutation(() => Post)
    async deletePost( 
        @Arg('id') id: number, 
    ) : Promise<boolean> {
        await Post.delete({id: id})
        return true;
    }
}