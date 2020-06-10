import { Input, message, Spin } from 'antd';
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import 'firebase/storage'
import axios from "axios";
import {API} from "../backend";

const key = 'updatable';

const { TextArea } = Input;

const config = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DBURL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  appId: process.env.REACT_APP_APPID
};

firebase.initializeApp(config);

const storage = firebase.storage()
 
class SignInScreen extends React.Component {

  state = {
    isSignedIn: false,
    userkey: "",
    email: "",
    name: "",
    userdata: [],
    bio: "",
    locading: false
  };

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
  }

  componentDidMount() {
    this.setState({
      locading: true
    })
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
        (user) => this.setState({isSignedIn: !!user})
    );
    const userkey = firebase.auth().currentUser.uid
    console.log(userkey)
    console.log(this.state.userkey)
    axios.post(`${API}/getuser`, {
      "userkey": userkey
    })
    .then((response) => {
      console.log(response.data)
      this.setState({
        userdata: response.data,
        loading: false
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  bioChange = (e) => {
    this.setState({
      bio: e.target.value
    })
  }

  bioSubmit = (e) => {
    const headers = {
      'Content-Type': 'application/json'
    };
    e.preventDefault()
    axios.put(`${API}/edituser`, this.state, {headers})
    .then((response) => {
      console.log(response)
      this.bioSaved()
    })
    .catch((err) => {
      console.log(err)
    })
  }

  bioSaved = () => {
    message.loading({ content: 'Saving Bio...', key });
    setTimeout(() => {
      message.success({ content: 'Bio Saved!', key, duration: 10 });
    }, 1000);
  };

  bioCancelled = (e) => {
    message.warn({ content: 'Bio unsaved!', key, duration: 10 });
  }
 
  render() {

    if (!this.state.isSignedIn) {
      return (
        <div>
          <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
        </div>
      );
    }
    return (
      <div className="account-signedin">
        <img className="account-photo" src={firebase.auth().currentUser.photoURL}/>
        <div className="pt-3">
          {this.state.loading 
          ?
          <Spin />
          :
          <div>
          <p>➕ UPVOTEs - <span className="font-weight-bold">{this.state.userdata.upvote}</span></p>
          <TextArea rows="4" id="bio" name="bio" placeholder="Your bio" onChange={this.bioChange}/>
          <Input id="bio" className="mt-3" placeholder="Your instagram username, ex. @digvijaysrathore"/>
          <div className="mt-3">
          <a onClick={this.bioSubmit}>✅</a> <a onClick={this.bioCancelled}> ❌</a>
          </div>
          </div>
          }
        </div>
      </div>
    );
  }
}

export default SignInScreen;