import Modal from '@material-ui/core/Modal'
import Fade from '@material-ui/core/Fade'

const CustomModal = ({ children, open, setOpen, loading }) => {

    const ModalBody = (
        <>
            <div id={'modal--wrapper'} className={"relative w-full h-screen bg-white outline-none transition-none py-8 px-5 md:mx-5 md:h-auto md:max-w-screen-sm "}>
                {children}
                <span
                    className={'close--btn'}
                    onClick={() => setOpen(false)}
                >
                        <img
                            src="/images/svg/svg--close.svg"
                            alt="close modal icon"
                            width={17}
                            height={17}
                        />
                    </span>
            </div>
            <style jsx>{`
              .close--btn {
                position: absolute;
                top: 12px;
                right: 10px;
                cursor: pointer;
                width: 38px;
                height: 38px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: 0.2s background-color;
                background: #e3e6e7;
              }

              .close--btn:active {
                background-color: #d0d2d2;
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
                className={'flex justify-center items-center'}
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
