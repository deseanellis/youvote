import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../../actions';

import RegistrationField from '../componentSubs/RegistrationField';
import SubmitButton from '../componentSubs/SubmitButton';

import { REGISTRATION_FORM_FIELDS } from '../formData';

import { validate, asyncValidate } from './validation';

class RegistrationForm extends Component {
  constructor() {
    super();

    this.state = {
      loader: false
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.requestReceived !== prevProps.requestReceived) {
      if (this.props.requestReceived > 0) {
        this.setState({
          loader: false
        });
      }
    }
  }

  render() {
    return (
      <form
        onSubmit={this.props.handleSubmit(values => {
          this.props.registerUser(values, this.props.history);
          this.setState({ loader: true });
        })}
      >
        {this.renderFields(REGISTRATION_FORM_FIELDS)}
        <div className="row form">
          <div className="col-sm-10 offset-sm-1">
            <SubmitButton classes="main submit" loader={this.state.loader}>
              Get Started
            </SubmitButton>
          </div>
        </div>
      </form>
    );
  }

  renderFields(fields) {
    return fields.map((field, index) => {
      if (Array.isArray(field)) {
        return (
          <div key={index} className="row form">
            {field.map((subField, subIndex) => {
              let dualFields = [];
              dualFields.push(
                <Field
                  key={index + '.' + subIndex}
                  id={subField.name}
                  name={subField.name}
                  placeholder={
                    subField.required ? subField.label + ' *' : subField
                  }
                  type={subField.type}
                  array={true}
                  pos={subIndex}
                  component={RegistrationField}
                />
              );
              return dualFields;
            })}
          </div>
        );
      } else {
        return (
          <div key={index} className="row form">
            <Field
              key={index}
              id={field.name}
              name={field.name}
              placeholder={field.required ? field.label + ' *' : field}
              type={field.type}
              array={false}
              pos={index}
              component={RegistrationField}
            />
          </div>
        );
      }
    });
  }
}

function mapStateToProps(state) {
  return {
    requestReceived: state.registry.requestReceived
  };
}

RegistrationForm = connect(mapStateToProps, actions)(
  withRouter(RegistrationForm)
);

export default reduxForm({
  validate,
  form: 'registrationForm',
  asyncValidate,
  asyncBlurFields: ['email']
})(RegistrationForm);
