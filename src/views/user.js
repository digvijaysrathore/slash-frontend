import React from "react";
import axios from "axios";
import { API } from "../backend";
import { NavLink } from "react-router-dom";
import { Spin } from "antd";

class User extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            path: this.props.match.params.email,
            dev: [],
            fetching: false,
            docs: []
        }
    }

    componentDidMount = () => {
        this.setState({
            fetching: true
        })
        axios.post(`${API}/getdev`, {
            email: this.state.path
        })
        .then((response) => {
            this.setState({
                dev: response.data,
                fetching: false,
                docs: response.data.docs
            })
        })
        .catch((err) => {
            console.log("Err!")
        })
    }

    render(){
        return (
            <div className="main container">
            <NavLink to="/"><h3>⬅️ BACK</h3></NavLink>
                {this.state.fetching ? <Spin /> : 
                <div className="row user-row">
                <div className="column">
                    <img src={this.state.dev.image} alt="" className="user-image" />
                </div>
                <div className="column">
                    <h2 className="user-name">{this.state.dev.name}</h2>
                    <h5 className="user-content pt-3">🔥 {this.state.dev.upvote} UPVOTEs</h5>
                    <h5 className="user-content">{this.state.dev.bio}</h5>
                    <a className="text-dark" href={"https://instagram.com" + this.state.dev.instagram}><i className="text-dark fa fa-instagram"></i></a>
                    {this.state.docs.map((item, index) => {
                        console.log(item)
                        return (
                            <div className="pt-3">
                                <NavLink className="text-dark" to={"/doc/" + item.dockey}><p>{item.title}</p></NavLink>
                            </div>
                        )
                    })}
                </div>
            </div>
                }
            </div>
        )
    }
};

export default User;