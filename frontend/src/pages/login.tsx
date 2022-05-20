import React from 'react'
import { Formik, Form } from 'formik'
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box, Button, Flex } from '@chakra-ui/react';
import { useLoginMutation } from '../generated/graphql';
import { useRouter } from 'next/router';
import { toErrorMap } from '../utils/toErrorMap';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import Link from 'next/link';

interface loginProps { }

const Login: React.FC<loginProps> = ({ }) => {
    const router = useRouter();
    const [_, login] = useLoginMutation();

    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ usernameOrEmail: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login(values);
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors));
                    } else if (response.data?.login.user) {
                        router.push("/");
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="usernameOrEmail"
                            label="Username or Email"
                            placeholder="username or email" />
                        <Box mt={4}>
                            <InputField
                                name="password"
                                label="Password"
                                type="password" />
                        </Box>
                        <Flex mt={4}>
                            <Button
                                colorScheme='teal'
                                type="submit"
                                isLoading={isSubmitting}
                            >
                                Login
                            </Button>
                            <Box ml="auto"><Link href="/forgot-password">Forgot password?</Link></Box>
                        </Flex>

                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(Login);
// Si queremos que nuestra pagina/componente acceda a Urlq, debemos exportarlo con el withUrqlClient
// además, añadiendo el segundo argumento a la función createUrqlClient {ssr: true} podemos activarle el server side rendering


