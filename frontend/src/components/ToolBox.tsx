import { ChevronDownIcon, CloseIcon, LockIcon, UnlockIcon } from "@chakra-ui/icons";
import { Box, ButtonGroup, Flex, IconButton } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react"


interface ToolBoxProps {
    ref? : any;
    title?: string;
}

// Titulo editable
// Boton para bloquear en el sitio

const ToolBox: React.FC<ToolBoxProps> = ({ children, ref, title = "" }) => {
    const [toolLocked, setToolLocked] = React.useState(true);
    return (
        <Box
            as={motion.div}
            drag={!toolLocked}
            dragConstraints={ref}
            dragMomentum={false}
            w="300px"
            minW="200px"
            h="400px"
            minH="200px"
            mx="auto"
            bgColor="black"
            border="1px solid #363636"
            borderRadius={12}
            resize={toolLocked ? "both" : "none"} 
            overflow="auto"
        >
            <Flex
                w="100%"
                h="30px"
                bgColor="#202027"
                alignItems="center" // Centra en Y
                borderTopRadius="inherit"
            >
                <Flex
                    flex={1}
                    ml={2}
                >
                    <ButtonGroup size="xs">
                        <IconButton
                            w="13px" h="13px"
                            bgColor="#ff534d"
                            _hover={{ bg: "#ff534d" }}
                            aria-label="Close tool"
                            icon={
                                <CloseIcon w="6px" h="6px" color="#8e0000" />
                            }
                        />
                        <IconButton
                            w="13px" h="13px"
                            aria-label="Minimize tool"
                            bgColor="#feb429"
                            _hover={{ bg: "#feb429" }}
                            icon={
                                <ChevronDownIcon color="#aa670f" />
                            }
                        />
                    </ButtonGroup>
                </Flex>

                <Flex
                    flex={1}
                    justifyContent="center"
                    fontSize="0.85rem"
                    color="#787878"
                >
                    {title}
                </Flex>

                <Flex 
                    flex={1}
                    justifyContent="right"
                >
                    
                    <IconButton
                        w="13px" h="13px"
                        variant="ghost"
                        aria-label="Drag lock/unlock"
                        onClick={() => setToolLocked(!toolLocked)}
                        icon={
                            toolLocked ? <LockIcon w="12px" h="12px" color="#787878" /> : <UnlockIcon w="12px" h="12px" color="#787878" />
                        }
                    />
                </Flex>
            </Flex>
            {children}
        </Box>
    );
}

export default ToolBox;