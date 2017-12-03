import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Helmet } from 'react-helmet';
import NiceColorPalettes from 'nice-color-palettes';
import { Doughnut } from 'react-chartjs-2';
import * as actions from '../../actions';

import NotFound from './NotFound';
import RadioField from '../componentSubs/RadioField';
import SubmitButton from '../componentSubs/SubmitButton';
import PageLoader from '../componentSubs/PageLoader';
import ShareButtons from '../componentSubs/ShareButtons';

class SinglePoll extends Component {
  constructor() {
    super();

    this.state = {
      loader: false
    };
  }

  componentDidMount() {
    const { getPoll, match: { params } } = this.props;
    getPoll(params.id);
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
    const { state } = this;
    const {
      user,
      currentPoll,
      chartPoll,
      handleSubmit,
      match: { params },
      regVote
    } = this.props;
    console.log('Testing current poll status infomation', currentPoll);
    if (currentPoll === null) {
      return <PageLoader />;
    } else if (currentPoll === false) {
      return <NotFound />;
    } else {
      return (
        <div className="content-box">
          <Helmet>
            <title>{`YouVote | ${currentPoll.title}`}</title>
          </Helmet>
          <div className="title">
            {user._id === currentPoll.user &&
              <button
                className="btn--edit-poll"
                type="button"
                title="Edit Poll"
                onClick={() =>
                  (window.location = `/poll/mode/edit/${params.id}`)}
              >
                <i className="fa fa-pencil-square-o" aria-hidden="true" />
              </button>}
            {currentPoll.title}
          </div>
          <div className="body">
            <ShareButtons
              buttons={['Facebook', 'Twitter', 'Google', 'WhatsApp']}
            />
            <p>Vote using the options below:</p>
            <form
              onSubmit={handleSubmit(values => {
                regVote(params.id, values.option);
                this.setState({ loader: true });
              })}
            >
              <div className="container-fluid">
                <div className="row form">
                  <div className="col-sm-10 offset-sm-1">
                    <ul className="custom-radio">
                      {this.renderFields(currentPoll.options)}
                    </ul>
                  </div>
                </div>
                <div className="row form">
                  <div className="col-sm-10 offset-sm-1">
                    <SubmitButton classes="main submit" loader={state.loader}>
                      Submit Vote
                    </SubmitButton>
                  </div>
                </div>
              </div>
            </form>
            <div className="container-fluid chart-container">
              <div className="row form">
                <div className="col-sm-10 offset-sm-1">
                  {chartPoll.length > 0 &&
                    <Doughnut data={this.buildChartData(chartPoll)} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  renderFields(options) {
    return options.map((option, index) => {
      return (
        <Field
          key={index}
          index={index}
          title={option}
          name="option"
          component={RadioField}
        />
      );
    });
  }

  buildChartData(chartPoll) {
    let labels = chartPoll.map(option => {
      return option._id;
    });

    let data = chartPoll.map(option => {
      return option.count;
    });

    var colors = NiceColorPalettes[3];

    return {
      labels,
      datasets: [
        { data, backgroundColor: colors, hoverBackgroundColor: colors }
      ]
    };
  }
}

function mapStateToProps({
  poll: { requestReceived, currentPoll, chartPoll },
  user: { user }
}) {
  return {
    requestReceived,
    currentPoll,
    chartPoll,
    user
  };
}
SinglePoll = connect(mapStateToProps, actions)(SinglePoll);

export default reduxForm({
  form: 'singlePoll'
})(SinglePoll);
