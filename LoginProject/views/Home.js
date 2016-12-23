import React, {Component, PropTypes} from 'react';
import {AsyncStorage, BackAndroid, Button, Alert, View, Text, StyleSheet} from 'react-native';
import NavigationBar from '../views_custom_components/NavigationBar';

var STORAGE_TOKEN_KEY = 'WithUToken';

export default class Home extends Component {
    
   constructor() {
      super();

      this.state = {
          serviceResponseText: ''
      };

      this.CallSecureService = this.CallSecureService.bind(this);
   }

   componentDidMount() {
        //the '.bind(this)' makes sure 'this' refers to 'ViewComponent'
        BackAndroid.addEventListener('hardwareBackPress', function() {
            this.props.navigator.pop();
            return true;
        }.bind(this));
    }

    render()
    {
        return(
           <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
               <NavigationBar navStyle={true} highlightIndex={1} navigator={this.props.navigator}></NavigationBar>
               <Text>You made it home!</Text>

               <Button onPress={this.CallSecureService} title="Call secure service"></Button>

               <Text>{this.state.serviceResponseText}</Text>
            </View>
        )
    }

    async CallSecureService()
    {
        try 
        {
            const userToken = await AsyncStorage.getItem(STORAGE_TOKEN_KEY);
            
            if (userToken !== null)
            {
                fetch('http://resty.azurewebsites.net/api/account/GetYourName', {
                    method: 'get',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + userToken
                    })
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    Alert.alert(responseJson.FailureReason);
                    // this.setState({ serviceResponseText: responseJson.FailureReason });
                })
                .catch((error) => {
                    console.error(error);
                });
            }
            else
            {
                this.TransitionScreen('Login');
            }
        } 
        catch (error) {
            Alert.alert(error.message);
        }
    }

    TransitionScreen(strSceneName)
    {
        this.props.navigator.push({
                name: strSceneName
                });
    }

    
}