import Modal from '@material-ui/core/Modal'
import Fade from '@material-ui/core/Fade'
import {IconButton} from "@material-ui/core";
import {CloseRounded} from "@material-ui/icons";
import useResize from "../../hooks/useResize";

const CustomModal = (
    {
        children,
        open,
        setOpen,
        loading,
        maxSize = 'md',
        posit = 'center',
        bg = '',
        ct = true,
        pd = ''
    }) => {


    const ModalBody = (
        <>
            <div id={'modal--wrapper'} className={`relative w-full h-screen ${bg} outline-none transition-none ${pd} md:mx-5 md:h-auto md:max-w-${maxSize} `}>
                {children}
                {
                    !loading && ct &&
                    <span
                        className={'close--btn'}
                        onClick={() => setOpen(false)}
                    >
                        <CloseRounded color={"disabled"} fontSize={"large"} />
                </span>
                }
            </div>
            <style jsx>{`
              .close--btn {
                position: absolute;
                top: 12px;
                right: 10px;
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: 0.2s background-color;
              }

              .close--btn:active {
                background-color: #fcfcfc;
              }
            `}</style>
        </>
    )

    return (
        <>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                closeAfterTransition
                className={`flex justify-center items-${posit} ${posit === 'start' && 'md:pt-20' }`}
                disableBackdropClick
            >
                <Fade in={open}>
                    {ModalBody}
                </Fade>
            </Modal>
            <style jsx global>{`
              #modal--wrapper:after {
                ${loading ? 'content: "";' : ''}
                position: absolute;
                inset: 0;
                background-color: rgba(255,255,255,.6);
              } 
            `}</style>
        </>
    )
}

export default CustomModal
