import React, {Component, PropTypes} from 'react';
import { View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Drawer from 'react-native-drawer';

export default class NavigationBar extends Component {
 
    constructor(props) {
      super(props);

      this.TransitionScreen = this.TransitionScreen.bind(this);
      this.OpenControlPanel = this.OpenControlPanel.bind(this);
   }
    

    render()
    {
        //Logged In View
        if(this.props.navStyle)
        {
            var getStyle = function (iconIndex, iconSetIndex) {
                var jsonStyle = {
                    color: 'white',
                    marginRight: 20
                };

                if (iconIndex == iconSetIndex) {
                    jsonStyle.color = 'yellow';
                }

                return jsonStyle;
            }

            return(
                
                    <View style={{flexDirection: 'row', alignItems: 'center', height:50, backgroundColor: "#009688" }}>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                            <TouchableHighlight underlayColor="transparent" onPress={this.TransitionScreen.bind(this, 'Home', 1, this.props.highlightIndex)}><Icon style={[getStyle(1, this.props.highlightIndex), {marginLeft:10}]} name="ios-git-network-outline" size={40}  /></TouchableHighlight>
                            <TouchableHighlight underlayColor="transparent" onPress={this.TransitionScreen.bind(this, 'My Activities', 2, this.props.highlightIndex)}><Icon style={getStyle(2, this.props.highlightIndex)} name="ios-albums-outline" size={40}  /></TouchableHighlight>
                            <Icon style={getStyle(3, this.props.highlightIndex)} name="ios-add-circle-outline" size={40}  />
                            <Icon style={getStyle(4, this.props.highlightIndex)} name="ios-chatbubbles-outline" size={40}  />
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <TouchableHighlight underlayColor="transparent" onPress={this.OpenControlPanel}><Icon style={styles.HamburgerIcon} name="ios-menu-outline" size={40}  /></TouchableHighlight>
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
                icon = <Icon style={styles.Icon} name="md-star" size={40}  />
            }
            return(
                <View style={{flexDirection: 'row', alignItems: 'center', height:50, backgroundColor: "#009688" }}>
                    {icon}
                    <Text style={styles.Header}>{this.props.title}</Text>
                </View>
            )
        }
       
    }

    CloseControlPanel(){
        this.props.drawer.close()
    }

    OpenControlPanel(){
        this.props.drawer.open()
    }

    TransitionScreen(strSceneName, iconIndex, highlightedIconIndex) {
        //Only navigate if not already on the screen
        if(iconIndex != highlightedIconIndex)
        {
            this.props.navigator.push({
                        name: strSceneName
                    });
        }
    };
    
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
  },
  HamburgerIcon: {
      color: 'white',
      marginRight: 20
  }
});