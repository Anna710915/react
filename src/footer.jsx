import {Component} from "react";
import "./footer.css";

export default class Footer extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="footer">
                <span className="footer-text">Copyright by Anna Merkul, 2022</span>
            </div>;
    }
}