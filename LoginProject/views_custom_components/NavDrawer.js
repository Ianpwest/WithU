import React, {Component, PropTypes} from 'react';
import {AsyncStorage, Image, Button, TouchableHighlight, View, Text, Alert, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

var STORAGE_USER_INFO_KEY = 'WithUUserInfo';

export default class NavDrawer extends Component {

   constructor() {
      super();

      this.state = {
          usersName: '',
          profileURI: 'https://withu.blob.core.windows.net/publicimages/defaultUser.jpg',
      }

      this.GetUserDataFromLocalStorage = this.GetUserDataFromLocalStorage.bind(this);
      this.Profile = this.Profile.bind(this);
      this.LogOut = this.LogOut.bind(this);
   }

   componentDidMount()
   {
       this.GetUserDataFromLocalStorage();
   }

    render()
    {
        return(
           <View style={styles.NavDrawerContainer}>
               <View style={styles.Header}>
                    <TouchableHighlight style={styles.TouchableHighlight} underlayColor="#009688" onPress={this.Profile}>
                        <View style={styles.Circle}>
                            <Image
                                style={styles.ProfileImage}
                                resizeMode="cover"
                                source={{uri: this.state.profileURI}}
                            />
                        </View>
                    </TouchableHighlight>
                    <Text style={styles.NameText}>With {this.state.usersName}</Text>
               </View>
               
               <TouchableHighlight style={styles.TouchableHighlight} underlayColor="#009688" onPress={this.Profile}>
                    <View style={styles.MenuOption}>
                            <Icon style={styles.Icon} name="ios-person-outline" size={40}  />
                            <Text style={styles.MenuOptionText}>Profile</Text>
                    </View>
               </TouchableHighlight>

               <TouchableHighlight style={styles.TouchableHighlight} underlayColor="#009688" onPress={this.LogOut}>
                    <View style={styles.MenuOption}>
                            <Icon style={styles.Icon} name="ios-log-out-outline" size={40}  />
                        <Text style={styles.MenuOptionText}>Log Out</Text>
                    </View>
                </TouchableHighlight>

              
            </View>
        )
    }

    async GetUserDataFromLocalStorage()
    {
        try 
        {
           var userInfo = await AsyncStorage.getItem(STORAGE_USER_INFO_KEY);

           if(userInfo != null)
           {
               userInfo = JSON.parse(userInfo);
            
               if (userInfo.ProfileURI != '' && userInfo.ProfileURI != undefined) {
                   this.setState({ usersName: userInfo.FirstName, profileURI: userInfo.ProfileURI });
               }
               else {
                   this.setState({ usersName: userInfo.FirstName });
               }
                
           }
        } 
        catch (error) {
            console.error(error);
        }
    }

    Profile()
    {
        this.props.onProfileClicked();
    }

    async LogOut()
    {
        try 
        {
            var userInfo = {
                "Token": ''
            }

            await AsyncStorage.mergeItem(STORAGE_USER_INFO_KEY, JSON.stringify(userInfo));
            this.setState({usersName: ''});
            this.props.onLogoutClicked();
        } 
        catch (error) {
           console.error(error);
        }
    }
}

const styles = {
    NavDrawerContainer: {
        flex: 1, 
        flexDirection: 'column', 
        justifyContent: 'flex-start',
        backgroundColor: 'white' 
    },
    Header: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        height:50,
        backgroundColor: '#586A6A',
        elevation: 5,
        marginBottom:20
    },
    MenuOption: {
        height:50,
        flexDirection: 'row',
        alignSelf: 'stretch'
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
    Circle: {
        marginLeft: 10,
        height: 50,
        width: 50,
        borderRadius: 50,
        backgroundColor:'white'
    },
    ProfileImage:{
        flex: 1,
        height: 50,
        width: 50,
        borderRadius: 50
    },
    NameText: {
        fontFamily: 'roboto_light',
        fontSize: 20,
        color: 'white',
        marginLeft:10
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
        height:50,
        alignSelf: 'stretch'
    }
}