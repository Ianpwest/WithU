import React, {Component, PropTypes} from 'react';
import {BackAndroid, ActivityIndicator, TextInput, Button, Alert, View, Text, StyleSheet} from 'react-native';
import NavigationBar from '../views_custom_components/NavigationBar';

export default class ForgotPassword extends Component{
    constructor(){
        super();

        this.state = {
          animating: false,
          email: '',
          errorMessage: '',
          errorMessageVisibility: false
        };

        this.TransitionScreen = this.TransitionScreen.bind(this);
        this.SendResetPasswordEmail = this.SendResetPasswordEmail.bind(this);
        this.ValidateState = this.ValidateState.bind(this);
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
                    <Text style={styles.ControlLabel}>Email</Text>
                    <TextInput style={styles.TextInput} placeholder="(required)" value={this.state.email} ref={(input) => this.emailTextInput = input} onChangeText={(email) => this.setState({email})}
                     keyboardType="email-address"
                     returnKeyType="done">
                    </TextInput>
                </View>

                <View style={{flexDirection: 'column', marginTop:10, width:250, height:190}}>
                    <Text style={styles.ErrorText}>{this.state.errorMessage}</Text>
                    <ActivityIndicator animating={true} style={{opacity: this.state.animating ? 1.0 : 0.0}} color="black"/>
                    <Button onPress={this.SendResetPasswordEmail} title="Send Reset Email" color="#1de9b6" ref={(input) => this.sendResetPasswordEmailButton = input} />
                </View>
            </View>
        )
    }

    SendResetPasswordEmail()
    {
        //How to dismiss the keyboard programatically
        var DismissKeyboard = require('dismissKeyboard');
        DismissKeyboard();

        if(!this.ValidateState())
        {
            this.setState({animating: false, errorMessage: 'Fill out all required fields.', errorMessageVisibility: true});
            return;
        }

        //Validate email in correct format
        if (!this.ValidateEmail(this.state.email)) { 
             this.setState({animating: false, errorMessage: 'Invalid email format.', errorMessageVisibility: true});
             return;
        }

        this.setState({animating: true, errorMessage: '', errorMessageVisibility: false});

        fetch('https://resty.azurewebsites.net/api/account/SendPasswordResetEmail',{
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                method: 'post',
                body: JSON.stringify({
                    Email: this.state.email
                })
            }
        )
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.bSuccessful)
            {
                this.TransitionScreen('Reset Password');
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
        if(this.state.email == '')
        {
            return false;
        }

        return true;
    }

    ValidateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    TransitionScreen(strSceneName)
    {
        this.setState({animating: false});
        
        this.props.navigator.push({
                name: strSceneName,
                email: this.state.email
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