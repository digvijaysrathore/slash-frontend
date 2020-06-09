import React, {Component} from "react";
const ReactMarkdown = require('react-markdown');

class Body extends Component {
    render(){
        return (
            <div>
                <ReactMarkdown source={this.props.text} />
            </div>
        )
    }
};

export default Body;