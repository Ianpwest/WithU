import React, {Component, PropTypes} from 'react';
import {View, Alert, Text, Button, TouchableHighlight, StyleSheet} from 'react-native';

function runService()
{
    fetch('http://resty.azurewebsites.net/api/status/GetCurrentServiceStatus')
      .then((response) => response.json())
      .then((responseJson) => {
        Alert.alert(responseJson.Status);
      })
      .catch((error) => {
        console.error(error);
      });
};

export default class MyScene extends Component {
    
    static get defaultProps(){
        return {
            title: 'My Scene',
            serviceResponse: 'No reponse yet.'
        };
    }
    render(){
        return(
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between', maxHeight: 250}}>
                <Text>Current Scene: {this.props.title}.</Text>

                <TouchableHighlight onPress={this.props.onForward} style={styles.NavigationButton}>
                    <Text>Tap me to load the next scene</Text>
                </TouchableHighlight>

                <TouchableHighlight onPress={this.props.onBack} style={styles.NavigationButton}>
                    <Text>Tap me to go back</Text>
                </TouchableHighlight>

                  <Button style={styles.ServiceButton}
                onPress={runService}
                title="Run Service"
                color="#841584"
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
  NavigationButton: {
    marginTop: 20
  },
  ServiceButton:{
      height:150
  }
});

MyScene.propTypes = {
  title: PropTypes.string.isRequired,
  onForward: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};