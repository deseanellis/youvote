import React, { Component } from 'react';
import { connect } from 'react-redux';

const POLL_VIEW_OPTIONS = [
  {
    title: '<i class="fa fa-fire" aria-hidden="true"></i> Most Popular Polls',
    url: '/poll/viewer/popular',
    authenticationRequired: false
  },
  {
    title: 'Create New Poll',
    url: '/poll/mode/create',
    authenticationRequired: true
  },
  {
    title: 'View All Polls',
    url: '/poll/viewer/all',
    authenticationRequired: false
  },
  {
    title: 'View My Polls',
    url: '/poll/viewer/personal',
    authenticationRequired: true
  },
  {
    title: 'View Polls Voted On',
    url: '/poll/viewer/voted',
    authenticationRequired: true
  }
];

const PROFILE_VIEW_OPTIONS = [
  {
    title: 'Basic Information',
    url: '/basicinformation',
    socialCanAccess: false
  },
  {
    title: 'Change Password',
    url: '/changepassword',
    socialCanAccess: false
  },
  {
    title: 'Logout',
    url: '/api/user/logout',
    socialCanAccess: true
  }
];

class Sidebar extends Component {
  constructor() {
    super();

    this.state = {
      loadAvatarError: false
    };
  }

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
                src={
                  !this.state.loadAvatarError
                    ? this.getUserImage(user)
                    : this.getUserImage()
                }
                style={{ cursor: 'pointer' }}
                className="img-fluid rounded-circle user-avatar"
                alt="avatar"
                onClick={() => (window.location = '/basicinformation')}
                onError={() => this.errorUserImage(true)}
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
                {this.buildPollLinks(POLL_VIEW_OPTIONS, user)}
              </ul>
            </div>
            {user &&
              user._id &&
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
                  {this.buildProfileLinks(PROFILE_VIEW_OPTIONS, user)}
                </ul>
              </div>}
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

  errorUserImage(loadAvatarError) {
    this.setState({
      loadAvatarError
    });
  }

  getUserName(user) {
    if (user) {
      var __html = user.fullName;
      if (user.fullName === 'Guest') {
        __html +=
          '<br /><div style="margin-top: 4px"><a href="/register">Sign In/Register</a><div>';
      }
      return { __html };
    }
    return { __html: '' };
  }

  buildProfileLinks(profileLinks, user) {
    return profileLinks.map((profileLink, i) => {
      if (!profileLink.socialCanAccess && user.isSocial) {
        return false;
      }
      return (
        <li key={i}>
          <a
            href={profileLink.url}
            dangerouslySetInnerHTML={{ __html: profileLink.title }}
          />
        </li>
      );
    });
  }
  buildPollLinks(pollLinks, user) {
    var isLoggedIn = user && user._id ? true : false;
    return pollLinks.map((pollLink, i) => {
      if (pollLink.authenticationRequired && !isLoggedIn) {
        return false;
      }
      return (
        <li key={i}>
          <a
            href={pollLink.url}
            dangerouslySetInnerHTML={{ __html: pollLink.title }}
          />
        </li>
      );
    });
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.user
  };
}

export default connect(mapStateToProps)(Sidebar);
