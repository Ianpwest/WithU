/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  Navigator,
  BackAndroid
} from 'react-native';
import {
  Button,
  Toolbar
} from 'react-native-material-design';

import MyScene from './views/MyScene';
import Login from './views/Login';
import Home from './views/Home';
import SignUp from './views/SignUp';
import ForgotPassword from './views/ForgotPassword';
import MyActivities from './views/MyActivities';

import SplashScreen from 'react-native-smart-splash-screen'

export default class LoginProject extends Component {
constructor(props) {
    super(props);
  }

  componentDidMount () {
     SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
  }

  render() {
    return (
      <Navigator 
        
        initialRoute={{name: 'Login', index : 0}}
        renderScene={(route, navigator) => {
          if(route.name == 'Login') 
          {
            return <Login navigator={navigator} title={route.name}/>
          }
          if(route.name == 'Home') 
          {
            return <Home navigator={navigator} title={route.name}/>
          }
          if(route.name == 'Sign Up')
          {
            return <SignUp navigator={navigator} title={route.name}/>
          }
          if(route.name == 'Forgot Password')
          {
            return <ForgotPassword navigator={navigator} title={route.name}/>
          }
          if(route.name == 'My Activities')
          {
            return <MyActivities navigator={navigator} title={route.name}/>
          }
        }}
        
        configureScene={(route) => {
        if (route.name == 'Login') 
        {
          return Navigator.SceneConfigs.FloatFromBottom;
        } 
        else if(route.name == 'Home')
        {
          return Navigator.SceneConfigs.HorizontalSwipeJump;
        }
        else if(route.name == 'Sign Up' || route.name == 'Forgot Password')
        {
          return Navigator.SceneConfigs.VerticalUpSwipeJump;
        }
        else
        {
          return Navigator.SceneConfigs.HorizontalSwipeJump;
        }
      }}

      />

      // <MyScene title="Ian"/>
      // <View style={styles.container}>
      // <Toolbar icon="star" title="StartUp"
      //  leftIconStyle={styles.toolbarLeftIcon}
      //  style={styles.toolbar}/>
      
      //  <TextInput style = {{height:40, width:200, borderColor: 'gray', borderWidth:1}}/>
      //  <Button text="Normal Flat"/>
      //  <Button text="Normal Raised" raised={true}/>

      //  <Text style={styles.welcome}>
      //   Testing Roboto
      //  </Text>
      //   <Text style={styles.instructions}>
      //     Testing out the inputs
      //   </Text>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  toolbar: {
    backgroundColor: "#009688"
  },
  toolbarLeftIcon:{
    marginRight: 70
  },
  welcome: {
    fontSize: 50,
    textAlign: 'center',
    margin: 10,
    fontFamily: 'roboto_italic'
  },
  instructions: {
    textAlign: 'center',
    fontFamily: 'roboto_light',
    fontSize: 50,
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('LoginProject', () => LoginProject);
