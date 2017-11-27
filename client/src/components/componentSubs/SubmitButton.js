import React, { Component } from 'react';

class SubmitButton extends Component {
  render() {
    const tabIndex = this.props.tabIndex
      ? { tabIndex: this.props.tabIndex }
      : {};
    return (
      <button type="submit" className={this.props.classes}>
        {this.props.children}
        <i
          className="fa fa-circle-o-notch fa-spin fa-fw"
          style={{ display: this.props.loader ? 'inline-block' : 'none' }}
          {...tabIndex}
        />
      </button>
    );
  }
}

export default SubmitButton;
