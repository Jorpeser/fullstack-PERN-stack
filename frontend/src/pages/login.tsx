import React from 'react'
import {Formik, Form} from 'formik'
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box, Button } from '@chakra-ui/react';
import { useLoginMutation } from '../generated/graphql';
import { useRouter } from 'next/router';
import { toErrorMap } from '../utils/toErrorMap';

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
    const router = useRouter();
    const [_, login] = useLoginMutation();

    return (
        <Formik 
            initialValues={{username: "", password: ""}}
            onSubmit={ async (values, {setErrors}) => {
                const response = await login(values);
                if(response.data?.login.errors) {
                    setErrors(toErrorMap(response.data.login.errors));
                } else if (response.data?.login.user) {
                    router.push("/");
                }
            }}
        > 
            {({isSubmitting}) => (    
                <Wrapper variant='small'>
                    <Form>
                        <InputField name="username" label="Username" placeholder="Username"/>
                        <Box mt={4}>
                            <InputField name="password" label="Password" type="password"/>
                        </Box>
                        <Button
                            mt={4}
                            colorScheme='teal'
                            type="submit"
                            isLoading={isSubmitting}
                        >
                            Login
                        </Button>
                    </Form>
                </Wrapper>
            )}
        </Formik>
    );
}

export default Login;