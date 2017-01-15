import React, {Component, PropTypes} from 'react';
import { View, Text, Alert, StyleSheet, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Drawer from 'react-native-drawer';

export default class Backbar extends Component {
 
    constructor(props) {
      super(props);

      this.NavigateBack = this.NavigateBack.bind(this);
   }
    

    render()
    {
        let icon = null;
        if(this.props.showBackNav)
        {
            icon = <TouchableHighlight style={styles.TouchableHighlightStyle} underlayColor='transparent' onPress={this.NavigateBack.bind(this)}>
                        <Icon style={styles.Icon} name="md-arrow-back" size={40}></Icon>
                    </TouchableHighlight>
        }
        else
        {
            icon = <View></View>
        }
        return(
            <View style={{flexDirection: 'row', alignItems: 'center', height:50, backgroundColor: "#009688" }}>
                {icon}
                <Text style={styles.Header}>{this.props.title}</Text>
            </View>
        )
       
    }

    NavigateBack()
    {
        this.props.navigator.pop();
    }
}

const styles = StyleSheet.create({
  Header:{
      fontSize:25,
      fontFamily: 'roboto_light',
      textAlign: 'center',
      flex: 1,
      color: "white",
      marginRight:40
  },
  Icon: {
      color: "white",
      
      marginLeft:15
  },
  IconNavStyle: {
      color: 'white',
      textAlign: 'left',
      marginRight:10
  },
  HamburgerIcon: {
      color: 'white',
      marginRight: 20
  },
  TouchableHighlightStyle: {
      width:50,
      height:40
  }
});