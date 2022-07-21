import {Component} from "react";
import {NavLink} from "react-router-dom";
import {NavItem} from "reactstrap";

export default class Logout extends Component{

    constructor(props) {
        super(props);
    }

    logout(){
        console.log("Hi");
        localStorage.clear();
        console.log(localStorage);
    }

    render() {
        return <NavItem>
            <NavLink className="link" to="/login" onClick={()=>this.logout()}>Logout</NavLink>
        </NavItem>;
    }
}