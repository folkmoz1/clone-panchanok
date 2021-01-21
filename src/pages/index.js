import {useQuery, gql} from "@apollo/client";
import Card__Post from "../components/Card";
import {ClickAwayListener, Collapse, Fab, Grow, Tooltip} from "@material-ui/core";
import {AddRounded, PostAddRounded} from "@material-ui/icons";
import {useState} from "react";
import FloatMenu from "../components/FloatMenu";
import CustomModal from "../components/Modal";



const GET_POSTS = gql`
    query GET_POST {
        getPosts
        {
            id
            desc
            title
            author {
                id
                username
                fullName
                profile
            }
            comments {
                owner
                fullName
                username
                content
                createdAt
                profile
            }
            actions {
                owner
                username
                fullName
                profile
            }
            images {
                url
            }
            createdAt
        }
    }
`

export default function Index({ initialState: { $token, $user } }) {



    const { loading:postLoading, data, error } = useQuery(GET_POSTS)

    if (postLoading) {
        return <h1>Loading...</h1>
    }

    if (error) {
        return <h1>Try again</h1>
    }


    return (
        <>
            <div className={"flex flex-col md:flex-row md:justify-center  h-full pb-20"}>
                <div className={"md:w-1/4"}>
                    test
                </div>
                <div className={" bg-gray-300 w-full  md:w-1/2 flex flex-col items-center border-r border-l border-gray-200 h-full "}>
                    {
                        data.getPosts.map(post => (
                            <Card__Post post={post}  user={$user} key={post.id} />
                        ))
                    }
                </div>
                <div className={" md:w-1/4 md:pr-10"}>
                    {
                        $user &&
                        <FloatMenu />

                    }
                </div>
            </div>

        </>
    )
}



