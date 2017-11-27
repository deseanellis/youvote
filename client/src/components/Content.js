import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import _ from 'lodash';

import * as actions from '../actions';

//Import Content Subs
import Home from './contentSubs/Home';
import RecentPolls from './contentSubs/RecentPolls';
import Register from './contentSubs/Register';
import CreatePoll from './contentSubs/CreatePoll';
import SinglePoll from './contentSubs/SinglePoll';
import PollsViewer from './contentSubs/PollsViewer';
import BasicInformation from './contentSubs/BasicInformation';
import SearchResults from './contentSubs/SearchResults';
import ChangePassword from './contentSubs/ChangePassword';
import ForgotPassword from './contentSubs/ForgotPassword';
import ResendValidation from './contentSubs/ResendValidation';
import NotFound from './contentSubs/NotFound';

const THROTTLE_SPEED = 500;
const MIN_SEACH_CHARS = 2;

class Content extends Component {
  onSearchChange(ev) {
    let keywords = ev.target.value;
    this.setState({
      keywords
    });
  }

  onSearchExecute(keywords) {
    this.props.searchPolls(keywords);
  }

  searchMode(toEnable) {
    let mode = toEnable ? 'search' : 'browser';
    this.setState({
      mode
    });

    if (mode === 'browser') {
      this.setState({
        keywords: ''
      });
    }
  }

  constructor() {
    super();

    this.state = {
      keywords: '',
      mode: 'browser'
    };
  }

  componentWillMount() {
    this.onSearchExecuteDebounced = _.debounce(() => {
      if (
        this.state.keywords.length > MIN_SEACH_CHARS ||
        this.state.keywords.length === 0
      ) {
        this.props.searchPolls.call(this, this.state.keywords);
      }
    }, THROTTLE_SPEED);
  }

  render() {
    return (
      <div className="content-container">
        <div className="header-container">
          <div className="actions">
            <button className="btn--action-menu" type="button">
              <i className="fa fa-bars" aria-hidden="true" />
            </button>
          </div>
          <div className="searchbar">
            <input
              id="keywords"
              type="text"
              name="keywords"
              className="searchbar"
              placeholder={'\uf002 Search'}
              value={this.state.keywords}
              onClick={() => this.searchMode.call(this, true)}
              onChange={e => {
                this.onSearchChange.call(this, e);
                this.onSearchExecuteDebounced();
              }}
            />
          </div>
          <div className="actions">
            {this.state.mode === 'search' &&
              <button
                className="btn--action-clear"
                title="Clear Search"
                onClick={() => {
                  this.searchMode.call(this, false);
                  this.onSearchExecuteDebounced();
                }}
              >
                <i className="fa fa-times" aria-hidden="true" />
              </button>}
            {this.state.mode === 'browser' &&
              <button
                className="btn--action-add"
                title="Add Poll"
                onClick={() => (window.location = '/poll/mode/create')}
              >
                <i className="fa fa-plus" aria-hidden="true" />
              </button>}
          </div>
        </div>
        {this.state.mode === 'search' &&
          <SearchResults polls={this.props.polls || []} />}
        {this.state.mode === 'browser' &&
          <BrowserRouter>
            <div className="content-body">
              <Switch>
                <Route path="/" exact>
                  <div>
                    <Route
                      render={() => <Home loggedIn={this.props.loggedIn} />}
                      exact
                    />
                    <Route component={RecentPolls} exact />
                  </div>
                </Route>
                <Route
                  path="/register"
                  render={() =>
                    <Register view="register" title="Sign Up For Free" />}
                  exact
                />
                <Route
                  path="/signin"
                  render={() =>
                    <Register view="signin" title="Sign Into Your Account" />}
                  exact
                />
                <Route
                  path="/poll/mode/:mode/:id?"
                  component={CreatePoll}
                  exact
                />
                <Route path="/poll/single/:id" component={SinglePoll} exact />
                <Route
                  path="/poll/viewer/:mode/:page?"
                  component={PollsViewer}
                />
                <Route
                  path="/basicinformation/:response?"
                  component={BasicInformation}
                />
                <Route
                  path="/forgotpassword"
                  component={ForgotPassword}
                  exact
                />
                <Route
                  path="/changepassword/:code?/:email?"
                  component={ChangePassword}
                  exact
                />
                <Route
                  path="/resend/validation/:email"
                  component={ResendValidation}
                  exact
                />
                {/*<Route component={NotFound} />*/}
              </Switch>
            </div>
          </BrowserRouter>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    polls: state.poll.searchResults,
    loggedIn: state.user.loggedIn
  };
}
export default connect(mapStateToProps, actions)(Content);
