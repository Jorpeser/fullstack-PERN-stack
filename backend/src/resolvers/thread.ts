import { Thread } from '../entitities/Thread';
import { Arg, Mutation, Query, Resolver, } from 'type-graphql';

@Resolver()
export class ThreadResolver {

    // QUERY ALL
    @Query(() => [Thread])
    threads() : Promise<Thread[]> {
        return Thread.find();
    }

    // QUERY
    @Query(() => Thread, { nullable: true })
    thread( 
        @Arg('id') id: number, 
    ) : Promise<Thread | null> {
        return Thread.findOneBy({id: id});
    }

    // CREATE
    @Mutation(() => Thread)
    async createThread( 
        @Arg('title') title: string, 
    ) : Promise<Thread> {
        return Thread.create({title}).save();
    }

    // UPDATE
    @Mutation(() => Thread)
    async updateThread(
        @Arg("id") id: number,
        @Arg('title', () => String, { nullable : true }) title: string, 
    ) : Promise<Thread | null> {
        const thread = await Thread.findOneBy({id: id});
        if(!thread) {
            return null;
        }
        if(typeof title !== 'undefined') {
            await Thread.update({id}, {title});
        }
        return thread;
    }

    // DELETE
    @Mutation(() => Thread)
    async deleteThread( 
        @Arg('id') id: number, 
    ) : Promise<boolean> {
        await Thread.delete({id: id})
        return true;
    }
}