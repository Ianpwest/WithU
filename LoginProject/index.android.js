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
  Alert,
  Navigator,
  BackAndroid,
  AsyncStorage,
  Icon,
  TouchableHighlight
} from 'react-native';

import {
  Button,
  Toolbar
} from 'react-native-material-design';

import Login from './views/Login';
import Profile from './views/Profile';
import Home from './views/Home';
import SignUp from './views/SignUp';
import ForgotPassword from './views/ForgotPassword';
import ResetPassword from './views/ResetPassword';
import MyActivities from './views/MyActivities';
import Drawer from 'react-native-drawer';
import NavDrawer from './views_custom_components/NavDrawer';
import NavigationBar from './views_custom_components/NavigationBar';
import SplashScreen from 'react-native-smart-splash-screen'
import ScrollableTabView from 'react-native-scrollable-tab-view';

var STORAGE_USER_INFO_KEY = 'WithUUserInfo'; 

export default class LoginProject extends Component {

constructor(props) {
    super(props);

    this.state = {
      closeSplash : false
    };

    this.CheckUsersLoggedInStatus = this.CheckUsersLoggedInStatus.bind(this);
    this.onLogoutClicked = this.onLogoutClicked.bind(this);
    this.onProfileClicked = this.onProfileClicked.bind(this);
  }

  componentDidMount () {
    this.CheckUsersLoggedInStatus();
  }

  render() {

    if(this.state.closeSplash)
    {
      SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
    }

    return (
      
      <Drawer ref={(ref) => this.drawer = ref}  content={<NavDrawer ref={(ref) => this.navDrawer = ref} onProfileClicked={this.onProfileClicked} onLogoutClicked={this.onLogoutClicked}/>} 
        style={styles.DrawerStyle} 
        type="overlay" side="right"
        panOpenMask={0} openDrawerOffset={100}
        panCloseMask={0.9}
        panThreshold={0.25}
        acceptPan={true} 
        captureGestures={false}
        elevation={6}
        closedDrawerOffset={0} >

        <Navigator  ref={(nav) => { this.navigator = nav; }} 
          initialRoute={{name: 'Login', index : 0}}
          renderScene={(route, navigator) => {
            if(route.name == 'Login') 
            { 
              return <Login navigator={navigator} title={route.name} navDrawer={this.navDrawer}/>
            }
            if(route.name == 'Sign Up')
            {
              return <SignUp navigator={navigator} title={route.name}/>
            }
            if(route.name == 'Forgot Password')
            {
              return <ForgotPassword navigator={navigator} title={route.name}/>
            }
            if(route.name == 'Reset Password')
            {
              return <ResetPassword navigator={navigator} title={route.name} email={route.email}/>
            }
            if(route.name == 'Home' || route.name == 'HomeLoggedIn') 
            {
              return <ScrollableTabView
                        ref={(ref) => this.scrollableTabView = ref}
                        renderTabBar={() => <NavigationBar drawer={this.drawer}/>}
                        locked = {false}
                      >
                        <Home tabLabel="ios-git-network-outline" navigator={navigator} title={route.name} drawer={this.drawer} />
                        <MyActivities tabLabel="ios-albums-outline" navigator={navigator} title={route.name} drawer={this.drawer}/>
                        <View tabLabel="ios-add-circle-outline"></View>
                        <View tabLabel="ios-chatbubbles-outline"></View>

                        <View tabLabel="ios-menu-outline" style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <TouchableHighlight underlayColor="transparent" onPress={this.OpenControlPanel}></TouchableHighlight>
                        </View>
                    </ScrollableTabView>
            }
            if(route.name == 'My Activities')
            {
              return <MyActivities navigator={navigator} title={route.name} drawer={this.drawer}/>
            }
            if(route.name == "Profile")
            {
              return <Profile navigator={navigator} title={route.name} drawer={this.drawer} navDrawer={this.navDrawer}/>
            }
          }}
          
          configureScene={(route) => {
          if (route.name == 'Login') 
          {
            return Navigator.SceneConfigs.FloatFromBottom;
          } 
          else if(route.name == 'Home')
          {
            return Object.assign({}, Navigator.SceneConfigs.HorizontalSwipeJump, {gestures: {}});
          }
          else if(route.name == 'HomeLoggedIn')
          {
            return Object.assign({}, Navigator.SceneConfigs.FadeAndroid, {gestures: {}});
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
       </Drawer>

    );
  }

  async CheckUsersLoggedInStatus()
  {
    try 
        {
            var userInfo = await AsyncStorage.getItem(STORAGE_USER_INFO_KEY);

            var userInfoJson = JSON.parse(userInfo);

            if(userInfoJson == null)
            {
                this.setState({closeSplash: true});
                return;
            }

            if (userInfoJson.Token !== null)
            {
              this.navigator.push({
                name: 'HomeLoggedIn'
              });
            }

            this.setState({closeSplash: true});
            
        } 
        catch (error) {
             Alert.alert(error.message);
        }
  }

  onLogoutClicked()
  {
    this.drawer.close();
    this.navigator.resetTo({
      name: 'Login'
    })
  }

  onProfileClicked()
  {
    this.drawer.close();
    this.navigator.push({
      name: "Profile"
    })
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
