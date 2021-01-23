import {useAuthState} from "../../context/auth";
import useResize from "../../hooks/useResize";
import MenuRight__Desktop from "./menu-right-desktop";
import Link from 'next/link'
import {useState} from "react";
import CustomModal from "../Modal";
import { SignInModal } from "../Modal/auth-modal";

const WithoutAuthMenu = () => {
    const [openModal, setOpenModal] = useState({
        active: false,
        page: ''
    })

    const [loading, setLoading] = useState(false)

    const selectModal = page => {
        switch (page) {
            case 'signIn':
                return <SignInModal loading={loading} setLoading={setLoading} />

        }
    }

    return (
        <>
            <div>
                <button
                    className="px-4 py-2 text-1r rounded cursor-default md:cursor-pointer"
                    onClick={() => setOpenModal({active: true, page: 'signIn'})}
                >
                    SIGN IN
                </button>
                <button
                    className="px-4 font-medium text-1r py-2 border rounded  border-green-400 text-white bg-green-400 cursor-default md:cursor-pointer"
                >
                    SIGN UP
                </button>
            </div>
            {
                openModal.active &&
                <CustomModal
                    open={openModal.active}
                    setOpen={setOpenModal}
                    maxSize={'screen-sm'}
                    loading={loading}
                    pd={'py-8 px-5'}
                    bg={'bg-white'}
                >
                    {selectModal(openModal.page)}
                </CustomModal>
            }
        </>
    )
}

export default function Header() {
    const state = useAuthState()
    const { isMobile } = useResize()

    return (
        <>
            <header>
                <div className={"header__content border-b border-gray-200"}>
                    <div className="header__menu-left">
                        <div className="logo__container">
                            <Link href={'/'}>
                                <a className={'logo__link text-2xl text-green-400'}>
                                    panchanok
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className="header__search">
                        <div className={""}>

                        </div>
                    </div>
                    <div className="header__menu-right">
                        {
                            state.user
                            ? <MenuRight__Desktop user={state.user} />
                            : <WithoutAuthMenu />
                        }
                    </div>
                </div>
            </header>
            <style jsx>{`

              .logo__link {
                font-weight: bold;
                text-transform: uppercase;
                position: relative;
              }
              
              .logo__link:before {
                content: "panchanok";
                font-weight: bold;
                text-transform: uppercase;
                color: rgba(52, 211, 153, .3);
                position: absolute;
                transform: translateX(-3px);
              }

              .header__content {
                width: 100%;
                max-width: 1280px;
                padding: 0 12px;
                display: flex;
                justify-content: space-around;
                align-items: center;
                min-height: 70px;
                max-height: 70px;
                background: #fff;
              }

              header {
                position: fixed;
                top: 0;
                width: 100%;
                z-index: 109;
              }
            `}</style>
        </>
    )
}
