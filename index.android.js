/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Alert,
  Image,
  ScrollView
} from 'react-native';

import { Badge, Text, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon } from 'native-base';
import Camera from './camera';

export default class AwesomeProject extends Component {
  onBeerClick() {
    Alert.alert(
    'Alert Title',
    'My Alert Msg',
    [
      {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ],
    { cancelable: false }
  )
  }

  render() {
     let pic = {
      uri: 'http://indianautosblog.com/wp-content/uploads/2017/03/Honda-Activa-4G-front.jpg'
    };
    return (
       <ScrollView>
     <Container>
        <Header>
            <Left>
                <Button transparent>
                    <Icon name='menu' />
                </Button>
            </Left>
            <Body>
                <Title>Header</Title>
            </Body>
            <Right />
        </Header>

        <Content>
        <Camera />
             <Button iconLeft rounded onPress={this.onBeerClick}>
                <Icon name='beer' />
                <Text>Home</Text>
            </Button>
            <Image source={pic} style={{width: 193, height: 110}}/>
            <Badge>
                <Text>2</Text>
            </Badge>
            <Badge primary>
                <Text>2</Text>
            </Badge>
            <Badge success>
                <Text>2</Text>
            </Badge>
            <Badge info>
                <Text>2</Text>
            </Badge>
            <Badge warning>
                <Text>2</Text>
            </Badge>
            <Badge danger>
                <Text>2</Text>
            </Badge>
            <Badge primary>
                <Icon name="star" />
            </Badge>
            <Badge
              style={{ backgroundColor: 'black' }}>
                <Text>1866</Text>
            </Badge>
        </Content>

        <Footer>
            <FooterTab>
                <Button full>
                    <Text>Footer</Text>
                </Button>
            </FooterTab>
        </Footer>
    </Container>
    </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
