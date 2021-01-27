import Image from "next/image";
import {useEffect, useRef, useState} from 'react'
import Link from "next/link";
import {gql, useLazyQuery} from "@apollo/client";
import {useRouter} from "next/router";
import {CSSTransition} from "react-transition-group";
import {ClickAwayListener} from "@material-ui/core";
import {useMessageState} from "../../context/message";

import Arrow from '../../../public/images/icons/arrow.svg'


const LOGOUT = gql`
    query LOGOUT {
        logout
    }
`

const DropdownItem = props => {

    return (
        <>
            <span
                onClick={() => props.goTo && props.setActiveMenu(props.goTo)}
                className={"item md:cursor-pointer"}>
                <div>
                    {props.left}
                </div>
                {props.children}
            </span>
            <style jsx>{`

              .item {
                display: flex;
                height: 50px;
                align-items: center;
                justify-content: ${props.justify};
                font-weight: 600;
                font-size: 110%;
                border-radius: 8px;
                transition: background-color 500ms;
                padding: 0.5rem;
              }

              .item:hover {
                background-color: #efefef;
              }
            `}</style>
        </>
    )
}

const DropdownMenu = ({user, setOpenMenu}) => {
    const [activeMenu, setActiveMenu] = useState('main')
    const [menuHeight, setMenuHeight] = useState(null)

    const dropdownRef = useRef(null)

    const {reload} = useRouter()

    const state = useMessageState()

    const [logout, {loading}] = useLazyQuery(LOGOUT, {
        onError: err => console.log(err),
        onCompleted: () => reload()
    })

    function calcHeight(el) {
        const height = el.offsetHeight;
        setMenuHeight(height + 32);
    }


    useEffect(() => {
        setMenuHeight(dropdownRef.current?.firstChild.offsetHeight + 32)
    }, [dropdownRef])

    return (
        <>
            <div className="avatar__menu" style={{height: menuHeight}} ref={dropdownRef}>
                <CSSTransition
                    in={activeMenu === 'main'}
                    timeout={500}
                    classNames={"menu__main"}
                    unmountOnExit
                    onEnter={calcHeight}
                >
                    <div className="w-full">
                        <Link href={`/@${user.username}`}>
                            <a
                                onClick={() => setTimeout(() => setOpenMenu(false),)}
                                className={"avatar__menu__link hover:text-red-500"}>
                                ดูโปรไฟล์
                            </a>
                        </Link>
                        <hr/>
                        <a
                            onClick={() => setActiveMenu('message')}
                            className={"avatar__menu__link hover:text-red-500"}>
                            ข้อความ
                        </a>
                        <hr/>
                        <a
                            onClick={logout}
                            className={"avatar__menu__link hover:text-red-500"}>
                            {loading ? 'กำลังออก..' : 'ออกจากระบบ'}
                        </a>
                    </div>
                </CSSTransition>

                <CSSTransition
                    in={activeMenu === 'message'}
                    timeout={500}
                    classNames={"menu__message"}
                    unmountOnExit
                    onEnter={calcHeight}
                >
                    <div className="w-full">
                        <DropdownItem
                            justify={'flex-start'}
                            setActiveMenu={setActiveMenu}
                            goTo={'main'}
                            left={
                                <Arrow/>
                            }
                        >
                            <h2 className={"ml-4 text-2xl"}>ข้อความ</h2>
                        </DropdownItem>
                        {
                            state.users &&
                            state.users.map(user =>
                                <DropdownItem
                                    key={user.username}
                                    justify={'space-between'}
                                    left={
                                        <div className="avatar">
                                            <Image
                                                src={user.image}
                                                width={32}
                                                height={32}
                                                objectFit={"cover"}
                                                alt={user.username}
                                                loading={"eager"}
                                            />
                                        </div>
                                    }
                                >
                                    {user.firstName}
                                </DropdownItem>
                            )
                        }
                    </div>
                </CSSTransition>
            </div>
            <style jsx global>{`

              .menu__main-enter {
                transform: translateX(-110%);
              }

              .menu__main-enter-active {
                transform: translateX(0);
                transition: all 500ms ease;
              }

              .menu__main-exit {
                transform: translateX(0);
              }

              .menu__main-exit-active {
                transform: translateX(-110%);
                transition: all 500ms ease;
              }

              .menu__message-enter {
                transform: translateX(110%);
                position: absolute;
                top: 16px;
              }

              .menu__message-enter-active {
                transform: translateX(0%);
                transition: all 500ms ease;
                width: 218px;
              }

              .menu__message-exit {
                position: absolute;
                top: 16px;
              }

              .menu__message-exit-active {
                transform: translateX(110%);
                transition: all 500ms ease;
              }

              svg {
                width: 20px;
                height: 20px;
              }

              .avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                margin: 2px;
                overflow: hidden;
              }


              .avatar__menu {
                position: absolute;
                top: 70px;
                padding: 1rem;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
                border-radius: 8px;
                width: 250px;
                transform: translateX(-45px);
                overflow: hidden;
                background-color: #fff;
                transition: height 500ms ease;
              }

              .avatar__menu__link {
                text-align: right;
                padding: .5rem;
                font-weight: bold;
                font-size: 110%;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
              }
            `}</style>
        </>
    )
}


export default function MenuRight__Desktop({user}) {
    const [openMenu, setOpenMenu] = useState(false)

    return (
        <>
            <ClickAwayListener onClickAway={() => setOpenMenu(false)}>
                <div
                    className={`md:cursor-pointer rounded-2xl ${openMenu ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                    <div
                        onClick={() => setOpenMenu(true)}
                        className={"avatar__container"}
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
                    </div>
                    {
                        openMenu &&
                        <DropdownMenu
                            user={user}
                            setOpenMenu={setOpenMenu}
                        />
                    }
                </div>
            </ClickAwayListener>

            <style jsx>{`


              .avatar__container {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: .5rem 1rem;
                border-radius: 8px;
              }

              .avatar__container:hover .avatar__username {
                opacity: 1;
              }

              .avatar__username {
                font-weight: bold;
                opacity: ${openMenu ? 1 : 0};
                transition: opacity .05s linear;
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
