
import dynamic from "next/dynamic";

import Link from "next/link";
import Image from "next/image";
import {dayjs} from "../../../utils/dayjs";
import {IconButton} from "@material-ui/core";
import {MoreHoriz} from "@material-ui/icons";
import {createRef} from "react";

const PictureGrid = dynamic(import("../PictureGrid"))
const CommentInput = dynamic(import("../Comment/Comment--Input"))
const Actions = dynamic(import("../Actions"))

const Card__Post = ({post, user}) => {

    const inputRef = createRef()


    const {title, desc, createdAt, actions, id: postId} = post

    const {profile, username, id: authorId, fullName} = post.author

    const images = post.images.map(img => img.url)

    const addActions = () => {

    }

    const addComment = () => {

    }

    return (
        <>
            <div className={"card"}>
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
                            <div className="flex">
                                <div className={'py-1 pl-2 pr-4 max-w-full rounded cont'}>
                                    <Link href={`/@${username}`}>
                                        <a className={'hover:underline contents text-1r font-semibold cursor-default md:cursor-pointer '}>
                                            <div
                                                className={'mb-1 overflow-hidden whitespace-nowrap overflow-ellipsis'}>{fullName}</div>
                                        </a>
                                    </Link>
                                    <div className={'mr-2 text-gray-400 text-xs'}>
                                        {dayjs(createdAt).format('DD MMM เมื่อ H:mm')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            user && user.id === authorId &&
                            <div className={'flex-0 items-start card__action'}>
                                <IconButton
                                    aria-label={'more'}
                                    aria-controls={'manage--btn'}
                                    aria-haspopup={"true"}
                                >
                                    <MoreHoriz/>
                                </IconButton>
                            </div>
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
                <PictureGrid images={images} />
                <hr className={"mt-2"}/>
                <Actions actions={actions} postId={postId} user={user} addActions={addActions} inputRef={inputRef}/>
                {
                    user &&
                    <>
                        <hr className={"mb-2"}/>
                        <CommentInput user={user} ref={inputRef} func={addComment}/>
                    </>
                }
            </div>
            <style jsx>{`
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
              }
            `}</style>
        </>
    )
}

export default Card__Post
