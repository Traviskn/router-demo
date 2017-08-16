import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, withRouter } from 'react-router-native';
import StackTransitioner from './StackTransitioner';

class Stack extends Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    history: PropTypes.object,
  };

  render() {
    return (
      <StackTransitioner location={this.props.location} history={this.props.history}>
        <Switch location={this.props.location}>
          {this.props.children}
        </Switch>
      </StackTransitioner>
    );
  }
}

export default withRouter(Stack);
