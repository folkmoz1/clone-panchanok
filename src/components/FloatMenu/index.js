import {Fab, Grow, Tooltip} from "@material-ui/core";
import {AddRounded, PostAddRounded} from "@material-ui/icons";
import {useEffect, useState} from "react";
import CustomModal from "../Modal";
import CreatePost from "../Modal/createPost";
import useResize from "../../hooks/useResize";


export default function FloatMenu({ spanEl }) {
    const [openMenu, setOpenMenu] = useState(false)

    const [openModal, setOpenModal] = useState(false)

    const [ssc, setSSC] = useState(false)


    const { isMobile } = useResize()

    useEffect(() => {
        if (ssc)
            spanEl.current.scrollIntoView({behavior: 'smooth'})
            setSSC(false)
    },[ssc])

    return (
        <>
            <div className={"fixed bottom-10 right-10 flex gap-4 flex-col items-center"}>
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
                                    onClick={() => {
                                        setOpenModal(true)
                                        setOpenMenu(false)
                                    }}
                                    size={"small"}
                                    style={{boxShadow: 'none'}}
                                >
                                    <PostAddRounded />
                                </Fab>
                            </Tooltip>
                        </div>
                    </Grow>
                }
                <Fab
                    onClick={() => setOpenMenu(!openMenu)}
                    color="secondary"
                >
                    <AddRounded
                        style={{
                            transform: openMenu ? 'rotateZ(135deg)': '',
                            transition: '.2s transform'
                        }}
                        fontSize={"large"}/>
                </Fab>
            </div>
            <CustomModal
                maxSize={'xl'}
                setOpen={setOpenModal}
                open={openModal}
                posit={'start'}
                ct={false}
                bg={'bg-white'}
            >
                <CreatePost  setOpen={setOpenModal} setSSC={setSSC}/>
            </CustomModal>
        </>
    )
}
