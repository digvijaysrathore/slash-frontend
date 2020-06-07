import React, {Component} from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import Main from './views/main';

class App extends Component {
  render(){
    return (
      <div>
        <BrowserRouter>
          <Route path="/" exact component={Main} />
        </BrowserRouter>
      </div>
    )
  }
};

export default App;
