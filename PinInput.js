import React, {Component} from 'react';
import {View, Animated, StyleSheet, Vibration} from 'react-native';
import PropTypes from 'prop-types';

class PinInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shake: new Animated.Value(0)
        };
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    render(){
        // Styles
        const {
            containerDefaultStyle,
            pinDefaultStyle,
        } = styles;

        // Props
        const {
            numberOfPinsActive,
            numberOfPins,

            // Style Props
            containerStyle,
            pinStyle,
            pinActiveStyle
        } = this.props;

        // State
        const {
            shake
        } = this.state;

        // Create the pins from set props

        const pins = [];

        for (let p=0; p<numberOfPins; p++){
            pins.push(
                <View key={p} style={
                    [ pinDefaultStyle, pinStyle, (p < numberOfPinsActive) ? pinActiveStyle : {} ]
                } />
            );
        }

        // Create the shake animation via interpolation
        const shakeAnimation = shake.interpolate({
            inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
            outputRange: [0, -20, 20, -20, 20, 0],
        });

        return(
            <Animated.View style={[ containerDefaultStyle, containerStyle, { left: shakeAnimation } ]}>
                { pins }
            </Animated.View>
        );
    }

    shake(){
        // If vibration is enabled then we vibrate on error
        if(this.props.vibration) {
            Vibration.vibrate(500);
        }

        // Reset animation to so we can reanimate
        this.state.shake.setValue(0);

        // Animate the pins to shake
        Animated.spring(this.state.shake, { toValue: 1, }).start(() => {
            if(this.props.animationShakeCallback) {
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
    pinActiveStyle: PropTypes.object,
};

PinInput.defaultProps = {
    // Number of pins to create
    numberOfPins: 5,

    // Active number of pins
    numberOfPinsActive: 0,

    // Is vibration enabled or disabled
    vibration: true,

    // Style for pin container. You can use the flex
    // property to expand the pins to take up more space
    // on the screen. The default is 0.8.
    containerStyle: {},

    // Style for the pin
    pinStyle: {},
    // Style applied when a pin is active
    pinActiveStyle: {
        opacity: 1.0,
    }
};

const styles = StyleSheet.create({
    containerDefaultStyle: {
        flex: 0.8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    pinDefaultStyle: {
        width: 18,
        height: 18,
        marginRight: 15,
        marginLeft: 15,
        borderRadius: 9,
        opacity: 0.45,
        backgroundColor: '#FFF',
    },

});

export default PinInput;