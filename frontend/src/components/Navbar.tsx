import { Box, Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react'
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
    // Primer parámetro: datos y demás
    // Segundo parámetro: función para ejecutar query
    const [{data, fetching}] = useMeQuery()
    const [{fetching: logoutFetching}, logout] = useLogoutMutation()

    let body = null;

    // User logging in
    if(fetching){
        // User not logged in
    } else if (!data?.me){
        body = (
            <> 
                <Box mr={3}>
                    <Link href="/login">Login</Link>
                </Box>
                <Link href="/register">Register</Link>
            </>
        );
        // User logged in
    } else if (data?.me){
        body = (
            <Flex>
                <Box mr={2}>{data.me.username}</Box>
                <Button 
                    onClick={() => { 
                        logout();
                    }}
                    isLoading={logoutFetching}
                    variant={"link"}
                > Logout </Button>
            </Flex>
        ); 
    }


    return (
        <Flex p={4} bg="black">
            <Flex ml="auto">
                {body}              
            </Flex>
        </Flex>
    );
}

export default Navbar;