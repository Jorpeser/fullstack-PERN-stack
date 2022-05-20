import React, { useState } from 'react'
import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
    const router = useRouter();
    const [, changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState('');
    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ newPassword: "", repeatPassword: "" }}
                onSubmit={async (values, { setErrors }) => {
                    if(values.newPassword !== values.repeatPassword) {
                        setErrors({
                            repeatPassword: "Passwords do not match"
                        });
                    } else {
                        const response = await changePassword({token, newPassword: values.newPassword});
                        if (response.data?.changePassword.errors) {
                            const errorMap = toErrorMap(response.data.changePassword.errors);
                            if('token' in errorMap){
                                setTokenError(errorMap.token);
                            }
                            setErrors(errorMap);
                        } else if (response.data?.changePassword.user) {
                            router.push("/");
                        }
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="newPassword"
                            type="password"
                            label="New password" />
                        <Box mt={4}>
                            <InputField
                                name="repeatPassword"
                                label="Repeat new password"
                                type="password" />
                        </Box>
                        { tokenError && <Box textColor="red">{ tokenError }</Box> }
                        <Button
                            mt={4}
                            colorScheme='teal'
                            type="submit"
                            isLoading={isSubmitting}
                        >
                            Change password
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

ChangePassword.getInitialProps = ({ query }) => {
    return {
        token: query.token as string
    };
}

export default withUrqlClient(createUrqlClient)(ChangePassword);
