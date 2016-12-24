import React, {Component, PropTypes} from 'react';
import {AsyncStorage,BackAndroid, Button, TouchableHighlight, View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

var STORAGE_TOKEN_KEY = 'WithUToken';

export default class NavDrawer extends Component {
    
   

    componentDidMount() {
        //the '.bind(this)' makes sure 'this' refers to 'ViewComponent'
        BackAndroid.addEventListener('hardwareBackPress', function() {
            
        }.bind(this));
    }

   constructor() {
      super();

      this.TransitionScreen = this.TransitionScreen.bind(this);
      this.LogOut = this.LogOut.bind(this);
   }

    render()
    {
        return(
           <View style={styles.NavDrawerContainer}>
               <View style={styles.Header}></View>
               <View style={styles.MenuOption}>
                    <Icon style={styles.Icon} name="ios-person-outline" size={40}  />
                    <Text style={styles.MenuOptionText}>Profile</Text>
               </View>


               <View style={styles.BottomContent}>
                    <TouchableHighlight style={styles.TouchableHighlight} onPress={this.LogOut}>
                        <View style={styles.MenuOptionBottom}>
                                <Icon style={styles.Icon} name="ios-log-out-outline" size={40}  />
                                <Text style={styles.MenuOptionBottomText}>Log Out</Text>
                        </View>
                     </TouchableHighlight>
               </View>
            </View>
        )
    }

    async LogOut()
    {
        try 
        {
            await AsyncStorage.setItem(STORAGE_TOKEN_KEY, '');
            this.TransitionScreen("Login");
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

const styles = {
    NavDrawerContainer: {
        flex: 1, 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        backgroundColor: 'white' 
    },
    Header: {
        alignSelf: 'stretch',
        height:100,
        backgroundColor: 'red',
        elevation: 5,
        marginBottom:20
    },
    MenuOption: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'stretch',
        height: 20
    },
    MenuOptionBottom:{
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'flex-end',
        height: 20,
        marginBottom:20
    },
    Icon: {
        marginLeft:10,
        width:40,
        maxWidth:60
    },
    MenuOptionText:{
        marginTop:7,
        marginLeft:30,
        fontSize: 20
    },
    MenuOptionBottomText: {
        fontSize: 20,
        marginLeft:20,
        marginBottom:8
    },
    BottomContent:{
        flex: 1,
        alignSelf: 'stretch'
    },
    TouchableHighlight: {
        flex: 1
    }
}