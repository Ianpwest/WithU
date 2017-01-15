import React, {Component, PropTypes} from 'react';
import {AsyncStorage, View, Alert, Text, TextInput, ScrollView, Button, TouchableHighlight, ActivityIndicator, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Backbar from '../views_custom_components/Backbar';

var STORAGE_USER_INFO_KEY = 'WithUUserInfo';

export default class Login extends Component {

    constructor() 
    {
      super();
      this.state = {
          animating: false,
          email: 'ian.p.weston@gmail.com',
          password: 'Password',
          errorMessage: '',
          errorMessageVisibility: false
        };

        this.LoginUser = this.LoginUser.bind(this);
        this.TransitionScreen = this.TransitionScreen.bind(this);
    }
   
    render(){
        return(
            <View style={{flex: 1, flexDirection: 'column'}}>
                <Backbar title="Log In" navigator={this.props.navigator} showBackNav={false} />
                <ScrollView keyboardShouldPersistTaps={true} style={{flexDirection: 'column'}} contentContainerStyle={{alignItems: 'center', justifyContent: 'flex-start', height:750}}>
                    <View style={{flexDirection: 'column', justifyContent: 'center', marginTop: 50}}>
                        <Text style={styles.ControlLabel}>Email</Text>
                        <TextInput style={styles.TextInput} value={this.state.email} ref={(input) => this.emailTextInput = input} onChangeText={(email) => this.setState({email})}></TextInput>
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
                </ScrollView>
            </View>
        )
    }

    LoginUser()
    {
        this.setState({animating: true, errorMessage: '', errorMessageVisibility: false});

        fetch('https://resty.azurewebsites.net/api/account/logon',{
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                method: 'post',
                body: JSON.stringify({
                    Email: this.state.email,
                    Password: this.state.password
                })
            }
        )
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.bSuccessful)
            {
                var userInfo = {
                    "Token": responseJson.Token,
                    "Email": this.state.email,
                    "LastName": responseJson.LastName,
                    "FirstName": responseJson.FirstName,
                    "ProfileURI": responseJson.ProfileURI
                }
                
                //Store the users info to the local device
                this.StoreUserInfo(userInfo);

                //Show who's logged in for the drawer
                this.props.navDrawer.setState({usersName: userInfo.FirstName, profileURI: userInfo.ProfileURI});

                //How to dismiss the keyboard programatically
                var DismissKeyboard = require('dismissKeyboard');
                DismissKeyboard();

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

    async StoreUserInfo(userInfo)
    {
        try 
        {
            await AsyncStorage.mergeItem(STORAGE_USER_INFO_KEY, JSON.stringify(userInfo));
        } 
        catch (error) {
            Alert.alert(error.message);
        }
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