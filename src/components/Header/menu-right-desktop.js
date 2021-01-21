import Image from "next/image";
import { useState } from 'react'
import Link from "next/link";
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import {gql, useLazyQuery} from "@apollo/client";
import {useAuthDispatch} from "../../context/auth";
import {useRouter} from "next/router";


const LOGOUT = gql`
    query LOGOUT {
        logout 
    }
`


export default function MenuRight__Desktop({ user }) {
    const [activeMenu, setActiveMenu] = useState(false)

    const dispatch = useAuthDispatch()
    const { reload } = useRouter()

    const [ logout,{ loading } ] = useLazyQuery(LOGOUT, {
        onError: err => console.log(err),
        onCompleted: data => {
            reload()
        }
    })


    return (
        <>
            <ClickAwayListener onClickAway={() => setActiveMenu(false)}>
                <div
                    onClick={() => setActiveMenu(true)}
                    className={`avatar__container ${activeMenu ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                    <span className="avatar__username">
                        {`@${user.username}`}
                    </span>
                    <div className="avatar__image">
                        <Image
                            src={user.image}
                            width={35}
                            height={35}
                            objectFit={"cover"}
                            alt={user.firstName + ' ' + user.lastName}
                            loading={"eager"}
                        />
                    </div>
                    {
                        activeMenu &&
                        <div className="avatar__menu">
                            <Link href={`/@${user.username}`}>
                                <a
                                    onClick={() => setTimeout(() => setActiveMenu(false),)}
                                    className={"avatar__menu__link hover:text-red-500"}>
                                    ดูโปรไฟล์
                                </a>
                            </Link>
                            <hr/>
                            <button
                                onClick={logout}
                                className={"avatar__menu__link hover:text-red-500"}>
                                {loading ? 'กำลังออก..': 'ออกจากระบบ'}
                            </button>
                        </div>
                    }
                </div>
            </ClickAwayListener>

            <style jsx>{`
              .avatar__container {
                position: relative;
                display: flex;
                align-items: center;
                gap: 1rem;
                cursor: pointer;
                padding: .5rem 1rem;
                border-radius: 8px;
              }

              .avatar__container:hover .avatar__username {
                opacity: 1;
              }

              .avatar__username {
                font-weight: bold;
                opacity: ${activeMenu ? 1 : 0};
                transition: opacity .05s linear;
              }

              .avatar__menu {
                position: absolute;
                top: 60px;
                left: 0;
                right: 0;
                padding: .5rem;
                box-shadow: 0 4px 16px rgba(0,0,0,0.12);
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                background-color: #fff;
              }
              
              .avatar__menu__link {
                text-align: right;
                padding: .5rem;
                font-weight: bold;
                font-size: 110%;
              }

              .avatar__image {
                width: 35px;
                height: 35px;
                border-radius: 50%;
                overflow: hidden;
              }
            `}</style>
        </>
    )
}
