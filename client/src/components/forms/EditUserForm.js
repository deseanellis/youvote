import React, { Component } from 'react';

//kb * 1000 = bytes
const UPLOAD_SIZE_LIMIT = 500 * 1000;

class EditUserForm extends Component {
  constructor(props) {
    super(props);

    const { user } = this.props;

    this.state = {
      firstName: user.firstName,
      lastName: user.lastName,
      isSocial: user.isSocial,
      errors: null,
      uploadFilename: ''
    };
  }

  render() {
    const {
      firstName,
      lastName,
      isSocial,
      errors,
      uploadFilename
    } = this.state;
    let style = isSocial ? { cursor: 'not-allowed' } : {};
    return (
      <form
        action="/api/user/update/basic"
        encType="multipart/form-data"
        method="POST"
        onSubmit={e => this.onSubmitHandler.call(this, e)}
      >
        <div className="container-fluid">
          <div className="row form">
            <div className="col-sm-10 offset-sm-1">
              <input
                type="text"
                placeholder="First Name *"
                name="firstName"
                value={firstName}
                onChange={e => this.onInputChange(e.target)}
                onBlur={e => this.onInputBlur.call(this, e.target)}
                disabled={isSocial}
                style={style}
              />
              {errors &&
                (errors.firstName &&
                  <div className="field error">
                    {`\uf06a ${errors.firstName}`}
                  </div>)}
            </div>
          </div>
          <div className="row form">
            <div className="col-sm-10 offset-sm-1">
              <input
                type="text"
                placeholder="Last Name *"
                name="lastName"
                value={lastName}
                onChange={e => this.onInputChange(e.target)}
                onBlur={e => this.onInputBlur.call(this, e.target)}
                disabled={isSocial}
                style={style}
              />
              {errors &&
                (errors.lastName &&
                  <div className="field error">
                    {`\uf06a ${errors.lastName}`}
                  </div>)}
            </div>
          </div>
          <div className="row form group">
            <p>
              Browse and select your profile image.<br />
              <span className="error-message" style={{ fontStyle: 'italic' }}>
                Accepted file types (jpg, jpeg, png). File size must be less
                than 500kb. For best viewing, please use <b>squared</b> images.
              </span>
            </p>
            <div className="col-sm-8 offset-sm-1">
              <input
                type="text"
                placeholder="Upload Profile Picture"
                name="avatar_holder"
                id="avatar_holder"
                readOnly
                value={uploadFilename}
              />
            </div>
            <div className="col-sm-2 image-uploader">
              <button
                className="btn--upload-image"
                type="button"
                title="Upload Profile Picture"
                disabled={isSocial}
                style={style}
                onClick={e => {
                  if (!isSocial) {
                    document.querySelector('#avatar').click();
                  } else {
                    e.preventDefault();
                    return false;
                  }
                }}
              >
                <i className="fa fa-upload" aria-hidden="true" /> Browse
              </button>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/jpeg, image/png"
                onChange={e => this.onFileUpload.call(this, e)}
              />
            </div>
          </div>
          <div className="row form">
            <div className="col-sm-10 offset-sm-1">
              <button
                type="submit"
                className="main submit"
                disabled={isSocial}
                style={style}
              >
                Update My Profile
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }

  onFileUpload(e) {
    if (e.target.files.length === 1) {
      var file = e.target.files[0];
      if (file.size > UPLOAD_SIZE_LIMIT) {
        this.setState({
          uploadFilename: 'File size too large.'
        });
        //Clear FileList
        e.target.value = '';
        return false;
      }
      this.setState({
        uploadFilename: file.name
      });
      return true;
    } else {
      this.setState({
        uploadFilename: 'No file uploaded'
      });
      return false;
    }
  }
  onInputChange(target) {
    let newState = {};
    newState[target.name] = target.value;
    this.setState(newState);
  }

  onInputBlur(target) {
    let errors = { ...this.state.errors };
    if (!this.state[target.name]) {
      let nameToLowerCase = target.name.toLowerCase();
      errors[target.name] = `Enter a ${nameToLowerCase}`;
      this.setState({
        errors
      });
    } else {
      errors[target.name] = null;
      this.setState({
        errors
      });
    }
  }
  onSubmitHandler(e) {
    //Check values
    let errors = false;
    if (!this.state.firstName) {
      errors = true;
      this.setState({
        errors: { firstName: 'Enter a first name' }
      });
    }

    if (!this.state.lastName) {
      errors = true;
      this.setState({
        errors: { lastName: 'Enter a last name' }
      });
    }

    if (errors) {
      e.preventDefault();
    }
  }
}

export default EditUserForm;
