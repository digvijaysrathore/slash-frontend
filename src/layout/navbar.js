import React, {Component} from "react";
import ModalAuth from "../components/modal";
import "../styles/main.css";
import firebase from "firebase";
import { NavLink } from "react-router-dom";

class NavbarComponent extends Component {
    render(){
        return (
            <div>
                <nav className="navbar navbar-expand-sm navbar-light">
                <NavLink to="/"><img className="navbar-brand" alt="" src="https://firebasestorage.googleapis.com/v0/b/digvijay-web.appspot.com/o/slash.png?alt=media&token=8728f9f0-ef77-494f-ae33-00e2dab9565b"/></NavLink>
                <div className="ml-auto">
                    <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <ModalAuth />
                    </li>
                    </ul>
                </div>
                </nav>
            </div>
        )
    }
};

export default NavbarComponent;