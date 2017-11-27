import React from 'react';

const SocialOptions = () => {
  return (
    <div
      className="row social-options"
      onClick={() => (window.location = '/api/login/google')}
    >
      <div className="option--google">
        <div className="social-icon">
          <i className="fa fa-google" aria-hidden="true" />
        </div>
        <div className="social-text">
          <a href="/api/login/google">
            <span />
            <span />
          </a>
        </div>
      </div>

      <div
        className="option--facebook"
        onClick={() => (window.location = '/api/login/facebook')}
      >
        <div className="social-icon">
          <i className="fa fa-facebook" aria-hidden="true" />
        </div>
        <div className="social-text">
          <a href="/api/login/facebook">
            <span />
            <span />
          </a>
        </div>
      </div>

      <div
        className="option--gitHub"
        onClick={() => (window.location = '/api/login/github')}
      >
        <div className="social-icon">
          <i className="fa fa-github" aria-hidden="true" />
        </div>
        <div className="social-text">
          <a href="/api/login/github">
            <span />
            <span />
          </a>
        </div>
      </div>
    </div>
  );
};
export default SocialOptions;
