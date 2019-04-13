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
    this.unsubscribe = null;
    this.group = this.props.navigation.getParam('group', []);

    this.state = {
      group: '',
      doc: '',
      refresh: false,
      members: [],
    };
  }

  fetchUser = (querySnapshot) => {
    let category = [];
    querySnapshot.forEach( (doc) => {
      category.push({
        doc: doc,
        data: doc.data(),
        id: doc.id,
        title: doc.data().name,
      });
    });

    // this._storeCategoryData(category);

    this.setState({
      category: category,
      refresh: !this.state.refresh,
    });
  }

  fetchChatroom = (querySnapshot) => {
    let chatroom = [];
    querySnapshot.forEach( (doc) => {
      chatroom.push({
        doc: doc,
        data: doc.data(),
        id: doc.id,
      });
    });

    // this._storeChatroomsData(chatroom);

    this.setState({
      chatroom: chatroom,
      refresh: !this.state.refresh,
    });
  }

  fetchRole = (querySnapshot) => {
    let role = [];
    querySnapshot.forEach( (doc) => {
      if(doc.data().members && doc.data().members.includes(FirebaseSvc.getCurrentUser().uid)){
        role.push({
          doc: doc,
          data: doc.data(),
          id: doc.id,
        });
      }
    });

    // this._storeChatroomsData(chatroom);

    this.setState({
      role: role,
      refresh: !this.state.refresh,
    });
  }

  componentDidMount = async () => {
    // await this.retrieveDataGroup();
    this.unsubscribeCategory = await FirebaseSvc
      .getCategoryRef(this.group.id)
      .onSnapshot(this.fetchCategory);
    this.unsubscribeChatroom = await FirebaseSvc
      .getChatroomRef(this.group.id)
      .onSnapshot(this.fetchChatroom);
    this.unsubscribeRole = await FirebaseSvc
      .getRoleRef(this.group.id)
      .onSnapshot(this.fetchRole);
  }

  componentWillUnmount = () => {
    this.unsubscribeCategory();
    this.unsubscribeChatroom();
    this.unsubscribeRole();
  }

  _renderItem2 = ({item}) => {
    let temp = [];
    if(!item.data.cid) {
      temp.push(
        <ListItem icon key={item.id}>
          <Left>
            <Icon name="book"/>
          </Left>
          <Body>
            <Text>{item.data.name}</Text>
          </Body>
          <Right>
            <Icon name="delete"/>
          </Right>
        </ListItem>
      )
    }
    return (
      temp
    )
  }

  deleteCategory = (item) => {
    FirebaseSvc.deleteCategory(item);
  }

  deleteChatroom = (id) => {
    FirebaseSvc.deleteChatroom(id);
  }

  _renderItem = ({item, index}) => {
    let temp = [];
    let chatroom = this.state.chatroom;
    let role = this.state.role;
    if(item.data.private) {
      if(role.some(r=>item.data.roles.includes(r.id))) {
        temp.push(
          <ListItem icon
            key={item.id}
            onPress={()=>{this.props.navigation.navigate('EditCategory', {item: item})}}
            style={{backgroundColor: '#F8F8F8', marginLeft: 0, marginTop: 10}}>
            <Left></Left>
            <Body>
              <View style={{flexDirection: 'row'}}>
                <Text>{item.title}</Text>
                <Icon name="edit"/>
              </View>
            </Body>
            <Right>
              <View style={{flexDirection: 'row'}}>
                <Icon name="lock" style={{marginRight: 15}}/>
                <Icon name="delete" onPress={()=>{this.deleteCategory(item)}}/>
              </View>
            </Right>
          </ListItem>
        );
        if(chatroom.some(a=>a.data.cid === item.id)) {
          for (var i = 0; i < chatroom.length; i++) {
            if(chatroom[i].data.cid==item.id){
              let chatroomData = chatroom[i];
              temp.push(
                <ListItem icon
                  key={chatroom[i].id}
                  onPress={()=>{this.props.navigation.navigate("EditChatroom", { item: chatroomData, parent: item})}}>
                  <Left><Icon name="edit"/></Left>
                  <Body><Text>{chatroom[i].data.name}</Text></Body>
                  <Right><Icon name="delete" onPress={()=>{this.deleteChatroom(id)}}/></Right>
                </ListItem>
              );
            }
          }
        }
      }
    }
    else {
      temp.push(
        <ListItem icon
          key={item.id}
          onPress={()=>{this.props.navigation.navigate('EditCategory', {item: item})}}
          style={{backgroundColor: '#F8F8F8', marginLeft: 0, marginTop: 10}}>
          <Left></Left>
          <Body>
            <View style={{flexDirection: 'row'}}>
              <Text>{item.title}</Text>
              <Icon name="edit"/>
            </View>
          </Body>
          <Right><Icon name="delete" onPress={()=>{this.deleteCategory(item)}}/></Right>
        </ListItem>
      );
      if(chatroom.some(a=>a.data.cid === item.id)) {
        for (var i = 0; i < chatroom.length; i++) {
          if(chatroom[i].data.cid==item.id){
            let chatroomData = chatroom[i];
            if(chatroom[i].data.private) {
              if(role.some(r=>chatroom[i].data.roles.includes(r.id))) {
                temp.push(
                  <ListItem icon
                    key={chatroom[i].id}
                    onPress={()=>{this.props.navigation.navigate("EditChatroom", {item: chatroomData, parent: item})}}>
                    <Left><Icon name="edit"/></Left>
                    <Body><Text>{chatroom[i].data.name}</Text></Body>
                    <Right>
                      <Icon name="lock"/>
                      <Icon name="delete" style={{marginLeft: 15}} onPress={()=>{this.deleteChatroom(id)}}/>
                    </Right>
                  </ListItem>
                );
              }
            }
            else {
              temp.push(
                <ListItem icon
                  key={chatroom[i].id}
                  onPress={()=>{this.props.navigation.navigate("EditChatroom", {item: chatroomData, parent:item})}}>
                  <Left><Icon name="edit"/></Left>
                  <Body><Text>{chatroom[i].data.name}</Text></Body>
                  <Right><Icon name="delete" onPress={()=>{this.deleteChatroom(id)}}/></Right>
                </ListItem>
              );
            }
          }
        }
      }
    }

    return(
      temp
    )
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
              <Text>Category</Text>
            </ListItem>
            <ListItem icon
              style={{marginLeft: 0, backgroundColor: "#F8F8F8"}}>
              <Left></Left>
              <Body>
                <Text>Uncategorized</Text>
              </Body>
              <Right></Right>
            </ListItem>
            <FlatList
              data={this.state.chatroom}
              renderItem={this._renderItem2}
              extraData={this.state.refresh}
              keyExtractor={item=>item.id}
            />
            <FlatList
              data={this.state.category}
              renderItem={this._renderItem}
              extraData={this.state.refresh}
              keyExtractor={item => item.id}
            />
          </List>
        </Content>
      </Container>
    );
  }
}
