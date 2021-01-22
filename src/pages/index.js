import {useQuery, gql, useSubscription} from "@apollo/client";
import Card__Post from "../components/Card";
import {useEffect, useRef, useState} from "react";
import FloatMenu from "../components/FloatMenu";


export const GET_POSTS = gql`
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

const NEW_POST = gql`
    subscription newPost {
        newPost {
            id
            desc
            title
            createdAt
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
        }
    }
`

export default function Index({ initialState: { $token, $user } }) {
    const [posts, setPosts] = useState([])

    const scrollIntoView = useRef()

    const { data: postData, error: postError } = useSubscription(
        NEW_POST
    )

    const { loading:postLoading, data, error } = useQuery(GET_POSTS, {
        onCompleted: data => setPosts(data.getPosts)
    })

    useEffect(() => {
        if (postError) console.log(postError)

        if (postData) {

            setPosts(() => {
                const newData = [...posts]

                newData.unshift(postData.newPost)

                return newData
            })
        }

    },[postData, postError])


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
                    <span ref={scrollIntoView}></span>
                    {
                        posts.map(post => (
                            <Card__Post
                                post={post}
                                user={$user}
                                key={post.id}
                                posts={posts}
                                setPosts={setPosts}
                            />
                        ))
                    }
                </div>
                <div className={" md:w-1/4 md:pr-10"}>
                    {
                        $user &&
                        <FloatMenu spanEl={scrollIntoView} />

                    }
                </div>
            </div>

        </>
    )
}



