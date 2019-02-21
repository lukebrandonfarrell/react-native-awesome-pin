/**
 * @author Luke Brandon Farrell
 * @description Pin Input component with shake animation
 */

import React, { Component } from "react";
import { View, Animated, StyleSheet, Vibration } from "react-native";
import PropTypes from "prop-types";

class PinInput extends Component {
  /**
   * [ Built-in React method. ]
   *
   * Allows us to render JSX to the screen
   */
  constructor(props) {
    super(props);

    this.state = {
      shake: new Animated.Value(0)
    };
  }

  /**
   * [ Built-in React method. ]
   *
   * Executed when the component is mounted to the screen.
   */
  componentDidMount() {
    this.props.onRef(this);
  }

  /**
   * [ Built-in React method. ]
   *
   * Executed when the component is unmounted from the screen
   */
  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  /**
   * [ Built-in React method. ]
   *
   * Allows us to render JSX to the screen
   */
  render() {
    /** Styles */
    const {
      containerDefaultStyle,
      pinDefaultStyle,
      pinActiveDefaultStyle
    } = styles;
    /** Props */
    const {
      numberOfPinsActive,
      numberOfPins,
      // Style Props
      containerStyle,
      pinStyle,
      pinActiveStyle
    } = this.props;
    /** State */
    const { shake } = this.state;

    // Create the pins from set props
    const pins = [];

    for (let p = 0; p < numberOfPins; p++) {
      pins.push(
        <View
          key={p}
          style={[
            pinDefaultStyle,
            pinStyle,
            p < numberOfPinsActive
              ? { ...pinActiveDefaultStyle, ...pinActiveStyle }
              : {}
          ]}
        />
      );
    }

    // Create the shake animation via interpolation
    const shakeAnimation = shake.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
      outputRange: [0, -20, 20, -20, 20, 0]
    });

    return (
      <Animated.View
        style={[
          containerDefaultStyle,
          containerStyle,
          { left: shakeAnimation }
        ]}
      >
        {pins}
      </Animated.View>
    );
  }

  /**
   * Shakes the pins
   */
  shake() {
    // If vibration is enabled then we vibrate on error
    if (this.props.vibration) {
      Vibration.vibrate(500);
    }

    // Reset animation to so we can reanimate
    this.state.shake.setValue(0);

    // Animate the pins to shake
    Animated.spring(this.state.shake, { toValue: 1 }).start(() => {
      if (this.props.animationShakeCallback) {
        this.props.animationShakeCallback();
      }
    });
  }
}

PinInput.propTypes = {
  onRef: PropTypes.any.isRequired,
  numberOfPins: PropTypes.number,
  numberOfPinsActive: PropTypes.number,
  vibration: PropTypes.bool,
  animationShakeCallback: PropTypes.func,
  // Style props
  containerStyle: PropTypes.object,
  pinStyle: PropTypes.object,
  pinActiveStyle: PropTypes.object
};

PinInput.defaultProps = {
  // Number of pins to create
  numberOfPins: 5,
  // Active number of pins
  numberOfPinsActive: 0,
  // Is vibration enabled or disabled
  vibration: true
};

export default PinInput;

/** -------------------------------------------- */
/**             Component Styling                */
/** -------------------------------------------- */
const styles = StyleSheet.create({
  // Style for pin container. You can use the flex
  // property to expand the pins to take up more space
  // on the screen. The default is 0.8.
  containerDefaultStyle: {
    flex: null,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 25,
    paddingBottom: 25
  },
  pinDefaultStyle: {
    width: 18,
    height: 18,
    marginRight: 15,
    marginLeft: 15,
    borderRadius: 9,
    opacity: 0.45,
    backgroundColor: "#FFF"
  },
  pinActiveDefaultStyle: {
    opacity: 1.0
  }
});
