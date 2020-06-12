import React from "react";
import 'antd/dist/antd.css';
import { Modal, Button } from 'antd';
import SignInScreen from "./firebaseui";
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import firebase from "firebase";
import axios from "axios";
import {API} from "../backend";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

class ModalAuth extends React.Component {
  state = { 
    visible: false,
    isSignedIn: false
  };

  componentDidMount = () => {
    if(firebase.auth().currentUser === null){
      console.log("No!")
    } else {
      console.log("User!")
      this.setState({
        isSignedIn: true
      })
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
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

  render() {
    return (
      <div>
        <a onClick={this.showModal}><Avatar shape="square" size={"large"} icon={<UserOutlined />} /></a>
          <Modal
            title="🔒"
            okButtonProps={{style: {backgroundColor: "#000000", border: "none"}}}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <SignInScreen />
          </Modal>
      </div>
    );
  }
}

export default ModalAuth;