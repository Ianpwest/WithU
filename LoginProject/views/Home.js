import React, {Component, PropTypes} from 'react';
import {AsyncStorage, BackAndroid, Button, Alert, View, Text, StyleSheet} from 'react-native';
import NavigationBar from '../views_custom_components/NavigationBar';

var STORAGE_USER_INFO_KEY = 'WithUUserInfo';

export default class Home extends Component {
    
   constructor() {
      super();

      this.state = {
          serviceResponseText: '',
          initialPosition: '',
          lastPosition: ''
      };

      this.CallSecureService = this.CallSecureService.bind(this);
   }

   watchID = null;

   componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', function() {
            this.props.drawer.close();
            return true;
        }.bind(this));


         navigator.geolocation.getCurrentPosition(
            (position) => {
                var positionJson = position;
                var initialPosition = "Latitude: " + positionJson.coords.latitude + " --- Longitude: " + positionJson.coords.longitude;
                this.setState({initialPosition});
            },
            (error) => alert(JSON.stringify(error)),
                {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
            );

            this.watchID = navigator.geolocation.watchPosition((position) => {
                var positionJson = position;
                var lastPosition = "Latitude: " + positionJson.coords.latitude + " --- Longitude: " + positionJson.coords.longitude;
                this.setState({lastPosition});
            });
    }

     componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
     }

    

    render()
    {
        return(
            <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                <NavigationBar navStyle={true} highlightIndex={1} navigator={this.props.navigator} drawer={this.props.drawer}></NavigationBar>
                <Text>You made it home!</Text>

                <Button onPress={this.CallSecureService} title="Call secure service"></Button>

                <View>
                <Text>
                <Text style={styles.title}>Initial position: </Text>
                    {this.state.initialPosition}
                </Text>
                <Text>
                <Text style={styles.title}>Current position: </Text>
                    {this.state.lastPosition}
                </Text>
            </View>
            </View>
        )
    }

    async CallSecureService()
    {
        try 
        {
            var userInfo = await AsyncStorage.getItem(STORAGE_USER_INFO_KEY);

            userInfo = JSON.parse(userInfo);
            
            if (userInfo.Token !== null)
            {
                fetch('https://resty.azurewebsites.net/api/account/GetYourName', {
                    method: 'get',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + userInfo.Token
                    })
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    Alert.alert(responseJson.FailureReason);
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

const styles = StyleSheet.create({
  DrawerStyle: {
    shadowColor: '#000000', 
    shadowOpacity: 0.8, 
    shadowRadius: 3
  },
  ServiceButton:{
      height:150
  }
});