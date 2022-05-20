import { withUrqlClient } from "next-urql";
import Navbar from "../components/Navbar"
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";



const Index = () => {
    const [{ data }] = usePostsQuery();

    return (
        <>
            <Navbar />
            <div> Hola Mundo! </div>
            <br />
            {!data ? (
                <div> Cargando... </div>
            ) : (
                data.posts.map((post) => <div key={post.Id}>{post.title}</div>)
            )}
        </>
    )
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
