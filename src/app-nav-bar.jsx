import {Component} from "react";
import {Navbar, NavbarBrand, NavItem} from 'reactstrap';
import "./app-nav-bar.css";
import Logout from "./logout";
export default class AppNavBar extends Component{

    constructor(props) {
        super(props);
    }

    render() {
        return <Navbar className="nav" expand="md">
            <NavbarBrand>Home</NavbarBrand>
            {localStorage.getItem("token") && <Logout/>}
        </Navbar>;
    }
}