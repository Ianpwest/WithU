import React, {Component, PropTypes} from 'react';
import { View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class NavigationBar extends Component {
 
    //navStyle true if logged In
    //highlightIndex 1-4 of highlighted icon in logged in mode

    //showIcon shows app icon if logged Out
    

    render()
    {
        //Logged In View
        if(this.props.navStyle)
        {
            var getStyle = function (iconIndex, iconSetIndex) {
                var jsonStyle = {
                    color: 'white',
                    marginRight: 10
                };

                if (iconIndex == iconSetIndex) {
                    jsonStyle.color = 'yellow';
                }

                return jsonStyle;
            }

            return(
                <View style={{flexDirection: 'row', alignItems: 'center', height:65, backgroundColor: "#009688" }}>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <Icon style={getStyle(1, this.props.highlightIndex)} name="md-star" size={50}  />
                        <TouchableHighlight onPress={this.TransitionScreen.bind(this, 'My Activities')}><Icon style={getStyle(2, this.props.highlightIndex)} name="md-star" size={50}  /></TouchableHighlight>
                        <Icon style={getStyle(3, this.props.highlightIndex)} name="md-star" size={50}  />
                        <Icon style={getStyle(4, this.props.highlightIndex)} name="md-star" size={50}  />
                    </View>
                </View>
            )
        }
        //Logged Out View
        else
        {
            let icon = null;
            if(this.props.showIcon)
            {
                icon = <Icon style={styles.Icon} name="md-star" size={60}  />
            }
            return(
                <View style={{flexDirection: 'row', alignItems: 'center', height:65, backgroundColor: "#009688" }}>
                    {icon}
                    <Text style={styles.Header}>{this.props.title}</Text>
                </View>
            )
        }
       
    }

    TransitionScreen(strSceneName) {
        this.props.navigator.push({
            name: strSceneName
        });
    }
    
}

const styles = StyleSheet.create({
  Header:{
      fontSize:25,
      fontFamily: 'roboto_light',
      textAlign: 'center',
      flex: 1,
      color: "white"
  },
  Icon: {
      color: "white",
      marginRight:-45
  },
  IconNavStyle: {
      color: 'white',
      textAlign: 'left',
      marginRight:10
  }
});