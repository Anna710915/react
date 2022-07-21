import React from "react";

const Selector = ({size, sizeHandleChange}) => {
    return(<div className='select-container'>
        <select value={size} onChange={(e)=>sizeHandleChange(e)}>
            <option value='10'>10</option>
            <option value='20'>20</option>
            <option value='50'>50</option>
        </select>
    </div>);
}

export default Selector;