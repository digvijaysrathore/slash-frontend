import React from "react";
import 'antd/dist/antd.css';
import { Modal, Button } from 'antd';
import SignInScreen from "./firebaseui";
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import firebase from "firebase";

class ModalAuth extends React.Component {
  state = { visible: false };

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