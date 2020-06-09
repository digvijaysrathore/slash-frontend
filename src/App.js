import React, {Component} from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import Main from './views/main';
import "./styles/main.css";
import firebase from 'firebase';
import NavbarComponent from './layout/navbar';
import axios from "axios";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {API} from "./backend";
import { Spin } from 'antd';
import Write from './views/write';
import Doc from './views/doc';

const config = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
};

class App extends Component {
  state = {
    isSignedIn: false,
    user: ""
  };

  componentWillMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
        (user) => this.setState({isSignedIn: !!user, user: user}, console.log(user))
    );
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
          name: firebase.auth().currentUser.displayName
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
  render(){
    return (
      <div>
        {this.state.isSignedIn ? 
      <div>
        <BrowserRouter>
          <NavbarComponent />
          <Route user={this.state.user} path="/" exact component={Main} />
          <Route path="/write" component={Write} />
          <Route path="/doc/:doc" component={Doc} />
        </BrowserRouter>
      </div>
      :
      <div className="text-center">
        {/* <img src="https://firebasestorage.googleapis.com/v0/b/slash-co.appspot.com/o/undraw_coding_6mjf%20(1).png?alt=media&token=166c4c20-dd99-420c-8a4e-f3fec4296da1" className="main-image" alt="" /> */}
        <Spin />
        <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
      </div>
    }
      </div>
    )
  }
};

export default App;
