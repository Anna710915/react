import React from "react";
import AppNavBar from "./app-nav-bar";
import './NotFound.css'

const NotFound = () => {
    return(
        <div className="main">
            <AppNavBar/>
            <div className="not_found_page">
                <h1>Not Found</h1>
            </div>
        </div>
    );
}

export default NotFound;