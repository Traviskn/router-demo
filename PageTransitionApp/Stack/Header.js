import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Text, TouchableHighlight, View } from 'react-native';
import styles from './styles';

// TODO: Add more header configuration options
// - title
// - right/left button
// - Allow rendering a custom header

export default class Header extends Component {
  static propTypes = {
    goBack: PropTypes.func,
    showBack: PropTypes.bool,
  };

  state = {
    previousProps: null,
  };

  animation = new Animated.Value(0);

  componentWillReceiveProps(nextProps) {
    if (nextProps.transition || nextProps.isPanning) {
      this.setState(
        {
          previousProps: this.props,
        },
        () => {
          Animated.timing(this.animation, {
            duration: 500,
            toValue: 1,
            useNativeDriver: true,
          }).start(() => {
            this.animation = new Animated.Value(0);
          });
        }
      );
    } else {
      this.setState({ previousProps: null });
    }
  }

  render() {
    const { goBack, showBack, transition } = this.props;
    const { previousProps } = this.state;

    if (this.state.previousProps) {
      const thisHeader = (
        <Animated.View style={[styles.header, { position: 'absolute', top: 0, right: 0, left: 0, opacity: this.animation }]}>
          {showBack &&
            <TouchableHighlight onPress={goBack}>
              <Text style={styles.backText}>&lt;</Text>
            </TouchableHighlight>}

          <Text>HEADER</Text>
        </Animated.View>
      );

      const previousHeader = (
        <Animated.View
          style={[
            styles.header,
            {
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
              opacity: this.animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            },
          ]}>
          {previousProps.showBack &&
            <TouchableHighlight>
              <Text style={styles.backText}>&lt;</Text>
            </TouchableHighlight>}

          <Text>HEADER</Text>
        </Animated.View>
      );

      const headers = [];
      if (transition === 'PUSH') {
        headers.push(previousHeader);
        headers.push(thisHeader);
      } else {
        headers.push(thisHeader);
        headers.push(previousHeader);
      }

      return (
        <View style={styles.header}>
          {headers[0]}
          {headers[1]}
        </View>
      );
    }

    return (
      <View style={styles.header}>
        {showBack &&
          <TouchableHighlight onPress={goBack}>
            <Text style={styles.backText}>&lt;</Text>
          </TouchableHighlight>}

        <Text>HEADER</Text>
      </View>
    );
  }
}
