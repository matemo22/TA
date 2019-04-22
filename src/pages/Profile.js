/* @flow */

import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import {
  Container,
	Header,
	Title,
	Content,
	Button,
	Body,
	Text,
	Form,
	Label,
	Item,
	Input,
	Left,
	Right,
  List,
  ListItem,
  Thumbnail,
  Drawer,
  Toast,
} from 'native-base';
import FirebaseSvc from '../assets/services/FirebaseSvc';
import Icon from 'react-native-vector-icons/AntDesign';

export default class Setting extends Component {
  constructor(props){
    super(props);
    this.unsubscribe = null;
    this.user = FirebaseSvc.getCurrentUser();

    this.state = {
      group: '',
      doc: '',
      uri: '',
      refresh: false,
    };
  }

  componentDidMount = async () => {

  }

  componentWillUnmount = () => {

  }

  logout = async () => {
    await FirebaseSvc.logout(this.logoutSuccess, this.logoutFailed);
  }

  logoutSuccess = () => {
    console.log("Logout Successful. Navigate to AuthTabs");
    Toast.show({
      text: "Logout Success!",
      buttonText: "Okay!",
      duration: 2000
    });
    this.props.navigation.navigate("AuthTabs");
  }

  logoutFailed = () => {
    alert("Logout Failed");
  }

  render() {
    return (
      <Container>
        <Header style={{borderBottomWidth: 0}}>
          <Left></Left>
          <Body stle={{flex: 3}}></Body>
          <Right></Right>
        </Header>
        <Content bounces={false}>
          <View style={{backgroundColor: "#F8F8F8", justifyContent: 'center', alignItems: 'center'}}>
            <Thumbnail large source={this.user.photoURL!=null ? {uri: this.user.photoURL} : require('../assets/images/icon.png')} />
            <Text style={{marginTop: 20, fontSize: 20}}>{this.user.displayName}</Text>
          </View>

          <List>
            <ListItem noIndent style={{backgroundColor: "#F8F8F8"}}>
              <Text>Setting</Text>
            </ListItem>
            <ListItem icon onPress={()=>{this.logout()}}>
              <Left>
                <Icon name="logout"/>
              </Left>
              <Body>
                <Text>Logout</Text>
              </Body>
              <Right></Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}
