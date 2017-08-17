import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing, Dimensions, View } from 'react-native';
import styles from './styles';

// TODO: Add PanResponder to enable navigating back by swiping

// TODO: Add option for a persistent header between routes on the stack

// FIXME: Width could change on rotation
// width could depend on the layout of the parent view
// better to get width from a layout event
const { width } = Dimensions.get('window');
const offscreen = {
  left: width,
  right: -width,
};

export default class StackTransitioner extends Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    history: PropTypes.object,
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
          // TODO: add more animation options and make animation configurable
          // - default to platform default (slide ios, fade android)
          // - base default slide direction on `I18nManager.isRTL`
          // - fade in from bottom/top
          // - fade out to bottom/top
          // - slide in from bottom/top
          // - slide out to bottom/top
          Animated.timing(this.state.animation, {
            duration: 500,
            toValue: action === 'PUSH' ? -width : width,
            easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99),
            useNativeDriver: true,
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
        <Animated.View style={[stackView, offscreen, { transform: [{ translateX: animation }] }]}>
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
      <View style={stackView}>
        {routes[0]}
        {routes[1]}
      </View>
    );
  }
}
