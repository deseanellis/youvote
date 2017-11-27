import React from 'react';
import { Link } from 'react-router-dom';

const Home = props => {
  const ActionButtons = props => {
    if (props.loggedIn === false) {
      return (
        <div className="action-buttons">
          <Link to="/register" className="btn--action-register">
            Register
          </Link>
          <Link to="/signin" className="btn--action-signin">
            Sign In
          </Link>
        </div>
      );
    } else {
      return <div />;
    }
  };

  return (
    <div className="content-box home">
      <div className="container-fluid">
        <div className="row logo">
          <div className="col-sm-12">
            <img
              src="images/youvote_logo.png"
              className="img-responsive"
              alt="logo"
            />
          </div>
        </div>
      </div>
      <div className="body">
        <p className="text-center">
          Custom polling mobile-friendly platform, providing instant results and
          incorporating social network integration.<br />The voting platform of
          choice for your personal and commerical needs.
        </p>
        <ActionButtons loggedIn={props.loggedIn} />
      </div>
    </div>
  );
};

export default Home;
