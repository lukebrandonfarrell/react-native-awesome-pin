import React, {Component} from 'react';
import { View, Image, Text, StyleSheet, Vibration } from 'react-native';
import PropTypes from 'prop-types';

import PinInput from './PinInput';
import PinKeyboard from './PinKeyboard';

class PinScreen extends Component {
    constructor(props){
        super(props)

        this.state = {
            pin: '',
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    render(){
        // Props
        const {
            logo,
            tagline,
            numberOfPins,
            vibration,

            // Style Props
            containerStyle,
            taglineStyle
        } = this.props;

        // State
        const {
            pin,
        } = this.state;

        // Style
        const {
            containerDefaultStyle,
            headerContainerStyle,
        } = styles;

        return(
            <View style={[ containerDefaultStyle, containerStyle ]}>
                <View
                    style={headerContainerStyle}>
                    <Image
                        source={logo}  />
                    <Text style={ taglineStyle }>{ tagline }</Text>
                </View>

                <PinInput
                    onRef={ref => (this.pins = ref)}
                    numberOfPins={numberOfPins}
                    numberOfPinsActive={pin.length}
                    vibration={vibration}
                    shakeCallback={this.shakeComplete.bind(this)}
                />

                <PinKeyboard
                    onRef={ref => (this.keyboard = ref)}
                    keyDown={this.keyDown.bind(this)}
                />
            </View>
        );
    }

    /*
    * Callback triggered when a key is pressed on the keyboard
    */
    keyDown(key){
        // Props
        const {
            numberOfPins,
        } = this.props;

        // State
        const {
            pin
        } = this.state;

        let newPin = pin;

        // Check if key is the back buttons. The 'back' value is
        // defined in the array keyboardFunc passed to keyboard as
        // a parameter.
        if(key == 'back'){
            newPin = pin.substring(0, pin.length - 1);
        } else {
            // Concat the letter in the string
            if(pin.length < numberOfPins) {
                newPin = pin.concat(key);
            }
        }

        // If vibration is enabled then we vibrate on each key press
        // to provide tactile feedback to the user.
        if(this.props.vibration){
            Vibration.vibrate(50);
        }

        // Use the keyDown callback to pass the pin up to the
        // parent component.
        this.props.keyDown(newPin);

        // Set the state as the new pin
        this.setState({
            pin: newPin,
        });
    }

    /*
    * Function used to throw an error on the pin screen.
    */
    throwError(error){
        // Shake the pins
        this.pins.shake();

        // throw error on the keyboard
        this.keyboard.throwError(error);

        // Disable the keyboard
        this.keyboard.disable();
    }

    /*
     * Function used to throw an error on the pin screen.
    */
    shakeComplete(){
        this.setState({
            pin: '',
            shaking: false,
        });

        this.keyboard.enable();
    }
}

PinScreen.propTypes = {
    tagline: PropTypes.string,
    logo: PropTypes.any,
    numberOfPins: PropTypes.number,
    vibration: PropTypes.bool,

    // Style props
    containerStyle: PropTypes.object,
    taglineStyle: PropTypes.object,
};

PinScreen.defaultProps = {
    // Text above the pins acting as a indicator
    tagline: 'Enter your PIN',

    // Number of pins to create
    numberOfPins: 5,

    // Is vibration enabled or disabled
    vibration: true,

    // Style of the full screen container. Background can
    // be set in this style.
    containerStyle: {
        backgroundColor: '#e2e2e2',
    },

    // Style for the tagline which sits above the pins
    taglineStyle: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: 'bold',
    }
};

const styles = StyleSheet.create({
    containerDefaultStyle: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    headerContainerStyle: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
});

export default PinScreen;