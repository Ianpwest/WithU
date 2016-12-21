import React, {Component, PropTypes} from 'react';
import {View, Alert, Text, TextInput, Button, TouchableHighlight, ActivityIndicator, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from '../views_custom_components/NavigationBar';


export default class Login extends Component {

    constructor() 
    {
      super();
      this.state = {
          animating: false,
          userId: '',
          password: '',
          errorMessage: '',
          errorMessageVisibility: false
        };

        this.LoginUser = this.LoginUser.bind(this);
        this.TransitionScreen = this.TransitionScreen.bind(this);
    }
   
    render(){
        return(
            <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
              
                <NavigationBar title={this.props.title} showIcon={true} navigator={this.props.navigator}></NavigationBar>

                <View style={{flexDirection: 'column', justifyContent: 'center', marginTop: 50}}>
                    <Text style={styles.ControlLabel}>Username</Text>
                    <TextInput style={styles.TextInput} value={this.state.userId} ref={(input) => this.usernameTextInput = input} onChangeText={(userId) => this.setState({userId})}></TextInput>
                </View>

                <View style={{flexDirection: 'column', justifyContent: 'center', marginTop:15}}>
                    <Text style={styles.ControlLabel}>Password</Text>
                    <TextInput style={styles.TextInput} secureTextEntry = {true} value={this.state.password} ref={(input) => this.passwordTextInput = input} onChangeText={(password) => this.setState({password})}></TextInput>
                    <TouchableHighlight onPress={this.TransitionScreen.bind(this, 'Forgot Password')} style={{alignSelf: 'flex-end'}}><Text style={styles.ForgotPassword}>Forgot Password?</Text></TouchableHighlight>
                </View>

                <View style={{flexDirection: 'column', marginTop:80, width:250, height:190}}>
                    <Text style={styles.ErrorText}>{this.state.errorMessage}</Text>
                    <ActivityIndicator animating={true} style={{opacity: this.state.animating ? 1.0 : 0.0}} color="black"/>
                    <Button onPress={this.LoginUser} title="Log In" color="#1de9b6" />
                    <TouchableHighlight onPress={this.TransitionScreen.bind(this, 'Sign Up')} style={{alignSelf: 'flex-start'}}><Text style={styles.SignUp}>SIGN UP</Text></TouchableHighlight>
                </View>

            </View>
        )
    }

    LoginUser()
    {
        this.setState({animating: true, errorMessage: '', errorMessageVisibility: false});

        fetch('http://resty.azurewebsites.net/api/account/logon',{
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                method: 'post',
                body: JSON.stringify({
                    Username: this.state.userId,
                    Password: this.state.password
                })
            }
        )
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.bSuccessful)
            {
                //Do something with token here.LEFT OFF HERE!!
                //responseJson.Token
                this.TransitionScreen('Home');
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

    TransitionScreen(strSceneName)
    {
        this.setState({animating: false});
        
        this.props.navigator.push({
                name: strSceneName
                });
    }
}

const styles = StyleSheet.create({

  TextInput: {
      height: 40,
      width: 250
  },
  ControlLabel: {
      fontSize:16,
      marginBottom: -8
  },
  ForgotPassword: {
      fontSize:12
  },
  SignUp: {
      marginTop:10,
      fontFamily: 'roboto_light',
      fontSize: 16
  },
  ErrorText: {
      color: 'red'
  }
});