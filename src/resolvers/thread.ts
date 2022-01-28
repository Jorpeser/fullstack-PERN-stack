import { Thread } from '../entitities/Thread';
import { Arg, Ctx, Mutation, Query, Resolver, } from 'type-graphql';
import { MyContext } from '../types.js'


@Resolver()
export class ThreadResolver {

    // QUERY ALL
    @Query(() => [Thread])
    threads( @Ctx() {em}: MyContext ) : Promise<Thread[]> {
        return em.find(Thread, {});
    }

    // QUERY
    @Query(() => Thread, { nullable: true })
    thread( 
        @Arg('id') Id: number, 
        @Ctx() {em}: MyContext 
    ) : Promise<Thread | null> {
        return em.findOne(Thread, { Id });
    }

    // CREATE
    @Mutation(() => Thread)
    async createThread( 
        @Arg('title') title: string, 
        @Ctx() { em }: MyContext 
    ) : Promise<Thread> {
        const thread = em.create(Thread, { title });
        await em.persistAndFlush(thread);
        return thread;
    }

    // UPDATE
    @Mutation(() => Thread)
    async updateThread(
        @Arg("id") Id: number,
        @Arg('title', () => String, { nullable : true }) title: string, 
        @Ctx() {em}: MyContext 
    ) : Promise<Thread | null> {
        const thread = await em.findOne(Thread, {Id});
        if(!thread) {
            return null;
        }
        if(typeof title !== 'undefined') {
            thread.title = title;
            await em.persistAndFlush(thread)
        }
        return thread;
    }

    // DELETE
    @Mutation(() => Thread)
    async deleteThread( 
        @Arg('id') Id: number, 
        @Ctx() { em }: MyContext 
    ) : Promise<boolean> {
        await em.nativeDelete(Thread, { Id })
        return true;
    }
}