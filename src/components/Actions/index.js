import Router from "next/router";
import {useEffect, useState} from "react";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";

const Actions = ({user, inputRef, addActions, postId, actions}) => {
    const [liked, setLiked] = useState(false)


    useEffect(() => {
        if (actions && user) {
            const checked = actions.filter(i => i.owner === user.id)
            setLiked(checked.length === 1)
        }
    }, [actions])

    if (!actions) {
        return <Skeleton width={'100%'} height={40} className={'my-2'}/>
    }

    return (
        <>
            <div className={'flex justify-between items-center p-2 gap-2'}>
                <div className={'button like'}>
                    <button
                        onClick={() => addActions(actions, liked)}
                        className={`gap-1 sm:gap-4 flex items-center justify-center py-2 px-4 rounded-2xl w-full ${liked ? 'bg-red-200' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        <span className={'icon'}>
                            <Image
                                src={
                                    liked ? (
                                        `/images/svg/svg--liked.svg`
                                    ) : `/images/svg/svg--unlike.svg`
                                }
                                width={18}
                                height={18}
                                alt="actions icon"
                            />
                        </span>
                        <span className={`${liked && 'text-red-600'}`}>
                            {liked ? 'Liked' : 'Like'}
                        </span>
                    </button>
                </div>
                <div className={'button comment'}>
                    <button
                        onClick={() => {
                            if (user) inputRef.current.focus()
                            else Router.push({
                                pathname: '/u/login',
                                query: {redirect: Router.asPath}
                            }, '/u/login?r=true')
                        }}
                        className={'gap-1 sm:gap-4 flex items-center justify-center py-2 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 w-full'}
                    >
                        <span>
                            <img src="/images/svg/svg--comment.svg" width={18} height={18}
                                 alt="unlike icon"/>
                        </span>
                        <span>
                            Comment
                        </span>
                    </button>
                </div>
                <div className={'button share'}>
                    <button className={'gap-1 sm:gap-4 flex items-center justify-center py-2 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 w-full'}>
                        <span>
                            <img src="/images/svg/svg--share.svg" width={18} height={18}
                                 alt="unlike icon"/>
                        </span>
                        <span>
                            Share
                        </span>
                    </button>
                </div>
            </div>
            <style jsx>{`
              .button.share {
                flex-basis: 30%;
              }

              .button.like {
                flex-basis: 30%;

              }

              .button.comment {
                flex: 1;
              }
              
              @media (max-width: 640px) {
                  .button.share {
                    flex-basis: 40%;
                  }
                  
                  .button.share span:first-child {
                    
                  }
    
                  .button.like {
                    flex-basis: 40%;
                  }
    
                  .button.comment {
                    flex-basis: 60%;
                  }
              }

              .icon {
                width: 18px;
                height: 18px;
              }
            `}</style>
        </>
    )
}

export default Actions
