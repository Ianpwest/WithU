import React, {Component, PropTypes} from 'react';
import {BackAndroid, Button, Alert, View, Text, StyleSheet} from 'react-native';
import NavigationBar from '../views_custom_components/NavigationBar';

export default class MyActivities extends Component {
    
    componentDidMount() {
        //the '.bind(this)' makes sure 'this' refers to 'ViewComponent'
        BackAndroid.addEventListener('hardwareBackPress', function() {
            // this.props.navigator.pop();
             this.props.drawer.close();
            return true;
        }.bind(this));
    }

   constructor() {
      super();
   }

    render()
    {
        return(
           <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
               <NavigationBar navStyle={true} highlightIndex={2} navigator={this.props.navigator} drawer={this.props.drawer}></NavigationBar>
               <Text>You made it to your activities!</Text>
            </View>
        )
    }
}