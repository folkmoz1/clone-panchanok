import Link from "next/link";
import Image from "next/image";
import {dayjs} from "../../../utils/dayjs";
import {IconButton, MenuList, Tooltip} from "@material-ui/core";
import {DeleteOutlined, MoreHoriz} from "@material-ui/icons";
import {createRef, useEffect, useState} from "react";
import {NProgress} from '../../../utils/NProgress'


import Actions from "../Actions";
import CommentInput from "../Comment/Comment--Input";
import CustomMenu from "../Popup/Menu";
import {gql, useMutation} from "@apollo/client";
import DotLoad from "../Loader/dotLoad";
import DisplayImage__Post from "../PictureGrid/displayImage__post";
import CustomModal from "../Modal";
import PostModal from "../Modal/post-modal";
import {useRouter} from "next/router";

const DELETE_POST = gql`
    mutation DELETE_POST($postId: String!) {
        deletePost (
            postId: $postId
        ) {
            success
            message
        }
    }
`

const Card__Post = ({post, user, mutatePosts}) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [openModal, setOpenModal] = useState(false)

    const { replace } = useRouter()

    const inputRef = createRef()

    const {desc, createdAt, actions, id: postId, images} = post

    const {profile, username, id: authorId, fullName} = post.author

    const [ deleteFunc, { loading:deleteLoading } ] = useMutation(DELETE_POST,{
    })

    const deletePost = async () => {
        try {
            if (confirm('ต้องการลบโพสต์หรือไม่')) {
                NProgress.start()
                setAnchorEl(null)
                const resp = await deleteFunc({ variables: { postId } })

                mutatePosts()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const addActions = () => {

    }

    const addComment = () => {

    }

    useEffect(() => {
        if (!openModal) {
            replace('/', undefined, { shallow: true, scroll: false})
        }
    },[openModal])

    return (
        <>
            <div className={`card ${deleteLoading ? 'loading' : ''}`}>
                <div className={"card__head"}>
                    <div className="flex py-2 w-full">
                        <div className="flex-0">
                            <Link href={`/@${username}`}>
                                <a className={'inline'}>
                                    <div className={'card__head__avatar'}>
                                        <Image
                                            src={profile}
                                            width={38}
                                            height={38}
                                            objectFit={"cover"}
                                            quality={100}
                                            alt={username}
                                        />
                                    </div>
                                </a>
                            </Link>
                        </div>
                        <div className="ml-2 min-w-0 flex-grow">
                            <Link href={`/@${username}`}>
                                <a className={'hover:underline contents text-1r font-semibold cursor-default md:cursor-pointer '}>
                                    <div
                                        className={'mb-1 overflow-hidden whitespace-nowrap overflow-ellipsis w-max'}
                                    >
                                        {fullName}
                                    </div>
                                </a>
                            </Link>
                            <Tooltip title={`${dayjs(createdAt).format('DD MMM เมื่อ H:mm')}`}>
                                <div className={'mr-2 text-gray-400 text-xs w-max cursor-default md:cursor-pointer md:hover:underline'}>
                                    {dayjs(createdAt).fromNow()}
                                </div>
                            </Tooltip>
                        </div>
                        {
                            user && user.id === authorId &&
                            <>
                                <div className={'flex-0 items-start card__action'}>
                                    <IconButton
                                        aria-label={'more'}
                                        aria-controls={'manage--btn'}
                                        aria-haspopup={"true"}
                                        onClick={({currentTarget}) => setAnchorEl(currentTarget)}
                                    >
                                        <MoreHoriz/>
                                    </IconButton>
                                </div>
                                {
                                    anchorEl &&
                                    <CustomMenu
                                        nameId={'manage--btn'}
                                        setAnchorEl={setAnchorEl}
                                        anchorEl={anchorEl}
                                    >
                                        <MenuList>
                                            <li className={'whitespace-nowrap'}>
                                                <button
                                                    className={'w-full py-2 px-4 hover:bg-gray-50'}
                                                    onClick={deletePost}
                                                >
                                                    <div className={'flex text-left w-full'}>
                                                        <div className={'mr-2 text-3xl'}>
                                                            <DeleteOutlined fontSize={"large"}
                                                                            color={"disabled"}/>
                                                        </div>
                                                        <div className={'min-w-0 flex-grow text-hidden'}>
                                                            <div>ลบโพสต์</div>
                                                            <div
                                                                className={'text-xs text-gray-300'}>ลบโพสต์ออกจากระบบ
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            </li>
                                        </MenuList>
                                    </CustomMenu>
                                }
                            </>
                        }
                    </div>
                </div>
                <div className="mb-4 px-4">
                    <div className="flex items-start mt-2">
                        <div>
                            <p className={'text-gray-900 break-words whitespace-pre-wrap mb-1'}>{desc}</p>
                        </div>
                    </div>
                </div>
                <Link href={'/'} as={`/@${username}/p/${postId}`} shallow  scroll={false}>
                    <a onClick={() => setOpenModal(true)}>
                        <DisplayImage__Post images={images} />
                    </a>
                </Link>
                <hr className={"mt-2"}/>
                <Actions actions={actions} postId={postId} user={user} addActions={addActions} inputRef={inputRef}/>
                {
                    user &&
                    <>
                        <hr className={"mb-2"}/>
                        <CommentInput user={user} cls={false} ref={inputRef} func={addComment}/>
                    </>
                }
                {
                    deleteLoading &&
                    <span className={'spinner--wrapper'}>
                        <DotLoad />
                    </span>
                }
            </div>
            {
                openModal &&
                <CustomModal
                    open={openModal}
                    setOpen={setOpenModal}
                    maxSize={`screen-xl`}
                    bg={'bg-gray-custom2 relative'}
                    pd={'p-4'}
                >
                    <PostModal post={post} />
                </CustomModal>
            }
            <style jsx>{`
              .spinner--wrapper {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 10;
              }

              .card__action {
                margin: -.2rem 0 0;
              }
              
              .card__head {
                padding: 0 1rem;
              }

              .card__head__avatar {
                width: 38px;
                height: 38px;
                overflow: hidden;
                border-radius: 50%;
                margin-top: .5rem;
              }

              .card {
                width: 100%;
                display: flex;
                flex-direction: column;
                margin-bottom: 1rem;
                background-color: #fff;
                padding-bottom: 1rem;
                position: relative;
              }
              
              .card.loading:before {
                content: "";
                inset: 0;
                position: absolute;
                background: rgba(255, 255, 255, .6);
                z-index: 10;
              }
            `}</style>
        </>
    )
}

export default Card__Post
