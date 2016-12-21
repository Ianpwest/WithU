import React, {Component, PropTypes} from 'react';
import {BackAndroid, Button, TextInput, ActivityIndicator, TouchableHighlight, View, Text, StyleSheet} from 'react-native';
import NavigationBar from '../views_custom_components/NavigationBar';

export default class SignUp extends Component{
    constructor(){
        super();

        this.state = {
          animating: false,
          userId: '',
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          errorMessage: '',
          errorMessageVisibility: false
        };

        this.SignUpUser = this.SignUpUser.bind(this);
        this.TransitionScreen = this.TransitionScreen.bind(this);
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
                    <Text style={styles.ControlLabel}>Username</Text>
                    <TextInput style={styles.TextInput} placeholder="(required)" value={this.state.username} ref={(input) => this.usernameTextInput = input} onChangeText={(userId) => this.setState({userId})}></TextInput>
                </View>
                <View style={styles.ControlContainer}>
                    <Text style={styles.ControlLabel}>Email</Text>
                    <TextInput style={styles.TextInput} placeholder="(required)" value={this.state.email} ref={(input) => this.emailTextInput = input} onChangeText={(email) => this.setState({email})} keyboardType="email-address"></TextInput>
                </View>
                <View style={styles.ControlContainer}>
                    <Text style={styles.ControlLabel}>First Name</Text>
                    <TextInput style={styles.TextInput} placeholder="(required)" value={this.state.firstName} ref={(input) => this.firstNameTextInput = input} onChangeText={(firstName) => this.setState({firstName})}></TextInput>
                </View>
                <View style={styles.ControlContainer}>
                    <Text style={styles.ControlLabel}>Last Name</Text>
                    <TextInput style={styles.TextInput} placeholder="(required)" value={this.state.lastName} ref={(input) => this.lastNameTextInput = input} onChangeText={(lastName) => this.setState({lastName})}></TextInput>
                </View>
                <View style={styles.ControlContainer}>
                    <Text style={styles.ControlLabel}>Password</Text>
                    <TextInput style={styles.TextInput} placeholder="(required)" value={this.state.password} secureTextEntry = {true} ref={(input) => this.passwordTextInput = input} onChangeText={(password) => this.setState({password})}></TextInput>
                </View>
                <View style={styles.ControlContainer}>
                    <Text style={styles.ControlLabel}>Confirm Password</Text>
                    <TextInput style={styles.TextInput} placeholder="(required)" value={this.state.confirmPassword} secureTextEntry = {true} ref={(input) => this.confirmPasswordTextInput = input} onChangeText={(confirmPassword) => this.setState({confirmPassword})}></TextInput>
                </View>

                <View style={{flexDirection: 'column', marginTop:10, width:250, height:190}}>
                    <Text style={styles.ErrorText}>{this.state.errorMessage}</Text>
                    <ActivityIndicator animating={true} style={{opacity: this.state.animating ? 1.0 : 0.0}} color="black"/>
                    <Button onPress={this.SignUpUser} title="Sign Up" color="#1de9b6" />
                </View>
            </View>
        )
    }

    SignUpUser()
    {
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

        fetch('http://resty.azurewebsites.net/api/account/RegisterAccount',{
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                method: 'post',
                body: JSON.stringify({
                    Username: this.state.userId,
                    Password: this.state.password,
                    Email: this.state.email,
                    FirstName: this.state.firstName,
                    LastName: this.state.lastName
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
        if(this.state.userId == ''
        || this.state.email == ''
        || this.state.firstName == ''
        || this.state.lastName == ''
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
  },
  ErrorText: {
      color: 'red'
  }
});