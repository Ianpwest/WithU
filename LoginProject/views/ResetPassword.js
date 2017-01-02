import React, {Component, PropTypes} from 'react';
import {BackAndroid, ActivityIndicator, TextInput, Button, Alert, View, Text, StyleSheet} from 'react-native';
import NavigationBar from '../views_custom_components/NavigationBar';

export default class ResetPassword extends Component{
    constructor(){
        super();

        this.state = {
            "resetCode": '',
            "password": '',
            "confirmPassword": ''
        };

        this.TransitionScreen = this.TransitionScreen.bind(this);
        this.ResetPassword = this.ResetPassword.bind(this);
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

               <View style={styles.ControlContainer}>
                    <Text style={styles.ControlLabel}>Email Reset Code</Text>
                    <TextInput style={styles.TextInput} placeholder="(required)" value={this.state.resetCode} ref={(input) => this.resetCodeTextInput = input} onChangeText={(resetCode) => this.setState({resetCode})}
                     returnKeyType="next"
                     onSubmitEditing={(event) => { 
                        this.passwordTextInput.focus(); 
                     }}></TextInput>
                </View>
                <View style={styles.ControlContainer}>
                    <Text style={styles.ControlLabel}>New Password</Text>
                    <TextInput style={styles.TextInput} placeholder="(required)" value={this.state.password} secureTextEntry = {true} ref={(input) => this.passwordTextInput = input} onChangeText={(password) => this.setState({password})}
                     returnKeyType="next"
                     onSubmitEditing={(event) => { 
                        this.confirmPasswordTextInput.focus(); 
                     }}></TextInput>
                </View>
                <View style={styles.ControlContainer}>
                    <Text style={styles.ControlLabel}>Confirm Password</Text>
                    <TextInput style={styles.TextInput} placeholder="(required)" value={this.state.confirmPassword} secureTextEntry = {true} ref={(input) => this.confirmPasswordTextInput = input} onChangeText={(confirmPassword) => this.setState({confirmPassword})}
                     returnKeyType="done"></TextInput>
                </View>

                <View style={{flexDirection: 'column', marginTop:10, width:250, height:190}}>
                    <Text style={styles.ErrorText}>{this.state.errorMessage}</Text>
                    <ActivityIndicator animating={true} style={{opacity: this.state.animating ? 1.0 : 0.0}} color="black"/>
                    <Button onPress={this.ResetPassword} title="Reset Password" color="#1de9b6" ref={(input) => this.resetPasswordButton = input} />
                </View>
            </View>
        )
    }

    ResetPassword()
    {
        //How to dismiss the keyboard programatically
        var DismissKeyboard = require('dismissKeyboard');
        DismissKeyboard();

        if(!this.ValidateState())
        {
            this.setState({animating: false, errorMessage: 'Fill out all required fields.', errorMessageVisibility: true});
            return;
        }

        //Verify passwords match
        if(this.state.password !== this.state.confirmPassword)
        {
            this.setState({animating: false, errorMessage: 'Passwords must match.', errorMessageVisibility: true});
            return;
        }

        this.setState({animating: true, errorMessage: '', errorMessageVisibility: false});

        fetch('http://resty.azurewebsites.net/api/account/ResetPassword',{
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                method: 'post',
                body: JSON.stringify({
                    Email: this.props.email,
                    ResetToken: this.state.resetCode,
                    Password: this.state.password
                })
            }
        )
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.bSuccessful)
            {
                this.TransitionScreen('Login');
            }
            else
            {
                this.setState({animating: false, errorMessage: responseJson.FailureReason, errorMessageVisibility: true});
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    ValidateState()
    {
        if(this.state.resetCode == ''
        || this.state.password == '')
        {
            return false;
        }

        return true;
    }
   
    TransitionScreen(strSceneName)
    {
        this.setState({animating: false});
        
        this.props.navigator.push({
                name: strSceneName
                });
    }
}

const styles = StyleSheet.create({
 ControlContainer: {
    flexDirection: 'column', 
    justifyContent: 'center', 
    marginTop: 10
 },
  TextInput: {
      height: 40,
      width: 250
  },
  ControlLabel: {
      fontSize:16,
      marginBottom: -8
  }
});