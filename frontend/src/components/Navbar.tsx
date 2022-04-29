import { Box, Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react'
import { useMeQuery } from '../generated/graphql';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
    const [{data, fetching}] = useMeQuery()
    
    let body = null;

    if(fetching){

    } else if (!data?.me){
        body = (
            <> 
                <Box mr={3}>
                    <Link href="/login">Login</Link>
                </Box>
                <Link href="/register">Register</Link>
            </>
        );
    } else if (data?.me){
        body = (
            <Flex>
                <Box mr={2}>{data.me.username}</Box>
                <Button variant={"link"}>Logout</Button>
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