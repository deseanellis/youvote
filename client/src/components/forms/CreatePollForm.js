import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import _ from 'lodash';

import SubmitButton from '../componentSubs/SubmitButton';
import VotingOption from '../componentSubs/VotingOption';
import GenericField from '../componentSubs/GenericField';

import { validateCreatePoll } from './validation';

import TableCheckbox from '../componentSubs/TableCheckbox';

//Limt of Options
const OPTIONS_LIMIT = 20;

class CreatePollForm extends Component {
  constructor() {
    super();

    this.state = {
      options: [{ value: '' }],
      isPrivate: false,
      loader: false,
      error: false
    };

    //Bind Functions
    this.addNewOption = this.addNewOption.bind(this);
    this.onPrivateClick = this.onPrivateClick.bind(this);
    this.deleteOption = this.deleteOption.bind(this);
    this.setOptionValue = this.setOptionValue.bind(this);
    this.arrangeOptions = this.arrangeOptions.bind(this);
    this.anyOptionsEntered = this.anyOptionsEntered.bind(this);
    this.duplicatedOptions = this.duplicatedOptions.bind(this);
  }

  componentDidMount() {
    const { mode, options, isPrivate } = this.props;

    if (mode === 'edit') {
      let updateOptions = options.map(option => {
        return { value: option, disabled: true };
      });
      this.setState({
        options: updateOptions,
        isPrivate
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.requestReceived !== prevProps.requestReceived) {
      if (this.props.requestReceived > 0) {
        this.setState({
          loader: false
        });
      }

      if (this.props.currentPoll !== prevProps.currentPoll) {
        if (this.props.mode === 'create') {
          this.setState({
            options: [{ value: '' }],
            isPrivate: false
          });
        }
      }
    }
  }

  render() {
    const { handleSubmit, createPoll, editPoll, mode, id } = this.props;
    const { state } = this;
    return (
      <form
        onSubmit={handleSubmit(values => {
          if (!this.anyOptionsEntered() || !this.duplicatedOptions()) {
            this.setState({
              error: true
            });
          } else {
            this.setState({
              error: false
            });
            if (mode === 'edit') {
              editPoll(id, this.state.options, this.state.isPrivate);
            } else {
              createPoll({
                ...values,
                options: this.state.options,
                isPrivate: this.state.isPrivate
              });
            }
            this.setState({ loader: true });
          }
        })}
        onClick={() => this.setState({ error: false })}
      >
        <div className="container-fluid">
          <div className="row form">
            {mode === 'create' &&
              <Field
                id="title"
                name="title"
                placeholder="Title *"
                type="text"
                tabIndex={1}
                component={GenericField}
              />}
          </div>
          <div className="row form">
            <div className="col-sm-10 offset-sm-1">
              <span style={{ fontStyle: 'italic', color: '#848484' }}>
                Private polls cannot be seen in <b>Searches</b> or{' '}
                <b>All Poll Listings</b>.
                <br />
                You must share the link with your pollers for them to view.
              </span>
              <br />
              <TableCheckbox
                label="Set as Private"
                name="private"
                value={this.state.isPrivate}
                onClickHandler={this.onPrivateClick}
              />
            </div>
          </div>

          <div className="row form group">
            <p>
              Enter your voting options below.
              <br />
              <span
                style={{
                  fontStyle: 'italic',
                  color: '#f39b3e',
                  fontWeight: 'bold'
                }}
              >
                At least 2 options required. Max options: 20
              </span>
            </p>

            <div className="col-sm-10 offset-sm-1">
              {state.error &&
                <div className="field error">
                  {`\uf06a Enter at least two (2) options. Options cannot be duplicated`}
                </div>}
              <ul className="voting-options">
                {this.renderOptions()}
              </ul>
            </div>
          </div>
          <div className="row form">
            <div className="col-sm-10 offset-sm-1">
              <SubmitButton
                classes="main submit"
                loader={state.loader}
                tabIndex={2 + state.options.length}
              >
                {mode === 'edit' ? 'Update Poll' : 'Create New Poll'}
              </SubmitButton>
            </div>
          </div>
        </div>
      </form>
    );
  }

  onPrivateClick() {
    let isPrivate = !this.state.isPrivate;
    this.setState({
      isPrivate
    });
  }

  addNewOption() {
    var options = [...this.state.options];
    //Check if all options have values, if not then return false, else add new option

    var emptyOption = false;
    options.forEach(option => {
      if (option.value.trim().length === 0) {
        emptyOption = true;
        return;
      }
    });

    if (emptyOption) return false;
    if (options.length === OPTIONS_LIMIT) return false;
    //Push new option
    options.push({ value: '' });

    this.setState({
      options
    });
  }

  deleteOption(index) {
    var options = [...this.state.options];
    if (options.length === 1) {
      //Clear Value
      options[index].value = '';
    } else {
      //Remove Object from Array
      _.pullAt(options, [index]);
    }

    this.setState({
      options
    });
  }

  setOptionValue(index, value) {
    var options = [...this.state.options];
    options[index].value = value;

    this.setState({
      options
    });
  }

  arrangeOptions(index, direction) {
    var options = [...this.state.options];

    //For Up Movement
    if (direction === 'up') {
      //Check if index is first
      if (index === 0) {
        return false;
      }

      //Swap Positions
      let _tmp = { ...options[index - 1] };
      options[index - 1] = { ...options[index] };
      options[index] = _tmp;
    }

    //For Down Movement
    if (direction === 'down') {
      //Check if index is last
      if (index === options.length - 1) {
        return false;
      }

      //Swap Positions
      let _tmp = { ...options[index + 1] };
      options[index + 1] = { ...options[index] };
      options[index] = _tmp;
    }

    this.setState({
      options
    });
  }

  renderOptions() {
    var options = [...this.state.options];
    return options.map((option, index) => {
      return (
        <VotingOption
          key={index}
          index={index + 1}
          value={option.value}
          isFirst={index === 0}
          isLast={index === options.length - 1 ? true : false}
          addNewOption={this.addNewOption}
          setOptionValue={this.setOptionValue}
          deleteOption={this.deleteOption}
          arrangeOptions={this.arrangeOptions}
          disabled={option.disabled}
        />
      );
    });
  }

  anyOptionsEntered() {
    var options = [...this.state.options];
    var count = 0;

    var optionFound = false;
    options.forEach(option => {
      if (option.value.trim().length > 0) {
        count++;
        if (count === 2) {
          optionFound = true;
          return;
        }
      }
    });

    return optionFound;
  }

  duplicatedOptions() {
    var options = [...this.state.options];
    options = options.map(option => {
      let value = option.value.trim();
      return { value };
    });

    if (
      _.uniqWith(options, (a, b) => a.value === b.value).length < options.length
    ) {
      return false;
    }
    return true;
  }
}

function mapStateToProps(state) {
  return {
    requestReceived: state.poll.requestReceived,
    currentPoll: state.poll.currentPoll
  };
}

CreatePollForm = connect(mapStateToProps, actions)(CreatePollForm);

export default reduxForm({
  form: 'createPollForm',
  validate: validateCreatePoll
})(CreatePollForm);
