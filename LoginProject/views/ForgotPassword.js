import React, {Component, PropTypes} from 'react';
import {BackAndroid, Button, Alert, View, Text, StyleSheet} from 'react-native';
import NavigationBar from '../views_custom_components/NavigationBar';

export default class ForgotPassword extends Component{
    constructor(){
        super();
    }
    
    componentDidMount() {
        //the '.bind(this)' makes sure 'this' refers to 'ViewComponent'
        BackAndroid.addEventListener('hardwareBackPress', function() {
            this.props.navigator.pop();
            return true;
        }.bind(this));
    }
    
    render(){
        return(
            <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
               <NavigationBar title={this.props.title} showIcon={true} navigator={this.props.navigator}></NavigationBar>
            </View>
        )
    }
}