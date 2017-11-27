import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

class ResendValidation extends Component {
  constructor() {
    super();

    this.state = {
      message: 'Processing request, please wait...'
    };
  }

  async componentDidMount() {
    const { match: { params } } = this.props;
    if (params.email) {
      try {
        const res = await axios.post('/api/resend', { email: params.email });
        if (res.data.success) {
          this.setState({
            message: `<span class="success-message">Validation link has been re-sent successfully to: ${params.email}.</span><br />Please check inbox/spam/junk folders.`
          });
        } else {
          this.setState({
            message: `<span class="error-message">${res.data.error}</span>`
          });
        }
      } catch (e) {
        this.setState({
          message: `<span class="error-message">Request failed, please try again.</span>`
        });
      }
    }
  }

  render() {
    return (
      <div className="content-box">
        <div className="title">Re-Send E-Mail Validation</div>
        <h5 dangerouslySetInnerHTML={{ __html: this.state.message }} />
        <p style={{ marginTop: '5px' }}>
          You can return home by clicking here: <Link to="/">Home</Link>
        </p>
      </div>
    );
  }
}

export default ResendValidation;
