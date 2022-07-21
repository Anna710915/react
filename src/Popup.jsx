import React from "react";
import './popup.css'

const Popup = ({children}) => {

    return(<div className='popup-container'>
        <div className='popup__content'>
            <p className='message'>{children}</p>
        </div>
    </div>)
}

export default Popup;
