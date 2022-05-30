import { CloseIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { Box, Button, ButtonGroup, Flex, IconButton } from "@chakra-ui/react"
import React, { useState, useEffect } from "react"
import ToolBox from "../ToolBox"

export default function Pomodoro() {
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(20)
    const [displayMessage, setDisplayMessage] = useState(false)

    useEffect(() => {
        let interval = setInterval(() => {
            clearInterval(interval)

            if (seconds === 0) {
                if (minutes !== 0) {
                    setSeconds(59)
                    setMinutes(minutes - 1)
                } else {
                    let minutes = displayMessage ? 24 : 4
                    let seconds = 59

                    setSeconds(seconds)
                    setMinutes(minutes)
                    setDisplayMessage(!displayMessage)
                }
            } else {
                setSeconds(seconds - 1)
            }
        }, 1000)
    }, [seconds])

    const timerMinutes = minutes < 10 ? `0${minutes}` : minutes
    const timerSeconds = seconds < 10 ? `0${seconds}` : seconds

    return (
        <ToolBox title="Pomodoro">
            <Flex alignItems="center" justifyContent="center" flexDirection='column' > 
                {/* <Flex justifyContent="center" mb='8px'>
                    <Button
                        aria-label="Pomodoro"
                        _hover={{ bg: "#0b70e3" }}
                        bgColor="#0b70e3"
                    > Pomodoro </Button>
                </Flex> */}
                <Flex justifyContent="center">
                    <ButtonGroup>
                        <Button
                            aria-label="Pomodoro"
                            _hover={{ bg: "#0b70e3" }}
                            bgColor="#0b70e3"
                        > Pomodoro </Button>
                        <Button
                            aria-label="Stop timer"
                            _hover={{ bg: "#0b70e3" }}
                            bgColor="#0b70e3"
                        > Short break </Button>
                        {/* <Button
                            aria-label="Reset timer"
                            _hover={{ bg: "#0b70e3" }}
                            bgColor="#0b70e3"
                        > Long break </Button> */}
                    </ButtonGroup>
                </Flex>
                <Flex fontSize='6em' fontFamily={"monospace"} justifyContent="center">
                    {timerMinutes}:{timerSeconds}
                </Flex>
                <Flex justifyContent="center">
                    <ButtonGroup>
                        <Button
                            aria-label="Start timer"
                            _hover={{ bg: "#04c424" }}
                            bgColor="#04c424"
                        > Start </Button>
                        <Button
                            aria-label="Stop timer"
                            _hover={{ bg: "#ff534d" }}
                            bgColor="#ff534d"
                        > Stop </Button>
                        <Button
                            aria-label="Reset timer"
                            _hover={{ bg: "#feb429" }}
                            bgColor="#feb429"
                        > Reset </Button>
                    </ButtonGroup>
                </Flex>
            </Flex>
        </ToolBox>

    )
}