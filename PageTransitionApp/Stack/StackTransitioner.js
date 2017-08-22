import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Dimensions, Easing, PanResponder, View } from 'react-native';
import Header from './Header';
import styles from './styles';

// TODO: Add a PanResponder to enable navigating back by swiping
// Currently we only keep the last child during the transition, and
// after the transition completes we only render the current match.
// Investigate if it would make sense to keep the entire route stack. In my
// experience with other routers, they actually keep rendering the entire stack
// underneath the current route (componentWillUmount never fires for previous
// routes for example). A multi step form/wizard interface is a good example of
// not wanting the previous screens to unmount, although you could work-around
// with something like Redux. history.entries may be all we need though to know
// which route to navigate back to.
// - Store the parent/previous routes? Store initial index, check history.index && history.canGo(-1)
// - onPanStart set this.panning = true
// - don't animate if this.panning (let user gesture drive animation)
// - panning only goes back, only enable pan if you can go back
// - immediately call history.goBack to get both matching routes to animate
// - onPanRelease determine whether to succeed or cancel
// - succeed finish the slide animation, set this.panning to false
// - cancel; call history .goForward(), finish slide animation, set this.panning to false
// - watch out for race conditions around setting this.panning and the new history location coming in

/**
 * The max duration of the card animation in milliseconds after released gesture.
 * The actual duration should be always less then that because the rest distance
 * is always less then the full distance of the layout.
 */
const ANIMATION_DURATION = 500;

/**
 * The gesture distance threshold to trigger the back behavior. For instance,
 * `1/2` means that moving greater than 1/2 of the width of the screen will
 * trigger a back action
 */
const POSITION_THRESHOLD = 1 / 2;

/**
 * The threshold (in pixels) to start the gesture action.
 */
const RESPOND_THRESHOLD = 1;

/**
 * The distance of touch start from the edge of the screen where the gesture will be recognized
 */
const GESTURE_RESPONSE_DISTANCE_HORIZONTAL = 40;
const GESTURE_RESPONSE_DISTANCE_VERTICAL = 135;

// TODO: Add more header configuration options
// - title
// - right/left button
// - Allow rendering a custom header

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
    transition: null,
  };

  startingIndex = null;

  animation = new Animated.Value(0);

  // maybe store this as transition = 'GESTURE'?  Maybe pull transtion out of state?
  isPanning = false;

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (event, gesture) => {
      return (
        this.props.history.index > this.startingIndex &&
        this.props.history.canGo(-1) &&
        event.nativeEvent.pageX < GESTURE_RESPONSE_DISTANCE_HORIZONTAL &&
        gesture.dx > RESPOND_THRESHOLD
      );
    },

    onPanResponderGrant: (event, { moveX }) => {
      this.isPanning = true;
      this.props.history.goBack();
    },

    // No idea why this Animated.event isn't working...
    // onPanResponderMove: Animated.event([null, { moveX: this.animation }]),
    onPanResponderMove: (event, { moveX }) => {
      this.animation.setValue(moveX);
    },

    onPanResponderRelease: (event, { dx, vx }) => {
      const defaultVelocity = width / ANIMATION_DURATION;
      const velocity = Math.max(Math.abs(vx), defaultVelocity);
      const resetDuration = dx / velocity;
      const goBackDuration = (width - dx) / velocity;

      // first check for significant gesture velocity as signal of intent
      if (vx < -0.5) {
        this.cancelPan(resetDuration);
      }
      if (vx > 0.5) {
        this.finishPan(goBackDuration);
      }

      // next check position to determine intent
      if (dx / width < POSITION_THRESHOLD) {
        this.cancelPan(resetDuration);
      } else {
        this.finishPan(goBackDuration);
      }
    },
  });

  cancelPan = duration => {
    this.props.history.goForward();

    Animated.timing(this.animation, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start(this.afterPan);
  };

  finishPan = duration => {
    Animated.timing(this.animation, {
      toValue: width,
      duration,
      useNativeDriver: true,
    }).start(this.afterPan);
  };

  afterPan = () => {
    this.isPanning = false;
    this.setState({
      previousChildren: null,
      transition: null,
    });
    this.animation = new Animated.Value(0);
  };

  componentWillMount() {
    this.startingIndex = this.props.history.index;
  }

  componentWillReceiveProps(nextProps) {
    // New route comes in after a swipe gesture begins. Save the children so we
    // can render both routes during the transition.
    // Don't trigger the timing animation if user is swiping, let the gesture
    // control the animation.
    if (this.isPanning) {
      if (this.state.previousChildren === null) {
        this.setState({ previousChildren: this.props.children });
      }
      return;
    }
    // NOTE: We can't assume that the next location matches any routes in the switch
    // This means that users will need to wrap the stack in a route component
    // that stops matching if they need to navigate to a route not contained in
    // the stack.

    // TODO: Consider a master/detail view with a stack on the left, and a detail
    // screen on the right.  You want both the stack and the detail to match at the
    // same time, but you don't necessarily always want the stack to transition.
    // For example if you are drilling down through categories, you want the
    // stack to slide transition as you select categories, but then once you
    // select items you only want the detail to update and not for the stack
    // to slide.
    // It seems we may need some prop or url param to tell the stack to not
    // transition
    const { action } = nextProps.history;

    if (
      nextProps.location.key !== this.props.location.key &&
      (action === 'PUSH' || action === 'POP')
    ) {
      if (action === 'POP' && nextProps.history.index < this.startingIndex) {
        return;
      }

      this.setState(
        {
          previousChildren: this.props.children,
          transition: action,
        },
        () => {
          // TODO: add more animation options and make animation configurable
          // - default based on platform (slide ios, fade android)
          // - base slide direction on `I18nManager.isRTL`
          // - fade in from bottom/top
          // - fade out to bottom/top
          // - slide in from bottom/top
          // - slide out to bottom/top
          // - cube transition
          Animated.timing(this.animation, {
            duration: ANIMATION_DURATION,
            toValue: action === 'PUSH' ? -width : width,
            easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99),
            useNativeDriver: true,
          }).start(() => {
            this.setState({
              previousChildren: null,
              transition: null,
            });

            this.animation = new Animated.Value(0);
          });
        }
      );
    }
  }

  renderHeader() {
    // FIXME: the header changes immediately, even while animating/panning
    // header should animate along with the rest of the stack
    return (
      <Header
        goBack={this.props.history.goBack}
        showBack={this.props.history.index > this.startingIndex && this.props.history.canGo(-1)}
      />
    );
  }

  render() {
    const { children } = this.props;
    const { previousChildren, transition } = this.state;
    const { stackView } = styles;
    const transform = { transform: [{ translateX: this.animation }] };

    let routes = [];
    if (transition === 'PUSH') {
      routes.push(
        <Animated.View style={stackView}>
          {previousChildren}
        </Animated.View>
      );
      routes.push(
        <Animated.View style={[stackView, offscreen, transform]}>
          {children}
        </Animated.View>
      );
    } else if (transition === 'POP' || this.isPanning) {
      routes.push(
        <Animated.View style={stackView}>
          {children}
        </Animated.View>
      );
      routes.push(
        <Animated.View style={[stackView, transform]}>
          {previousChildren}
        </Animated.View>
      );
    } else {
      return (
        <View style={stackView} {...this.panResponder.panHandlers}>
          {children}
          {this.renderHeader()}
        </View>
      );
    }

    return (
      <View style={stackView} {...this.panResponder.panHandlers}>
        <View style={styles.transitionContainer}>
          {routes[0]}
          {routes[1]}
        </View>
        {this.renderHeader()}
      </View>
    );
  }
}
