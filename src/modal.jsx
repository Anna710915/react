import React from 'react';
import './modal.css';

const Modal = ({active, setActive, children}) => {

    return(
        <div className={active ? "modal-container active" : "modal-container"} onClick={() => setActive(false)}>
            <div className={active ? "modal__content active" : "modal__content"} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

export default Modal;