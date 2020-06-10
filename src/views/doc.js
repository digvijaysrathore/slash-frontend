import React, { Component } from "react";
import axios from "axios";
import { API } from "../backend";
import { NavLink } from "react-router-dom";
import firebase from "firebase";
import { Spin } from "antd";
import Body from "../components/body";
const ReactMarkdown = require('react-markdown');

class Doc extends Component {
    constructor(props){
        super(props)
        this.state = {
            path: "",
            doc: [],
            comments: [],
            comment: "",
            name: "",
            processing: false,
            commenting: false,
            fetched: false
        }
    }

    componentDidMount = () => {
        this.setState({
            processing: true
        })
        axios.post(`${API}/docbyid`, {
            dockey: this.props.match.params.doc
        })
        .then((response) => {
            this.setState({
                doc: response.data,
                comments: response.data.comments,
                processing: false,
                fetched: true
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    onCommentChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
            name: firebase.auth().currentUser.displayName
        })
    }

    onComment = (e) => {
        this.setState({
            commenting: true
        })
        e.preventDefault()
        axios.put(`${API}/comment`, {
            dockey: this.props.match.params.doc,
            comment: [{
                comment: this.state.comment,
                name: this.state.name
            }]
        })
        .then((response) => {
            this.setState({
                commenting: false
            })
        })
    }

    render() {
        return (
            <div className="doc">
                <NavLink to="/"><p>⬅️ BROWSE</p></NavLink>
                {this.state.processing ? <Spin /> : <div></div>}
                <h1 className="doc-title">{this.state.doc.title}</h1>
                <NavLink to={"/deve/" + this.state.doc.userkey}><h5>{this.state.doc.developer}</h5></NavLink>
                <div className="text-center">
                    <img src={this.state.doc.image} className="doc-image" alt="" />
                </div>
                {this.state.fetched ? <Body text={this.state.doc.body}/> : <div></div>}
                <h2 className="posts pt-4">COMMENTS</h2>
                <form onSubmit={this.onComment}>
                    <input id="comment" className="comment-input" onChange={this.onCommentChange} type="text" placeholder="Your comment goes here!"/>
                    <button className="comment-btn" type="submit">POST</button>
                    {this.state.commenting ? <Spin /> : <div></div>}
                </form>
                <div className="pt-4">
                    {this.state.comments.map((item, index) => {
                        return (
                            <div>
                                <p className="font-weight-bold">{item.comment} - <span className="font-weight-normal">{item.name}</span></p>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
};

export default Doc;