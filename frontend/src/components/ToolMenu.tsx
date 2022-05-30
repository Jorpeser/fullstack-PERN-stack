import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, useDisclosure } from '@chakra-ui/react';
import React from 'react'

interface ToolMenuProps {

}

const ToolMenu: React.FC<ToolMenuProps> = ({ }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader>
                    Tool Menu
                </DrawerHeader>
                <DrawerBody>
                    <p> Herramienta 1 </p>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}

export default ToolMenu
