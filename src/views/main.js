import React, { Component } from "react";
import "../styles/main.css";
import firebase from "firebase";
import axios from "axios";
import { API } from "../backend";
import { NavLink } from "react-router-dom";
import {message, Spin} from "antd";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

class Main extends Component {
    constructor(props){
        super(props)
        this.state = {
            currentUser: "",
            user: "",
            docs: [],
            devs: [],
            yourdocs: [],
            processing: false,
            isSignedIn: false,
            isLoggedIn: false
        }
    }

    uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        callbacks: {
          signInSuccessWithAuthResult: () => {
            this.setState({
              userkey: firebase.auth().currentUser.uid,
              email: firebase.auth().currentUser.email,
              name: firebase.auth().currentUser.displayName,
              image: firebase.auth().currentUser.photoURL
            })
            axios.post(`${API}/adduser`, this.state)
            .then((response) => {
              console.log(response)
            })
            .catch((err) => {
              console.log(err)
            })
          }
        }
      };

    componentDidMount = () => {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
            (user) => this.setState({isSignedIn: !!user, user: user}, console.log(user))
        );

        if(firebase.auth().currentUser === null){
            this.setState({
                isSignedIn: false
            })
            console.log("No!")
        } else {
            console.log("User!")
            this.setState({
                isSignedIn: true,
                currentUser: firebase.auth().currentUser,
                processing: true
            })
    
            axios.post(`${API}/getuser`, {
                userkey: firebase.auth().currentUser.uid
            })
            .then((response) => {
                this.setState({
                    user: response.data,
                    yourdocs: response.data.docs
                })
            })
            .catch((err) => {
                console.log(err)
            })
        }

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

    upvoteUser = (key) => {
        key.preventDefault();
        axios.put(`${API}/upvoteuser`, {
            userkey: key.userkey
        })
        .then((response) => {
            message.success(`You just upvoted ${key.developer}!`)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    render(){
        return (
            <div>
            <div className="main container">
                <div className="row">
                    {this.state.isSignedIn
                    ?
                    <div className="column right">
                        <img className="profile-image" src={firebase.auth().currentUser.photoURL} />
                        <h5 className="pt-3">👋 Hi, {firebase.auth().currentUser.displayName}! ({firebase.auth().currentUser.email} ✉️)</h5>
                        <p>You got <span className="font-weight-bold">{this.state.user.upvote} upvotes</span> 😀 by some awesome devs.</p>
                        <div className="pt-3">
                        <button className="write-btn"><NavLink className="text-dark" to="/write">Write 🖊️</NavLink></button>
                        <button className="out-btn" onClick={() => firebase.auth().signOut()}>Log Out 😱</button>
                        </div>
                        <div className="pt-3" style={{listStyleType: "none"}}> 
                            <li><a target="_blank" href="https://t.me/teamtanay" className="text-dark">💬 #TeamTanay</a></li>
                            <li><a target="_blank" href="https://instagram.com/digvijaysrathore" className="text-dark">📱 Instagram</a></li>
                            <li><a href="https://www.youtube.com/channel/UCNFmBuclxQPe57orKiQbyfA" className="text-dark" target="_blank">📺 Youtube</a></li>
                            <li><a href="https://open.spotify.com/show/4IZCzLuBT6QezvViXlOgxO?si=4huXPx_gT_aB3T3q3ZjwVw" target="_blank" className="text-dark">🎙️ Thinking With Tanay</a></li>                 
                        </div>
                    </div>
                    :
                    <div className="column right">
                        <img className="profile-image" src={this.state.currentUser.photoURL} />
                        <h5 className="pt-3">👋 Hi, You must log in!</h5>
                        <p>Upon logging in members are allowed to <span className="font-weight-bold">write posts, get upvotes, comment, maintain a profile</span> 😀 and much much more.</p>
                        <div className="pt-3">
                            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
                        </div>
                        <div className="pt-3" style={{listStyleType: "none"}}> 
                            <li><a target="_blank" href="https://t.me/teamtanay" className="text-dark">💬 #TeamTanay</a></li>
                            <li><a target="_blank" href="https://instagram.com/digvijaysrathore" className="text-dark">📱 Instagram</a></li>
                            <li><a href="https://www.youtube.com/channel/UCNFmBuclxQPe57orKiQbyfA" className="text-dark" target="_blank">📺 Youtube</a></li>
                            <li><a href="https://open.spotify.com/show/4IZCzLuBT6QezvViXlOgxO?si=4huXPx_gT_aB3T3q3ZjwVw" target="_blank" className="text-dark">🎙️ Thinking With Tanay</a></li>                 
                        </div>
                    </div>
                    }
                    <div className="column center">
                    <h2 className="posts">POSTS</h2>
                    {this.state.processing ? <Spin /> : <div></div>}
                    {this.state.docs.map((item, index) => {
                        return (
                            <div className="card mt-3">
                                <img className="card-img-top" src={item.image} alt="" />
                                <div className="card-body">
                                  <h4 className="card-title">{item.title}</h4>
                                  <p className="card-text">{item.developer}</p>
                                  <NavLink className="btn btn-dark" to={"/doc/" + item.dockey}>📑 READ</NavLink>
                                  <a className="btn btn-dark btn-upvote text-light" onClick={this.upvoteUser}>💚 UPVOTE</a>
                                </div>
                            </div>
                        )
                    })}
                    </div>
                    <div className="column left">
                        <h2 className="posts">DEVS</h2>
                        {this.state.processing ? <Spin /> : <div></div>}
                        {this.state.devs.map((item, index) => {
                            return (
                                <div className="pt-2" style={{listStyleType: "none"}}> 
                                <NavLink to={"/developer/" + item.userkey}><p className="font-weight-bold text-dark">{item.name}</p> </NavLink>
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
            </div>
        )
    }
};

export default Main;