import { Box, Button, Flex } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react'
import { InputField } from '../components/InputField';
import  Wrapper from '../components/Wrapper'
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';



const ForgotPassword: React.FC<{}> = ({ }) => {
    const [, forgotPassword] = useForgotPasswordMutation();
    const [emailSent, setEmailSent] = useState(false);
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ email: "" }}
                onSubmit={async (values, { setErrors }) => {
                    if (!values.email.includes('@')) {
                        setErrors({ email: "Not a valid email" });
                    } else {
                        const response = await forgotPassword({ email: values.email })
                        setEmailSent(true);
                    }
                }}
            >
                {({ isSubmitting }) => !emailSent ? 
                (
                    <h4> If an account with this email exists, we've sent you a message! </h4>
                ) : (
                    <Form>
                        <InputField
                            name="email"
                            label="Email"
                            placeholder="email"
                            type="email"
                        />
                        <Button
                            mt={4}
                            colorScheme='teal'
                            type="submit"
                            isLoading={isSubmitting}
                        >
                            Send recovery link
                        </Button>
                    </Form>
                )
                }
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(ForgotPassword);