/* @flow */

import React, { Component } from 'react';
import { View, } from 'react-native';
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
import FirebaseSvc from '../../../assets/services/FirebaseSvc';
import Icon from 'react-native-vector-icons/AntDesign';

export default class InvitationCode extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.group = this.props.navigation.getParam('group', []);
    this.state = {
      code: '',
      group: this.group,
      doc: this.group,
    }
  }

  componentDidMount = async () => {
    this.unsubscribe = await FirebaseSvc
      .getGroupRefById(this.group.id)
      .onSnapshot(this.fetchGroup);
  }

  fetchGroup = (doc) => {
    let group = {
      doc: doc,
      data: doc.data(),
      id: doc.id,
    };
    this.setState({
      group: group,
      doc: doc,
    });
  }

  generateCode = () => {
    FirebaseSvc.updateCode(this.state.group.id, this.updateSuccess());
  }

  updateSuccess = () => {
    Toast.show({
      text: "Group Code Updated",
      buttonText: "Okay!",
      duration: 2000
    })
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
                color="#777777"
                onPress={()=>{this.props.navigation.goBack()}}
              />
            </Button>
          </Left>
          <Body stle={{flex: 3}}>
          </Body>
          <Right>
          </Right>
        </Header>
        <Content bounces={false}>
          <List>
            <ListItem noIndent style={{backgroundColor: "#F8F8F8"}}>
              <Text>Group Code</Text>
            </ListItem>
            <ListItem icon style={{marginLeft: 0}}>
              <Left></Left>
              <Body>
                <Text>{this.state.doc._data.code}</Text>
              </Body>
              <Right style={{marginRight: -10}}>
                <Button transparent onPress={()=>{this.generateCode()}}>
                  <Text>New Code</Text>
                </Button>
              </Right>
            </ListItem>
            <Text note
              style={{marginLeft: 16, marginTop: 10}}>
              Give this code to New Members so they can join this Group.
            </Text>
          </List>
        </Content>
      </Container>
    );
  }
}
