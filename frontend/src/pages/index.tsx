import { Box } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import Navbar from "../components/Navbar"
import ToolBox from "../components/ToolBox";
import ToolMenu from "../components/ToolMenu";
import Pomodoro from "../components/tools/pomodoro";
import  Wrapper from "../components/Wrapper";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";



const Index = () => {
    const [{ data }] = usePostsQuery();
    const reference = React.createRef();
    
    return (
        <>
            <Navbar />
            <Wrapper variant="small">
                <ToolBox ref={reference} title="Pepe">
                    {}
                </ToolBox>
            </Wrapper>
            <Pomodoro />
            <ToolMenu>{}</ToolMenu>
            {/* <br />
            {!data ? (
                <div> Cargando... </div>
            ) : (
                data.posts.map((post) => <div key={post.Id}>{post.title}</div>)
            )} */}
        </>
    )
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
