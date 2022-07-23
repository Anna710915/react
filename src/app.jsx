import React, {Component} from "react";

import "./app.css";
import Login from "./login.jsx";
import Footer from "./footer.jsx";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Certificates from "./certificates";
import NotFound from "./NotFound";
const App = () => {

    return(<Router>
        <div className="page-app">
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/certificates" element={<Certificates/>}/>
                <Route path="/*" element={<NotFound /> }/>
            </Routes>
            <Footer/>
        </div>
    </Router>);
}
export default App;