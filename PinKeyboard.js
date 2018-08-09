import React, {Component} from 'react';
import { View, Image, Text, StyleSheet, Platform } from 'react-native';
import Ripple from 'react-native-material-ripple';
import PropTypes from 'prop-types';

const backAsset = require('./back.png');

class PinKeyboard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            disabled: false,
            error: null,
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    render() {
        // Styles
        const {
            containerStyle,
            keyboardDefaultStyle,
            keyboardRowStyle,
        } = styles;

        // Props
        const {
            keyboard,

            // Style Props
            keyboardStyle
        } = this.props;

        return (
            <View style={containerStyle}>
                { this.renderError() }
                <View style={[keyboardDefaultStyle, keyboardStyle]}>
                    {
                        // Maps each array of numbers in the keyboardValues array
                        keyboard.map((row, r) => {
                            return (
                                <View key={r} style={keyboardRowStyle}>
                                    {
                                        // Maps each number in row and creates key for that number
                                        row.map((element, k) => {
                                            return this.renderKey(element, r, k);
                                        })
                                    }
                                </View>
                            );
                        })
                    }
                </View>
            </View>
        );
    }

    renderError(){
        // Styles
        const {
            errorDefaultStyle,
        } = styles;

        // Props
        const {
            // Style Props
            errorStyle,
            errorTextStyle,
        } = this.props;

        // State
        const {
            error
        } = this.state;

        if(error){
            return (
                <View style={[ errorDefaultStyle, errorStyle ]}>
                    <Text style={[ errorTextStyle ]}>{error}</Text>
                </View>
            );
        }

        return null;
    }

    renderKey(entity, row, column) {
        // Styles
        const {
            keyContainerStyle,
        } = styles;

        // Props
        const {
            keyDown,
            keyboardFunc,
            keyboardDisabledStyle,

            // Style Props
            keyStyle,
            keyTextStyle,
            keyImageStyle,
        } = this.props;

        // State
        const {
            disabled
        } = this.state;

        // Custom functions for the keyboard key
        const keyboardFuncSet = keyboardFunc ? keyboardFunc : [
            [null, null, null],
            [null, null, null],
            [null, null, null],
            [null, 0, () => this.props.keyDown('back')],
        ];

        // Decide if the element passed as the key is text
        const keyJsx = Boolean(keyboardFuncSet[row][column]) ?
            <Image style={keyImageStyle} source={entity}/> :
            <Text style={keyTextStyle}>{entity}</Text>;

        // We want to block keyboard interactions if it has been disabled.
        if (!disabled) {
            return (
                <Ripple
                    rippleColor={'#000'}
                    key={column}
                    onPressIn={
                        () => Boolean(keyboardFuncSet[row][column]) ?
                            keyboardFuncSet[row][column]() :
                            keyDown(entity)
                    }
                    style={[ keyContainerStyle, keyStyle ]}>
                    {keyJsx}
                </Ripple>
            );
        } else {
            return (
                <View key={column} style={[keyContainerStyle, keyStyle, keyboardDisabledStyle]}>
                    {keyJsx}
                </View>
            );
        }
    }

    /*
    * Function used to display an error above the keyboard
    */
    throwError(error) {
        this.setState({
            error
        });
    }

    /*
    * Function used to disable the keyboard
    */
    disable() {
        this.setState({
            disabled: true,
        });
    }

    /*
    * Function used to enable the keyboard
    */
    enable() {
        this.setState({
            disabled: false,
        });
    }
}

PinKeyboard.propTypes = {
    onRef: PropTypes.any.isRequired,
    keyDown: PropTypes.func.isRequired,
    keyboard: PropTypes.array,
    keyboardFunc: PropTypes.array,

    // Style props
    keyboardStyle: PropTypes.object,
    keyboardDisabledStyle: PropTypes.object,
    keyStyle: PropTypes.object,
    keyTextStyle: PropTypes.object,
    keyImageStyle: PropTypes.object,
    errorStyle: PropTypes.object,
    errorTextStyle: PropTypes.object,
};

PinKeyboard.defaultProps = {
    // Keyboard configuration. The default contains a key
    // for each number 0 - 9 and a back button.
    keyboard: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [null, 0, backAsset]
    ],

    // Keyboard functions. By default the text (number) in the
    // keyboard array will be passed via the keyDown callback.
    // Use this array to set custom functions for certain keys.
    keyboardFunc: null,

    // Style applied to the keyboard. Must contain a height or
    // the keyboard will not be displayed.
    keyboardStyle: {
        backgroundColor: '#FFF'
    },

    // Style applied to keyboard when it is disabled.
    keyboardDisabledStyle: {
        backgroundColor: '#FFF',
    },

    // Style the individual keys
    keyStyle: {
        backgroundColor: '#FFF',
        borderRightColor: '#e8e8e8',
        borderRightWidth: 1,
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 1,
    },

    // Style for the text inside a key
    keyTextStyle: {
        ...Platform.select({
            ios: {
                fontFamily: 'HelveticaNeue',
            },
            android: {
                fontFamily: 'Roboto',
            },
        }),
        fontWeight: '400',
        fontSize: 25,
        textAlign: 'center',
        color: '#222222',
    },

    // Style for an image inside a key
    keyImageStyle: {
        width: 28,
        height: 28,
    },

    // Style for errors thrown on the keyboard
    errorStyle: {
        backgroundColor: '#DA0F72',
    },
    errorTextStyle: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 'bold',
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    keyboardDefaultStyle: {
        height: 250,
    },
    keyboardRowStyle: {
        flex: 1,
        flexDirection: 'row',
    },
    keyContainerStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorDefaultStyle: {
        height: 30,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PinKeyboard;
