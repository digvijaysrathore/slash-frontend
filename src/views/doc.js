import React, { Component } from "react";
import axios from "axios";
import { API } from "../backend";
import { NavLink } from "react-router-dom";
import firebase from "firebase";

class Doc extends Component {
    constructor(props){
        super(props)
        this.state = {
            path: "",
            doc: [],
            comments: [],
            comment: "",
            name: ""
        }
    }

    componentDidMount = () => {
        axios.post(`${API}/docbyid`, {
            dockey: this.props.match.params.doc
        })
        .then((response) => {
            this.setState({
                doc: response.data
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
        e.preventDefault()
        axios.put(`${API}/comment`, {
            dockey: this.props.match.params.doc,
            comment: [{
                comment: this.state.comment,
                name: this.state.name
            }]
        })
    }

    render() {
        return (
            <div className="doc">
                <NavLink to="/"><p>⬅️ BROWSE</p></NavLink>
                <h1 className="doc-title">{this.state.doc.title}</h1>
                <h5>{this.state.doc.developer}</h5>
                <div className="text-center">
                    <img src={this.state.doc.image} className="doc-image" alt="" />
                </div>
                <p>{this.state.doc.body}</p>
                <h2 className="posts">COMMENTS</h2>
                <form onSubmit={this.onComment}>
                    <input id="comment" onChange={this.onCommentChange} type="text" placeholder="Your comment goes here!"/>
                    <button type="submit">POST</button>
                </form>
                <div className="pt-3">
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