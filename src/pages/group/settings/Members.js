/* @flow */

import React, { Component } from 'react';
import { View, AsyncStorage, FlatList } from 'react-native';
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

export default class Members extends Component {
  constructor(props){
    super(props);
    this.unsubscribeUser = null;
    this.group = this.props.navigation.getParam('group', []);
    this.state = {
      group: this.group,
      refresh: false,
      members: [],
    };
  }

  componentDidMount = async () => {
    this.unsubscribeUser = await FirebaseSvc
    .getAllUserRefByGId(this.group.id)
    .onSnapshot(this.fetchUser);
  }

  componentWillUnmount = () => {
    this.unsubscribeUser();
  }

  fetchUser = (querySnapshot) => {
    let members = [];
    querySnapshot.forEach( (doc) => {
      members.push({
        doc: doc,
        data: doc.data(),
        id: doc.id,
      });
    });
    this.setState({
      members: members,
      refresh: !this.state.refresh,
    });
  }

  // fetchUser = (doc) => {
  //   let data = doc.data();
  //   let user = {
  //     doc: doc,
  //     data: data,
  //     id: doc.id,
  //   };
  //   this.setState({
  //     user: user,
  //     refresh: !this.state.refresh,
  //   });
  // }

  _renderItem = ({item}) => {
    let temp = [];
    temp.push(
      <ListItem
      icon key={item.id}
      onPress={()=>{this.props.navigation.navigate("EditMember", {group: this.group, member: item})}}>
        <Left></Left>
        <Body>
          <Text>{item.data.displayName}{item.data.uid == FirebaseSvc.getCurrentUser().uid ? " (You)" : ""}</Text>
        </Body>
        <Right>
          <Icon name="delete" onPress={()=>{this.deleteMember(item.data.uid)}}/>
        </Right>
      </ListItem>
    )
    return (
      temp
    )
  }

  deleteMember = async (id) => {
    FirebaseSvc.deleteMember(id, this.state.group, this.deleteSuccess());
  }

  deleteSuccess = () => {
    Toast.show({
      text: "Member deleted Successfully",
      buttonText: "Okay!",
      duration: 2000,
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
              <Text>Members</Text>
            </ListItem>
            <FlatList
              data={this.state.members}
              renderItem={this._renderItem}
              extraData={this.state.refresh}
              keyExtractor={item=>item.id}
            />
          </List>
        </Content>
      </Container>
    );
  }
}
