import React, { Component } from 'react';
import { connect } from 'react-redux';
//import { Link } from 'react-router-dom';

class Sidebar extends Component {
  render() {
    const { user } = this.props;

    return (
      <div className="sidebar-container">
        <div className="logo-container">
          <a href="/">
            <img
              src={`${process.env.PUBLIC_URL}/images/youvote_logo_white.png`}
              className="img-fluid"
              alt="logo"
            />
          </a>
          <div className="actions">
            {
              <button className="btn--action-menu-close" type="button">
                <i className="fa fa-times" aria-hidden="true" />
              </button>
            }
          </div>
        </div>
        <div className="sidebar-body">
          <div className="user-details">
            <div className="image-container">
              <img
                src={this.getUserImage(user)}
                style={{ cursor: 'pointer' }}
                className="img-fluid rounded-circle"
                alt="avatar"
                onClick={() => (window.location = '/basicinformation')}
              />
            </div>
            <div
              className="information"
              dangerouslySetInnerHTML={this.getUserName(user)}
            />
          </div>
          <div className="nav-menu">
            <div className="menu-item-1">
              <div className="heading">
                <div className="icon">
                  <i className="fa fa-check-square-o" aria-hidden="true" />
                </div>
                <div className="title"> My Polls</div>
                <div className="caret">
                  <i className="fa fa-chevron-down" aria-hidden="true" />
                </div>
              </div>
              <ul className="list-heading-1">
                <li>
                  <a href="/poll/mode/create">Create New Poll</a>
                </li>
                <li>
                  <a href="/poll/viewer/all">View All Polls</a>
                </li>
                <li>
                  <a href="/poll/viewer/personal">View My Polls</a>
                </li>
                <li>
                  <a href="/poll/viewer/voted">View Polls Voted On</a>
                </li>
              </ul>
            </div>
            <div className="menu-item-2">
              <div className="heading">
                <div className="icon">
                  <i className="fa fa-id-card-o" aria-hidden="true" />
                </div>
                <div className="title"> My Profile</div>
                <div className="caret">
                  <i className="fa fa-chevron-down" aria-hidden="true" />
                </div>
              </div>
              <ul className="list-heading-2">
                <li>
                  <a href="/basicinformation">Basic Information</a>
                </li>
                <li>
                  <a href="/changepassword">Change Password</a>
                </li>
                <li>
                  <a href="/api/user/logout">Logout</a>
                </li>
              </ul>
            </div>
            <div
              className="footnotes"
              dangerouslySetInnerHTML={{
                __html:
                  'Copyright &copy; 2017<br /><a href="http://www.deseanellis.me" target="_blank">DeSean Ellis</a><br />Free Code Camp Project<br />'
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  getUserImage(user) {
    if (!user || !user.avatar) {
      return `${process.env.PUBLIC_URL}/images/placeholder_user.jpg`;
    }

    return user.avatar;
  }

  getUserName(user) {
    if (user) {
      return { __html: user.fullName };
    }
    return { __html: '' };
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.user
  };
}

export default connect(mapStateToProps)(Sidebar);
