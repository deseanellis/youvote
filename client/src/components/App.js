import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';

import Sidebar from './Sidebar';
import Content from './Content';

class App extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.loggedIn !== prevProps.loggedIn) {
      if (this.props.loggedIn) {
        //Call Action Creator -> Get User Information
        this.props.getUser();
      }
    }
  }

  componentDidMount() {
    this.props.getUser();
  }

  render() {
    return (
      <div className="main-container">
        <Sidebar />
        <Content />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loggedIn: state.user.loggedIn
  };
}
export default connect(mapStateToProps, actions)(App);
