import React, {Component, PropTypes} from 'react';
import {AsyncStorage, BackAndroid, Button, Alert, View, Text, StyleSheet} from 'react-native';
import NavigationBar from '../views_custom_components/NavigationBar';
import SwipeCards from 'react-native-swipe-cards';

var STORAGE_USER_INFO_KEY = 'WithUUserInfo';


let Card = React.createClass({
  render() {
    return (
      <View style={[styles.card, {backgroundColor: this.props.backgroundColor}]}>
        <Text>{this.props.text}</Text>
      </View>
    )
  }
})

let NoMoreCards = React.createClass({
  render() {
    return (
      <View style={styles.noMoreCards}>
        <Text>No more cards</Text>
      </View>
    )
  }
})

const Cards = [
  {text: 'Tomato', backgroundColor: 'red'},
  {text: 'Aubergine', backgroundColor: 'purple'},
  {text: 'Courgette', backgroundColor: 'green'},
  {text: 'Blueberry', backgroundColor: 'blue'},
  {text: 'Umm...', backgroundColor: 'cyan'},
  {text: 'orange', backgroundColor: 'orange'},
]

export default class Home extends Component {
    
   constructor() {
      super();

      this.state = {
          serviceResponseText: '',
          initialPosition: '',
          lastPosition: '',
          cards: Cards
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
                
                <Text>You made it home!</Text>

                <SwipeCards
                    cards={this.state.cards}
                    
                    renderCard={(cardData) => <Card {...cardData} />}
                    renderNoMoreCards={() => <NoMoreCards />}

                    handleYup={this.handleYup}
                    handleNope={this.handleNope}
                    />

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

    handleYup (card) {
        console.log(`Yup for ${card.text}`)
    }

    handleNope (card) {
        console.log(`Nope for ${card.text}`)
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
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    height: 250,
  }
});