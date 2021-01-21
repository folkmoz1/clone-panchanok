import {useQuery, gql} from "@apollo/client";
import Card__Post from "../components/Card";
import {ClickAwayListener, Collapse, Fab, Grow, Tooltip} from "@material-ui/core";
import {AddRounded} from "@material-ui/icons";
import {useState} from "react";



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

    const [openMenu, setOpenMenu] = useState(false)

    const { loading, data, error } = useQuery(GET_POSTS)

    if (loading) {
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
                    <div className={"fixed bottom-10 right-10 flex gap-4 flex-col items-end"}>
                        {
                            openMenu &&
                            <Grow in={openMenu}>
                                <div className={'flex flex-col items-center'}>
                                    <Tooltip
                                        title="สร้างโพสต์"
                                        aria-label="add"
                                        arrow
                                        placement={'left'}
                                    >
                                        <Fab
                                            variant={"extended"}
                                            size={"small"}
                                            style={{boxShadow: 'none'}}
                                        >
                                            สร้างโพสต์
                                        </Fab>
                                    </Tooltip>
                                </div>
                            </Grow>
                        }
                        <ClickAwayListener onClickAway={() => setOpenMenu(false)}>
                            <Fab
                                onClick={() => setOpenMenu(!openMenu)}
                                color="secondary"
                                style={{
                                    transform: openMenu ? 'rotateZ(135deg)': '',
                                    transition: '.2s transform'
                                }}
                            >
                                <AddRounded  fontSize={"large"}/>
                            </Fab>
                        </ClickAwayListener>
                    </div>
                </div>
            </div>
        </>
    )
}



