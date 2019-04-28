/* @flow */

import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
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
} from 'native-base';
import FirebaseSvc from '../../../assets/services/FirebaseSvc';
import Icon from 'react-native-vector-icons/AntDesign';

export default class Setting extends Component {
  constructor(props){
    super(props);
    this.unsubscribe = null;
    this.group = this.props.navigation.getParam('group', []);

    this.state = {
      group: '',
      doc: '',
      uri: '',
      refresh: false,
    };
  }

  componentDidMount = async () => {
    var getRef = await FirebaseSvc.getGroupRefById(this.group.id);
    this.unsubscribe = getRef.onSnapshot(this.fetchGroup);
  }

  componentWillUnmount = () => {
    this.unsubscribe();
  }

  fetchGroup = (doc) => {
    let group = doc;

    this.setState({
      group: group,
      doc: doc,
      uri: doc._data.photoURL,
      refresh: !this.state.refresh,
    });
  }

  render() {
    return (
      <Container>
        <Header style={{backgroundColor: "#F8F8F8", borderBottomWidth: 0}}>
          <Left>
            <Button transparent>
              <Icon
                style={{marginLeft: 10}}
                name={"left"}
                size={25}
                onPress={()=>{this.props.navigation.dispatch(NavigationActions.back())}}
              />
            </Button>
          </Left>
          <Body stle={{flex: 3}}>
          </Body>
          <Right>
          </Right>
        </Header>
        <Content bounces={false}>
          <View style={{backgroundColor: "#F8F8F8", justifyContent: 'center', alignItems: 'center'}}>
            <Thumbnail large source={this.state.uri!='' ? {uri: this.state.uri} : require('../../../assets/images/icon.png')} />
            <Text style={{marginTop: 20, fontSize: 20}}>{this.state.doc ? this.state.doc._data.name : "Group Name"}</Text>
          </View>

          <List>
            <ListItem noIndent style={{backgroundColor: "#F8F8F8"}}>
              <Text>Setting</Text>
            </ListItem>
            <ListItem icon onPress={()=>{this.props.navigation.navigate("EditGroup", {group: this.state.group})}}>
              <Left>
                <Icon name="edit"/>
              </Left>
              <Body>
                <Text>Edit Group</Text>
              </Body>
              <Right></Right>
            </ListItem>
            <ListItem icon onPress={()=>{this.props.navigation.navigate("Category", {group: this.state.group})}}>
              <Left>
                <Icon name="book"/>
              </Left>
              <Body>
                <Text>Category</Text>
              </Body>
              <Right></Right>
            </ListItem>
            <ListItem icon onPress={()=>{this.props.navigation.navigate("Members", {group: this.state.group})}}>
              <Left>
                <Icon name="user"/>
              </Left>
              <Body>
                <Text>Members</Text>
              </Body>
              <Right></Right>
            </ListItem>
            <ListItem icon onPress={()=>{this.props.navigation.navigate("Role", {group: this.state.group})}}>
              <Left>
                <Icon name="solution1"/>
              </Left>
              <Body>
                <Text>Roles</Text>
              </Body>
              <Right></Right>
            </ListItem>
            <ListItem icon onPress={()=>{this.props.navigation.navigate("InvitationCode", {group: this.state.group})}}>
              <Left>
                <Icon name="link"/>
              </Left>
              <Body>
                <Text>Group Code</Text>
              </Body>
              <Right></Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}
