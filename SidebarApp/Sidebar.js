import React, { Component } from 'react';
import { Animated, Dimensions, Text } from 'react-native';
import styles from './styles';

const { width } = Dimensions.get('window');
const sidebarWidth = width / 3;

export default class Sidebar extends Component {
  state = {
    animation: new Animated.Value(this.props.isOpen ? 0 : -sidebarWidth),
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen !== this.props.isOpen) {
      Animated.timing(this.state.animation, {
        toValue: nextProps.isOpen ? 0 : -sidebarWidth,
      }).start();
    }
  }

  render() {
    return (
      <Animated.View
        style={[
          styles.sidebar,
          {
            width: sidebarWidth,
            transform: [{ translateX: this.state.animation }],
          },
        ]}>
        <Text style={styles.menuText}>Menu Item 1</Text>
        <Text style={styles.menuText}>Menu Item 2</Text>
        <Text style={styles.menuText}>Menu Item 3</Text>
      </Animated.View>
    );
  }
}
