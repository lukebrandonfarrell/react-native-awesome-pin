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
            containerStyle,
            pinCircleStyle,
            pinCircleActiveStyle
        } = styles;

        // Props
        const {
            numberOfPinsActive,
            numberOfPins
        } = this.props;

        // State
        const {
            shake
        } = this.state;

        // Create the pins from set props

        const pins = [];

        for (let p=0; p<numberOfPins; p++){
            pins.push(
                <View key={p} style={[pinCircleStyle, (p < numberOfPinsActive) ? pinCircleActiveStyle : {}]} />
            );
        }

        // Create the shake animation via interpolation
        const shakeAnimation = shake.interpolate({
            inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
            outputRange: [0, -20, 20, -20, 20, 0],
        });

        return(
            <Animated.View style={[ containerStyle, { left: shakeAnimation } ]}>
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
            this.props.shakeCallback();
        });
    }
}

PinInput.propTypes = {
    vibration: PropTypes.bool,
    numberOfPins: PropTypes.number,
    numberOfPinsActive: PropTypes.number,
};

PinInput.defaultProps = {
    // Number of pins to create
    numberOfPins: 5,

    // Active number of pins
    numberOfPinsActive: 0,

    // Is vibration enabled or disabled
    vibration: true,
};

const styles = StyleSheet.create({
    containerStyle: {
        flex: 0.6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    pinCircleStyle: {
        width: 18,
        height: 18,
        marginRight: 15,
        marginLeft: 15,
        borderRadius: 9,
        opacity: 0.45,
        backgroundColor: '#FFF',
    },
    pinCircleActiveStyle: {
        opacity: 1.0,
    }
});

export default PinInput;