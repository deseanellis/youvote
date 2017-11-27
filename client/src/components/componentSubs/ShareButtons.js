import React, { Component } from 'react';
const ShareButton = props => {
  return (
    <a
      className={props.classNames}
      href={`${props.shareURL}${window.location.href}`}
      target="_blank"
    >
      <i className={`fa fa-${props.iconName} fa-lg`} aria-hidden="true" />
    </a>
  );
};

class ShareButtons extends Component {
  render() {
    return (
      <div className="share-buttons-group">
        {this.renderButtons(this.props.buttons)}
      </div>
    );
  }

  renderButtons(buttons) {
    return buttons.map((button, index) => {
      let genButton;
      switch (button) {
        case 'Twitter':
          genButton = (
            <ShareButton
              key={index}
              classNames="btn--share-twitter"
              shareURL="https://twitter.com/home?status="
              iconName="twitter"
            />
          );
          break;
        case 'Facebook':
          genButton = (
            <ShareButton
              key={index}
              classNames="btn--share-facebook"
              shareURL="https://www.facebook.com/sharer/sharer.php?u="
              iconName="facebook-official"
            />
          );
          break;
        case 'Google':
          genButton = (
            <ShareButton
              key={index}
              classNames="btn--share-google"
              shareURL="https://plus.google.com/share?url="
              iconName="google"
            />
          );
          break;
        case 'WhatsApp':
          genButton = (
            <ShareButton
              key={index}
              classNames="btn--share-whatsapp"
              shareURL="whatsapp://send?text="
              iconName="whatsapp"
            />
          );
          break;
        default:
          genButton = <a href="/">No Link</a>;
      }

      return genButton;
    });
  }
}

export default ShareButtons;
