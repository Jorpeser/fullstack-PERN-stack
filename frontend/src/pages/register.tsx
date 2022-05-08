import React from 'react';
import { Formik, Form } from 'formik';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box, Button } from '@chakra-ui/react';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface registerProps { }

const Register: React.FC<registerProps> = ({ }) => {

    // Hook de generado de mutation de GraphQL y urql (lo encontramos en /generated/graphql.tsx)
    // el primer argumento son datos sobre la query {data, errors...}
    // el segundo argumento es la funcion que ejecuta la query
    const router = useRouter();
    const [_, register] = useRegisterMutation(); 

    return (
        <Formik
            initialValues={{ username: "", email: "", password: "" }}
            onSubmit={   
                async (values, {setErrors}) => {
                    const response = await register({options: values});
                    if(response.data?.register.errors) {
                        setErrors(toErrorMap(response.data.register.errors));
                    } else if (response.data?.register.user) {
                        // Redireccionar a /
                        router.push("/");
                    }                    
                }
            }
        >
            {({ isSubmitting }) => (
                <Wrapper variant='small'>
                    <Form>
                        <InputField name="username" label="Username" placeholder='username' />
                        <Box mt={4}>
                            <InputField name="email" label="Email" />
                        </Box>
                        <Box mt={4}>
                            <InputField name="password" label="Password" type="password"/>
                        </Box>
                        <Button
                            mt={4}
                            colorScheme='teal'
                            type="submit"
                            isLoading={isSubmitting}
                        >
                            Register
                        </Button>
                    </Form>
                </Wrapper>
            )}
        </Formik>
    );
};

export default withUrqlClient(createUrqlClient)(Register);
// Si queremos que nuestra pagina/componente acceda a Urlq, debemos exportarlo con el withUrqlClient
// además, añadiendo el segundo argumento a la función createUrqlClient {ssr: true} podemos activarle el server side rendering


