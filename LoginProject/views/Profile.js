import React, {Component, PropTypes} from 'react';
import {AsyncStorage, BackAndroid, View, Alert, Text, TextInput, ScrollView, Button, TouchableHighlight, ActivityIndicator, Image, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import Backbar from '../views_custom_components/Backbar';

var STORAGE_USER_INFO_KEY = 'WithUUserInfo';

export default class Profile extends Component {

    constructor() 
    {
      super();
      this.state = {
          email: '',
          firstName: '',
          lastName: '',
          token: '',
          profileURI: 'https://withu.blob.core.windows.net/publicimages/defaultUser.jpg',
          animating: false,
          errorMessage: '',
          errorMessageVisibility: false
        };

        this.GetUserDataFromLocalStorage = this.GetUserDataFromLocalStorage.bind(this);
        this.GetUserDataFromServer = this.GetUserDataFromServer.bind(this);
        this.TransitionScreen = this.TransitionScreen.bind(this);
        this.UpdateUsersInfo = this.UpdateUsersInfo.bind(this);
        this.StoreUserInfo = this.StoreUserInfo.bind(this);
        this.AddProfilePhoto = this.AddProfilePhoto.bind(this);
    }

    componentWillMount()
    {
        this.GetUserDataFromLocalStorage();
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
            <View style={{flex: 1, flexDirection: 'column'}}>
                <Backbar title="Profile" navigator={this.props.navigator} showBackNav={true} />
                <View style={{flex: 1, flexDirection:"row", maxHeight:200, backgroundColor:"#80cbc4", elevation:3}}>
                    <Image
                        style={styles.Image}
                        resizeMode="contain"
                        source={{uri: this.state.profileURI}}
                    />
                </View>
                <View style={styles.PhotoButtonContainer}>
                    <View style={styles.AddPhotoButton}>
                        <Button color="#f48fb1" title="+" onPress={this.AddProfilePhoto}></Button>
                    </View>
                </View>
                <ScrollView keyboardShouldPersistTaps={true} style={{flexDirection: 'column'}} contentContainerStyle={{alignItems: 'center', justifyContent: 'flex-start', height:300}}>
                <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                    <View style={styles.ControlContainer}>
                        <Text style={styles.ControlLabel}>Email</Text>
                        <TextInput style={styles.TextInput} placeholder="(required)" value={this.state.email} ref={(input) => this.emailTextInput = input} onChangeText={(email) => this.setState({email})}
                        keyboardType="email-address"
                        returnKeyType="next"
                        editable={false}
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
                        returnKeyType="done"></TextInput>
                    </View>
                    <View style={styles.UpdateButton}>
                        <Text style={styles.ErrorText}>{this.state.errorMessage}</Text>
                        <ActivityIndicator animating={true} style={{opacity: this.state.animating ? 1.0 : 0.0}} color="black"/>
                        <Button title="UPDATE INFO" onPress={this.UpdateUsersInfo}></Button>
                    </View>
                </View>
                </ScrollView>
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

               //The user has previously uploaded an image.
               if(userInfo.ProfileURI != null)
               {
                    this.setState({firstName: userInfo.FirstName, lastName: userInfo.LastName, email: userInfo.Email, token: userInfo.Token, profileURI: userInfo.ProfileURI });
               }
               else
               {
                   this.setState({firstName: userInfo.FirstName, lastName: userInfo.LastName, email: userInfo.Email, token: userInfo.Token});
               }
           }
        } 
        catch (error) {
            console.error(error);
        }
    }

    AddProfilePhoto()
    {
        ImagePicker.openPicker({
            height: 1000,
            width: 1500,
            cropping: true,
            compressImageQuality: 1
        }).then(image => {

            if(image.size > 2000000)
            {
                Alert.alert("File must be 2mb or less");
                return;
            }
            
            var photo = { uri: image.path, type: image.mime, name: 'profilePicture', };

            var body = new FormData(); 
            body.append('photo', photo);

            fetch('https://resty.azurewebsites.net/api/image/UploadProfileImage', {
                headers: new Headers({
                    "Content-Type": "multipart/form-data",
                    'Authorization': 'Token ' + this.state.token
                }),
                method: 'post',
                body: body
                }
            ).then((response) => response.json())
             .then((responseJson) => {
                    if(responseJson.bSuccessful)
                    {
                        this.setState({profileURI: responseJson.URI});
                        
                        //Store the image URI for future reference
                        var userInfo = {
                            "ProfileURI": responseJson.URI
                        }

                        //Store the users info to the local device
                        this.StoreUserInfo(userInfo);

                        //Update the icon for the drawer
                        this.props.navDrawer.setState({profileURI: responseJson.URI});
                    }
                    else
                    {
                        Alert.alert(responseJson.FailureReason);
                    }
                })
                .catch((error) => {
                    Alert.alert("Error");
                });
       });
    }

    GetUserDataFromServer(userId)
    {
        fetch('https://resty.azurewebsites.net/api/image/GetImageURI',{
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + this.state.token
                }),
                method: 'post',
                body: JSON.stringify({
                    FileName: "profile.jpg",
                    UserId: userId
                })
            }
        )
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.bSuccessful)
            {
                this.setState({profileURI: responseJson.URI})
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

    UpdateUsersInfo()
    {
        this.setState({animating: true, errorMessage: '', errorMessageVisibility: false});

        fetch('https://resty.azurewebsites.net/api/account/UpdateProfileInformation',{
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + this.state.token
                }),
                method: 'post',
                body: JSON.stringify({
                    FirstName: this.state.firstName,
                    LastName: this.state.lastName,
                    Email: this.state.email
                })
            }
        )
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.bSuccessful)
            {
                var userInfo = {
                    "LastName": responseJson.LastName,
                    "FirstName": responseJson.FirstName
                }
                
                //Store the users info to the local device
                this.StoreUserInfo(userInfo);

                //Show who's logged in for the drawer
                this.props.navDrawer.setState({usersName: userInfo.FirstName});

                //How to dismiss the keyboard programatically
                var DismissKeyboard = require('dismissKeyboard');
                DismissKeyboard();

                this.TransitionScreen('Home');
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
    
    async StoreUserInfo(userInfo)
    {
        try 
        {
            await AsyncStorage.mergeItem(STORAGE_USER_INFO_KEY, JSON.stringify(userInfo));
        } 
        catch (error) {
            Alert.alert(error.message);
        }
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
  TextInput: {
      height: 40,
      width: 250
  },
  ControlContainer: {
    flexDirection: 'column', 
    justifyContent: 'center', 
    marginTop: 10
 },
  ControlLabel: {
      fontSize:16,
      marginBottom: -8
  },
  ErrorText: {
      color: 'red'
  },
  Image: {
      flex: 1
  },
  AddPhotoButton: {
      width:55, 
      height:40,
      marginRight:15
  },
  UpdateButton: {
      width:250,
      marginTop:-10
  },
  PhotoButtonContainer:{
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-end",
      maxHeight:40,
      marginTop:-20
  }
});