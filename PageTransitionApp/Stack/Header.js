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
    animation: PropTypes.instanceOf(Animated.Value),
    animationMax: PropTypes.number,
    animationMin: PropTypes.number,
    transition: PropTypes.string,
    isPanning: PropTypes.bool,
  };

  state = {
    previousShowBack: false,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      previousShowBack: this.props.showBack,
    });
  }

  render() {
    const {
      animation,
      animationMax,
      animationMin,
      goBack,
      isPanning,
      showBack,
      transition,
    } = this.props;

    if (transition || isPanning) {
      console.log('HEADER TRANSITION');
      const thisHeader = (
        <Animated.View
          style={[
            styles.header,
            styles.animatingHeader,
            {
              opacity: animation.interpolate({
                inputRange: [animationMin, 0, animationMax],
                outputRange: [1, 0, 1],
              }),
            },
          ]}>
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
            styles.animatingHeader,
            {
              opacity: animation.interpolate({
                inputRange: [animationMin, 0, animationMax],
                outputRange: [0, 1, 0],
              }),
            },
          ]}>
          {this.state.previousShowBack &&
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
        // POP and panning cases
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
