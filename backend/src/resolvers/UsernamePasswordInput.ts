import { Field, InputType } from 'type-graphql';

// InputType se usa para los argumentos de las mutations
// ObjectType es para los tipos de datos que se devuelven


@InputType()
export class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    email: string;
    @Field()
    password: string;
}
