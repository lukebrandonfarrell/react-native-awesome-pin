/**
 * @author Luke Brandon Farrell
 * @description Customisable full screen pin component
 */

import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Vibration,
  SafeAreaView
} from "react-native";
import PropTypes from "prop-types";

import PinInput from "./PinInput";
import PinKeyboard from "./PinKeyboard";

class PinScreen extends Component {
  /**
   * [ Built-in React method. ]
   *
   * Setup the component. Executes when the component is created
   *
   * @param {object} props
   *
   */
  constructor(props) {
    super(props);

    this.state = {
      pin: ""
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
  componentDidUpdate(prevProps) {
    const { pin } = this.props;

    if (pin !== prevProps.pin) {
      // We want to filter the pin so it always is a string
      const filteredPin = pin ? pin.toString() : "";

      this.setState({
        pin: filteredPin
      });
    }
  }

  /**
   * [ Built-in React method. ]
   *
   * Allows us to render JSX to the screen
   */
  render() {
    /** Props */
    const {
      logo,
      tagline,
      numberOfPins,
      shakeVibration,
      logoEnabled,
      headerBackgroundColor,
      footerBackgroundColor,
      // Style Props
      containerStyle,
      logoStyle,
      taglineStyle,
      // Pin style props
      pinContainerStyle,
      pinStyle,
      pinActiveStyle,
      // Keyboard style props
      keyboardStyle,
      keyboardDisabledStyle,
      keyStyle,
      keyTextStyle,
      keyImageStyle,
      errorStyle,
      errorTextStyle
    } = this.props;
    /** State */
    const { pin } = this.state;
    /** Style */
    const {
      containerDefaultStyle,
      defaultTaglineStyle,
      safeAreaViewHeaderDefaultStyle,
      safeAreaViewFooterDefaultStyle
    } = styles;

    return (
      <View style={[containerDefaultStyle, containerStyle]}>
        <SafeAreaView
          style={[
            safeAreaViewHeaderDefaultStyle,
            { backgroundColor: headerBackgroundColor }
          ]}
        >
          {logoEnabled ?
            <Image style={[{ flex: 2 }, logoStyle]} source={logo} /> : null }
          <Text style={[defaultTaglineStyle, taglineStyle]}>{tagline}</Text>
          <PinInput
            onRef={ref => (this.pins = ref)}
            numberOfPins={numberOfPins}
            numberOfPinsActive={pin.length}
            vibration={shakeVibration}
            animationShakeCallback={this.shakeAnimationComplete.bind(this)}
            containerStyle={pinContainerStyle}
            pinStyle={pinStyle}
            pinActiveStyle={pinActiveStyle}
          />
        </SafeAreaView>

        <SafeAreaView
          style={[
            safeAreaViewFooterDefaultStyle,
            { backgroundColor: footerBackgroundColor }
          ]}
        >
          <PinKeyboard
            onRef={ref => (this.keyboard = ref)}
            keyDown={this.keyDown.bind(this)}
            keyboardStyle={keyboardStyle}
            keyboardDisabledStyle={keyboardDisabledStyle}
            keyStyle={keyStyle}
            keyTextStyle={keyTextStyle}
            keyImageStyle={keyImageStyle}
            errorStyle={errorStyle}
            errorTextStyle={errorTextStyle}
          />
          {this.props.ItemFooter}
        </SafeAreaView>
      </View>
    );
  }

  /**
   * Callback triggered when a key is pressed on the keyboard
   *
   * @param key
   */
  keyDown(key) {
    /** Props */
    const { numberOfPins, keyDown } = this.props;
    /** State */
    const { pin } = this.state;

    // An instance of the pin
    let newPin = pin;

    // Check if key is the back buttons. The 'back' value is
    // defined in the array keyboardFunc passed to keyboard as
    // a parameter.
    if (key === "back") {
      newPin = pin.substring(0, pin.length - 1);
    } else {
      // Concat the letter in the string
      if (pin.length < numberOfPins) {
        newPin = pin.concat(key);
      }
    }

    // If vibration is enabled then we vibrate on each key press
    // to provide tactile feedback to the user.
    if (this.props.keyVibration) {
      Vibration.vibrate(50);
    }

    // Save the new pin into the state
    this.setState({ pin: newPin });

    // If the newPin matches the required length, perform the callback
    if (newPin.length === numberOfPins) {
      if (keyDown) keyDown(newPin);
    }
  }

  /**
   * Function used to throw an error on the pin screen.
   *
   * @param error
   */
  throwError(error) {
    // Shake the pins
    this.pins.shake();

    // throw error on the keyboard
    this.keyboard.throwError(error);

    // Disable the keyboard
    this.keyboard.disable();
  }

  /**
   * Function used to clear the error on the pin screen
   */
  clearError() {
    this.keyboard.clearError();
  }

  /**
   * Function to clear the current pin
   */
  clearPin() {
    this.setState({ pin: ""});
  }

  /**
   * Callback when shake animation has completed on the pin
   */
  shakeAnimationComplete() {
    if (this.props.onError) this.props.onError();

    this.keyboard.enable();
  }
}

PinScreen.propTypes = {
  pin: PropTypes.string,
  onRef: PropTypes.any.isRequired,
  keyDown: PropTypes.func.isRequired,
  onError: PropTypes.func,
  tagline: PropTypes.string,
  logo: PropTypes.any,
  numberOfPins: PropTypes.number,
  keyVibration: PropTypes.bool,
  shakeVibration: PropTypes.bool,
  logoEnabled: PropTypes.bool,
  headerBackgroundColor: PropTypes.string,
  footerBackgroundColor: PropTypes.string,
  ItemFooter: PropTypes.element,

  // Style props
  containerStyle: PropTypes.object,
  logoStyle: PropTypes.object,
  taglineStyle: PropTypes.object,

  // Pin style props
  pinContainerStyle: PropTypes.object,
  pinStyle: PropTypes.object,
  pinActiveStyle: PropTypes.object,

  // Keyboard style props
  keyboardStyle: PropTypes.object,
  keyboardDisabledStyle: PropTypes.object,
  keyStyle: PropTypes.object,
  keyTextStyle: PropTypes.object,
  keyImageStyle: PropTypes.object,
  errorStyle: PropTypes.object,
  errorTextStyle: PropTypes.object
};

PinScreen.defaultProps = {
  // Text above the pins acting as a indicator
  tagline: "Enter your PIN",
  // Number of pins to create
  numberOfPins: 5,
  // Is vibration enabled or disabled
  keyVibration: true,
  shakeVibration: true,
  logoEnabled: false,
  headerBackgroundColor: "#e2e2e2",
  footerBackgroundColor: "#fff"
};

export default PinScreen;

/** -------------------------------------------- */
/**             Component Styling                */
/** -------------------------------------------- */
const styles = StyleSheet.create({
  containerDefaultStyle: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e2e2e2"
  },
  safeAreaViewHeaderDefaultStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
  },
  safeAreaViewFooterDefaultStyle: {
    flex: null,
    width: "100%",
  },
  defaultTaglineStyle: {
    flex: null,
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold"
  }
});
