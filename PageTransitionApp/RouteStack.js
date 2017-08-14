import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Dimensions, View } from 'react-native';
import { withRouter } from 'react-router-native';
import styles from './styles';

const { width } = Dimensions.get('window');

class RouteStack extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  state = {
    previousChildren: null,
    animation: new Animated.Value(0),
  };

  componentWillReceiveProps(nextProps) {
    // console.log('WILL RECEIVE PROPS');
    if (nextProps.location.key !== this.props.location.key) {
      // console.log('NEW ROUTE!  SAVE THE CHILDREN!');
      const { action } = nextProps.history;

      this.setState(
        {
          previousChildren: this.props.children,
        },
        () => {
          Animated.timing(this.state.animation, {
            toValue: action === 'PUSH' ? -width : width,
          }).start(() => {
            this.setState({
              previousChildren: null,
              animation: new Animated.Value(0),
            });
          });
        }
      );
    }
  }

  render() {
    return (
      <View style={styles.stackView}>
        <Animated.View style={styles.stackView}>
          {this.props.children}
        </Animated.View>

        {this.state.previousChildren &&
          <Animated.View
            style={[styles.stackView, { transform: [{ translateX: this.state.animation }] }]}>
            {this.state.previousChildren}
          </Animated.View>}
      </View>
    );
  }
}

export default withRouter(RouteStack);
