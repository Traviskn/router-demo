import React, { Component } from 'react';
import { Animated, Text } from 'react-native';
import styles from './styles';

export default class Sidebar extends Component {
  state = {
    anim: new Animated.Value(this.props.isOpen ? 2 : 0),
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen !== this.props.isOpen) {
      Animated.timing(this.state.anim, {
        toValue: nextProps.isOpen ? 2 : 0,
      }).start();
    }
  }

  render() {
    return <Animated.View style={[styles.sidebar, { flex: this.state.anim }]} />;
  }
}
