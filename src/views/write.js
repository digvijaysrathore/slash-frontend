import { Upload, message, Result, Spin } from 'antd';
import { Input } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import React, { Component } from "react";
import "../styles/main.css";
import firebase from "firebase";
import { NavLink } from 'react-router-dom';
import FileUploader from "react-firebase-file-uploader";
import axios from "axios";
import {API} from "../backend";

const { Dragger } = Upload;

const { TextArea } = Input;

class Write extends Component {
    state = {
        image: "",
        isUploading: false,
        progress: 0,
        imageURL: "",
        title: "",
        developer: "",
        body: "",
        userkey: "",
        posting: false,
        posted: false
      };

      componentDidMount = () => {
        if(firebase.auth().currentUser === null){
            window.location.replace("/")
        }
        
        const user = firebase.auth().currentUser
        this.setState({
            developer: user.displayName,
            userkey: user.uid
        })
      }
     
      handleChangeUsername = event =>
        this.setState({ username: event.target.value });
      handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
      handleProgress = progress => this.setState({ progress });
      handleUploadError = error => {
        this.setState({ isUploading: false });
        console.error(error);
      };
      handleUploadSuccess = filename => {
        this.setState({ image: filename, progress: 100, isUploading: false });
        firebase
          .storage()
          .ref("images")
          .child(filename)
          .getDownloadURL()
          .then(url => this.setState({ imageURL: url }));
      };
     
    handlePost = (e) => {
        e.preventDefault()
        this.setState({
            posting: true
        })
        axios.post(`${API}/adddoc`, {
            title: this.state.title,
            body: this.state.body,
            image: this.state.imageURL,
            developer: this.state.developer,
            userkey: this.state.userkey
        })
        .then((response) => {
            console.log(response)
            this.setState({
                posting: false,
                posted: true
            })
            axios.put(`${API}/edituser`, {
                userkey: this.state.userkey,
                docs: [{
                    title: this.state.title,
                    dockey: response.data.dockey
                }]
            }).then(() => {console.log("Done!")})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    };

    success = () => {
        message.success('Posted a new doc!');
    };

    render(){
        return (
            <div className="write">
                <h5><NavLink className="text-dark" to="/">❌ BACK</NavLink></h5>
                {this.state.posting ? <Spin /> : <div></div>}
                {this.state.posted ? <div>
                    <Result
                        status="success"
                        title="New doc posted!"
                        subTitle="Quick Tip: Keep an eye on your posts and engage with people in the comments."
                    />
                </div> : <div></div>}
                <TextArea id="title" onChange={this.onChange} style={{fontSize: 20, fontWeight: "bold"}} placeholder="Title Goes Here!" />
                <div style={{ margin: '24px 0' }} />
                <p>Use markdown to write interactive and more readable docs. You can customize headings, paragraphs, sub-headings and much more with it. Read <NavLink to="/">this post</NavLink> to know about markdown and how to use it.</p>
                <TextArea
                id="body"
                onChange={this.onChange}
                placeholder="What you are upto today?"
                autoSize={{ minRows: 10, maxRows: 50 }}
                />
                <form className="pt-4">
                {this.state.isUploading && <div className="text-center"><Spin /></div>}
                <FileUploader 
                    accept="image/*"
                    name="avatar"
                    randomizeFilename
                    storageRef={firebase.storage().ref("images")}
                    onUploadStart={this.handleUploadStart}
                    onUploadError={this.handleUploadError}
                    onUploadSuccess={this.handleUploadSuccess}
                    onProgress={this.handleProgress}
                />
                </form>
                <p>*you can't post without adding an image (a picture is worth a thousand words).</p>
                <button className="mt-3 post-btn" onClick={this.handlePost}>POST</button>
            </div>
        )
    }
};

export default Write;