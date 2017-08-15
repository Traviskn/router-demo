import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Dimensions, View } from 'react-native';
import { withRouter } from 'react-router-native';
import styles from './styles';

const { width } = Dimensions.get('window');
const pushingStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: width,
  right: -width,
  backgroundColor: 'white',
};

class RouteStack extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  state = {
    previousChildren: null,
    animation: new Animated.Value(0),
    transition: null,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.key !== this.props.location.key) {
      const { action } = nextProps.history;

      this.setState(
        {
          previousChildren: this.props.children,
          transition: action,
        },
        () => {
          Animated.timing(this.state.animation, {
            toValue: action === 'PUSH' ? -width : width,
          }).start(() => {
            this.setState({
              previousChildren: null,
              transition: null,
              animation: new Animated.Value(0),
            });
          });
        }
      );
    }
  }

  render() {
    const { children } = this.props;
    const { previousChildren, animation, transition } = this.state;
    const { stackView } = styles;

    let routes = [];
    if (transition === 'PUSH') {
      routes.push(
        <Animated.View style={stackView}>
          {previousChildren}
        </Animated.View>
      );
      routes.push(
        <Animated.View style={[pushingStyle, { transform: [{ translateX: animation }] }]}>
          {children}
        </Animated.View>
      );
    } else if (transition === 'POP') {
      routes.push(
        <Animated.View style={stackView}>
          {children}
        </Animated.View>
      );
      routes.push(
        <Animated.View style={[stackView, { transform: [{ translateX: animation }] }]}>
          {previousChildren}
        </Animated.View>
      );
    } else {
      return (
        <View style={stackView}>
          {children}
        </View>
      );
    }

    return (
      <View style={styles.stackView}>
        {routes[0]}
        {routes[1]}
      </View>
    );
  }
}

export default withRouter(RouteStack);
