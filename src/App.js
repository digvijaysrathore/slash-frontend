import React, {Component} from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import Main from './views/main';
import "./styles/main.css";
import firebase from 'firebase';
import NavbarComponent from './layout/navbar';
import axios from "axios";
import {API} from "./backend";
import { Spin } from 'antd';
import Write from './views/write';
import Doc from './views/doc';
import User from './views/user';
import UserId from "./views/userid";
import "./styles/text.css";
import "./styles/neu.css";

const config = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
};

class App extends Component {
  state = {
    isSignedIn: false,
    user: ""
  };

  componentDidMount() {
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
  render(){
    return (
      <div>
      <div className="app">
        <BrowserRouter>
          <NavbarComponent />
          <Route user={this.state.user} path="/" exact component={Main} />
          <Route path="/write" component={Write} />
          <Route path="/doc/:doc" component={Doc} />
          <Route path="/dev/:email" component={User} />
          <Route path="/developer/:id" component={UserId} />
        </BrowserRouter>
      </div>
      </div>
    )
  }
};

export default App;
