import {useQuery, gql, useSubscription} from "@apollo/client";
import Card__Post from "../components/Card";
import {useEffect, useRef, useState} from "react";
import FloatMenu from "../components/FloatMenu";
import {request} from "graphql-request";
import useSWR from "swr";


export const GET_POSTS = `
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
                width
                height
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
                width
                height
            }
        }
    }
`

const fetcher = (query, variables) => {
    return request(`${process.env.BACKEND_URI}`, query, variables)
}

export default function Index({ posts: initialData, initialState: { $token, $user } }) {

    const scrollIntoView = useRef()

    const { data: postData, error: postError } = useSubscription(
        NEW_POST
    )

    const { data, error, mutate  } = useSWR(GET_POSTS, fetcher, {
        initialData,
        revalidateOnMount: true
    })

    useEffect(() => {

        if (postData) {
            mutate()
        }

    },[postData, postError])


    if (!data) {
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
                        data.getPosts.map(post => (
                            <Card__Post
                                post={post}
                                user={$user}
                                key={post.id}
                                mutatePosts={mutate}
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

Index.getInitialProps =  async ({ req, res, isSsr }) => {

    if (req) {
        try {
            const resp = await request(`${process.env.BACKEND_URI}`, GET_POSTS)


            return { posts: resp }
        } catch (e) {

            return  { posts: null }
        }
    }


    return { posts: null  }
}



