import React, { Component } from "react";
import axios from "axios";
import { API } from "../backend";
import { NavLink } from "react-router-dom";

class Doc extends Component {
    constructor(props){
        super(props)
        this.state = {
            path: "",
            doc: []
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
            </div>
        )
    }
};

export default Doc;