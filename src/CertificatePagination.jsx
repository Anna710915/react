import React from "react";
import './certificate-pagination.css'

const CertificatePagination = ({pages,  changePage}) => {
    return(<div>
        <div className="page__wrapper">
            <span
                onClick={() => changePage(pages[0])}
                className= "page">
                First
            </span>
            <span
                onClick={() => changePage(pages[1])}
                className= "page">
                Prev
            </span>
            <span
                onClick={() => changePage(pages[2])}
                className= "page page_current">
                {pages[2] ? pages[2].id : 1}
            </span>
            <span
                onClick={() => changePage(pages[3])}
                className= "page">
                Next
            </span>
            <span
                onClick={() => changePage(pages[4])}
                className= "page">
                Last
            </span>
        </div>
    </div>);
}

export default CertificatePagination;