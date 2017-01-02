import React, {Component, PropTypes} from 'react';
import {BackAndroid, Button, TextInput, ActivityIndicator, TouchableHighlight, 
        View, ScrollView, Text, ToastAndroid, Modal, StyleSheet} from 'react-native';
import NavigationBar from '../views_custom_components/NavigationBar';

export default class SignUp extends Component{
    constructor(){
        super();

        this.state = {
          animating: false,
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          errorMessage: '',
          errorMessageVisibility: false,
          modalVisible: false
        };

        this.SignUpUser = this.SignUpUser.bind(this);
        this.TransitionScreen = this.TransitionScreen.bind(this);
        this.ValidateState = this.ValidateState.bind(this);
        this.TransitionToLogin = this.TransitionToLogin.bind(this);
        this.ResendActivationEmail = this.ResendActivationEmail.bind(this);
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
            <View style={{flexDirection: 'column', justifyContent: 'flex-start', flex: 2}}>
               <NavigationBar title={this.props.title} showIcon={true} navigator={this.props.navigator}></NavigationBar>
               <ScrollView keyboardShouldPersistTaps={true} style={{flexDirection: 'column'}} contentContainerStyle={{alignItems: 'center', justifyContent: 'flex-start', height:750}}>
                <View style={styles.ControlContainer}>
                    <Text style={styles.ControlLabel}>Email</Text>
                    <TextInput style={styles.TextInput} placeholder="(required)" value={this.state.email} ref={(input) => this.emailTextInput = input} onChangeText={(email) => this.setState({email})}
                     keyboardType="email-address"
                     returnKeyType="next"
                     onSubmitEditing={(event) => { 
                        this.firstNameTextInput.focus(); 
                     }}>
                    </TextInput>
                </View>
                <View style={styles.ControlContainer}>
                    <Text style={styles.ControlLabel}>First Name</Text>
                    <TextInput style={styles.TextInput} placeholder="(required)" value={this.state.firstName} ref={(input) => this.firstNameTextInput = input} onChangeText={(firstName) => this.setState({firstName})}
                     returnKeyType="next"
                     onSubmitEditing={(event) => { 
                        this.lastNameTextInput.focus(); 
                     }}></TextInput>
                </View>
                <View style={styles.ControlContainer}>
                    <Text style={styles.ControlLabel}>Last Name</Text>
                    <TextInput style={styles.TextInput} placeholder="(required)" value={this.state.lastName} ref={(input) => this.lastNameTextInput = input} onChangeText={(lastName) => this.setState({lastName})}
                     returnKeyType="next"
                     onSubmitEditing={(event) => { 
                        this.passwordTextInput.focus(); 
                     }}></TextInput>
                </View>
                <View style={styles.ControlContainer}>
                    <Text style={styles.ControlLabel}>Password</Text>
                    <TextInput style={styles.TextInput} placeholder="(required)" value={this.state.password} secureTextEntry = {true} ref={(input) => this.passwordTextInput = input} onChangeText={(password) => this.setState({password})}
                     returnKeyType="next"
                     onSubmitEditing={(event) => { 
                        this.confirmPasswordTextInput.focus(); 
                     }}></TextInput>
                </View>
                <View style={styles.ControlContainer}>
                    <Text style={styles.ControlLabel}>Confirm Password</Text>
                    <TextInput style={styles.TextInput} placeholder="(required)" value={this.state.confirmPassword} secureTextEntry = {true} ref={(input) => this.confirmPasswordTextInput = input} onChangeText={(confirmPassword) => this.setState({confirmPassword})}
                     returnKeyType="done"
                     onSubmitEditing={(event) => { 
                        this.SignUpUser();
                     }}></TextInput>
                </View>

                <View style={{flexDirection: 'column', marginTop:10, width:250, height:190}}>
                    <Text style={styles.ErrorText}>{this.state.errorMessage}</Text>
                    <ActivityIndicator animating={true} style={{opacity: this.state.animating ? 1.0 : 0.0}} color="black"/>
                    <Button onPress={this.SignUpUser} title="Sign Up" color="#1de9b6" ref={(input) => this.signUpUserButton = input} />
                </View>
                </ScrollView>

               <Modal
                   animationType={"slide"}
                   transparent={false}
                   visible={this.state.modalVisible}
                   onRequestClose={() => { this.setState({modalVisible: false}) } }
                   >
                 <View style={{flexDirection: 'column', flex: 2}}>
                    <View style={styles.ControlContainer}>
                        <Text style={styles.ControlLabel}>Please check your email to validate before continuing.</Text>
                    </View>
                    <View style={styles.ControlContainer}>
                        <Button style={{marginTop:50}} onPress={this.TransitionToLogin} title="Validated! Continue..." color="#1de9b6" ref={(input) => this.validatedUserButton = input} />
                    </View> 
                    <View style={styles.ControlContainer}>
                        <ActivityIndicator animating={true} style={{opacity: this.state.animating ? 1.0 : 0.0}} color="black"/>
                        <Button style={{marginTop:50}} onPress={this.ResendActivationEmail} title="Resend validation email" color="gray" ref={(input) => this.resendValidationButton = input} />
                    </View> 
                </View>
               </Modal>
            </View>
        )
    }

    SignUpUser()
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

        //Validate email in correct format
        if (!this.ValidateEmail(this.state.email)) { 
             this.setState({animating: false, errorMessage: 'Invalid email format.', errorMessageVisibility: true});
             return;
        }

        this.setState({animating: true, errorMessage: '', errorMessageVisibility: false});

        fetch('http://resty.azurewebsites.net/api/account/RegisterAccount',{
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                method: 'post',
                body: JSON.stringify({
                    Email: this.state.email,
                    Password: this.state.password,
                    FirstName: this.state.firstName,
                    LastName: this.state.lastName
                })
            }
        )
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.bSuccessful)
            {
                this.setState({animating: false, errorMessage: '', errorMessageVisibility: false, modalVisible: true});
                //this.TransitionScreen('Login');
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

    ResendActivationEmail()
    {
        this.setState({animating: true, errorMessage: '', errorMessageVisibility: false});

        fetch('http://resty.azurewebsites.net/api/account/ResendActivationEmail',{
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
             this.setState({animating: false});
        })
        .catch((error) => {
            console.error(error);
        });
    }

    ValidateState()
    {
        if(this.state.email == ''
        || this.state.firstName == ''
        || this.state.lastName == ''
        || this.state.password == '')
        {
            return false;
        }

        return true;
    }

    ValidateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    TransitionToLogin()
    {
        this.setState({modalVisible: false});
        this.TransitionScreen('Login');
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
  },
  ErrorText: {
      color: 'red'
  }
});