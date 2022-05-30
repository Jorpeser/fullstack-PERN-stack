import { Box, Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react'
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavbarProps {

}

const Navbar: React.FC<NavbarProps> = ({}) => {
    // Primer parámetro: datos y demás
    // Segundo parámetro: función para ejecutar query
    const [{data, fetching}] = useMeQuery({ pause: isServer()})
    const [{fetching: logoutFetching}, logout] = useLogoutMutation()
    //const [menuOpened, setMenuOpened] = React.useState(false)

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
            {/* <Flex>
                <Button>Hola</Button>
            </Flex> */}
            <Flex ml="auto">
                {body}              
            </Flex>
        </Flex>
    );
}

export default Navbar;