import React, { Component } from "react";
import "../styles/main.css";
import firebase from "firebase";
import axios from "axios";
import { API } from "../backend";
import { NavLink } from "react-router-dom";
import {message, Spin} from "antd";

class Main extends Component {
    constructor(props){
        super(props)
        this.state = {
            currentUser: "",
            user: "",
            docs: [],
            devs: [],
            yourdocs: [],
            processing: false
        }
    }

    componentDidMount = () => {
        this.setState({
            currentUser: firebase.auth().currentUser,
            processing: true
        })
        axios.post(`${API}/getdocs`)
        .then((response) => {
            console.log(response.data)
            this.setState({
                docs: response.data,
                processing: false
            })
        })
        .catch((err) => {
            console.log(err)
        })

        axios.post(`${API}/getalluser`)
        .then((response) => {
            this.setState({
                devs: response.data
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    componentWillMount = () => {
        axios.post(`${API}/getuser`, {
            userkey: firebase.auth().currentUser.uid
        })
        .then((response) => {
            console.log(response)
            this.setState({
                user: response.data,
                yourdocs: response.data.docs
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    upvoteUser = (key) => {
        axios.put(`${API}/upvoteuser`, {
            userkey: key.userkey
        })
        .then((response) => {
            console.log(response)
            message.success(`You just upvoted ${key.developer}!`)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    readMore = (key) => {
        console.log("Routing!")
    }

    render(){
        return (
            <div className="main container">
                <div className="row">
                    <div className="column right">
                        <img className="profile-image" src={this.state.currentUser.photoURL} />
                        <h5 className="pt-3">👋 Hi, {this.state.currentUser.displayName}! ({this.state.currentUser.email} ✉️)</h5>
                        <p>You got <span className="font-weight-bold">{this.state.user.upvote} upvotes</span> 😀 by some awesome devs.</p>
                        <div className="pt-3">
                        <button className="write-btn"><NavLink className="text-dark" to="/write">Write 🖊️</NavLink></button>
                        <button className="out-btn" onClick={() => firebase.auth().signOut()}>Log Out 😱</button>
                        </div>
                        <div className="pt-3" style={{listStyleType: "none"}}> 
                            <li>💬 Telegram</li>
                            <li>📱 Instagram</li>
                            <li>📺 Youtube</li>
                            <li>🎙️ Podcast</li>                 
                        </div>
                    </div>
                    <div className="column center">
                    <h2 className="posts">POSTS</h2>
                    {this.state.processing ? <Spin /> : <div></div>}
                    {this.state.docs.map((item, index) => {
                        return (
                            <div className="">
                                <img src={item.image} width="200" className="pt-3" alt="" />
                                <h5>{item.title}</h5>
                                <p className="font-weight-bold"><NavLink className="text-dark" to={"/doc/" + item.dockey}>🔖 READ</NavLink></p>
                                <p><a className="font-weight-bold" onClick={() => this.upvoteUser(item)}>💚 UPVOTE</a></p>
                                <p>{item.developer}</p>
                            </div>
                        )
                    })}
                    </div>
                    <div className="column left">
                        <h2 className="posts">DEVS</h2>
                        {this.state.processing ? <Spin /> : <div></div>}
                        {this.state.devs.slice(0, 8).map((item, index) => {
                            return (
                                <div className="pt-2" style={{listStyleType: "none"}}> 
                                <li className="font-weight-bold">{item.name}</li> 
                                </div>
                            )
                        })} 
                        <div className="pt-5">
                        <h2 className="posts">YOUR DOCS</h2>
                        {this.state.processing ? <Spin /> : <div></div>}
                        {this.state.yourdocs.map((item, index) => {
                            return (
                                <div className="pt-2">
                                    <p>{item.title}</p>
                                    <p className="font-weight-bold"><NavLink className="text-dark" to={"/doc/" + item.dockey}>👻 READ</NavLink></p>
                                </div>
                            )
                        })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};

export default Main;