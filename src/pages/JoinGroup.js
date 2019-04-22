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
  Switch,
  Toast,
} from 'native-base';
import FirebaseSvc from '../assets/services/FirebaseSvc';
import Icon from 'react-native-vector-icons/AntDesign';
import firebase from 'react-native-firebase';

export default class JoinGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
    }
  }

  onChangeTextName = (code) => {this.setState({code: code});}

  joinGroup = async () => {
    // await FirebaseSvc.joinGroup(this.state.code);
    let firestore = firebase.firestore();
    let ref = await firestore.collection("groups").where('code', '==', this.state.code).limit(1);
    ref.get()
    .then((querySnapshot) => {
      if(querySnapshot.size == 0) {
        alert("Group Not Found!");
        // AsyncStorage.setItem("message", "Group not Found");
      }
      else {
        querySnapshot.forEach((doc) => {
          let members = doc.data().members;
          let user = firebase.auth().currentUser;
          let found = members.includes(user.uid);
          let id = doc.id;
          let groupRef = doc.ref;
          if(found) {
            alert("You already in Group");
            // AsyncStorage.setItem("message", "You already in Group");
          }
          else {
            members.push(user.uid);
            let userRef = firestore.collection("user").doc(user.uid);
            return firestore.runTransaction((transaction) => {
              return transaction.get(userRef).then((doc) => {
                var groups = doc.data().groups;
                groups.push(id);
                transaction.update(userRef, { groups: groups });
                transaction.update(groupRef, { members: members });
              });
            });
            this.joinSuccess();
            // AsyncStorage.setItem("message", "Success");
          }
        });
      }
    });
    // AsyncStorage.removeItem("message");
    // const value = await AsyncStorage.getItem("message");
  }

  joinSuccess = () => {
    Toast.show({
      text: "Group Registered!",
      buttonText: "Okay!",
      duration: 2000,
    });
    this.props.navigation.goBack();
  }

  render() {
    return (
      <Container>
        <Header style={{borderBottomWidth: 0}}>
          <Left>
            <Button transparent>
              <Icon
                style={{marginLeft: 10}}
                name={"left"}
                size={25}
                onPress={()=>{this.props.navigation.goBack()}}
              />
            </Button>
          </Left>
          <Body stle={{flex: 3}}>
            <Text>Join Group</Text>
          </Body>
          <Right>
            <Button transparent
              onPress={()=>{this.joinGroup()}}>
              <Text>Join</Text>
            </Button>
          </Right>
        </Header>
        <Content bounces={false}>
          <Form>
            <Item floatingLabel>
              <Label>Group Code</Label>
              <Input onChangeText={(code) => {this.onChangeTextName(code)}}/>
            </Item>
          </Form>
        </Content>
      </Container>
    );
  }
}
