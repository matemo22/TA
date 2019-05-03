/* @flow */

import React, { Component } from 'react';
import { View, AsyncStorage, FlatList, StyleSheet } from 'react-native';
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
  ActionSheet,
} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { NavigationActions } from 'react-navigation';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import FirebaseSvc from '../../assets/services/FirebaseSvc';
import { Col, Row, Grid } from "react-native-easy-grid";

export default class CategoryChatroom extends Component {
  constructor(props) {
    super(props);
    this.unsubscribeCategory=null;
    this.unsubscribeChatroom=null;
    this.unsubscribeRole=null;
    this.unsubscribeUser=null;
    this.group = this.props.navigation.dangerouslyGetParent().getParam("group", []);

    this.state = {
      category: [],
      chatroom: [],
      role: [],
      user: '',
      refresh: false,
    }
  }

  async componentDidMount() {
    this.unsubscribeUser = await FirebaseSvc
      .getUserRef(FirebaseSvc.getCurrentUser().uid)
      .onSnapshot(this.fetchUser);
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
    this.unsubscribeUser();
	}

  fetchCategory = (querySnapshot) => {
    let category = [];
    querySnapshot.forEach( (doc) => {
      category.push({
        doc: doc,
        data: doc.data(),
        id: doc.id,
        title: doc.data().name,
      });
    });
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
    this.setState({
      chatroom: chatroom,
      refresh: !this.state.refresh,
    });
  }

  fetchUser = (doc) => {
    let data = doc.data();
    let user = {
      doc: doc,
      data: data,
      id: doc.id,
    };
    this.setState({
      user: user,
    });
  }

  fetchRole = (querySnapshot) => {
    let role = [];
    querySnapshot.forEach( (doc) => {
      let user = this.state.user;
      if(user.data.roles && user.data.roles.includes(doc.id)) {
        role.push({
          doc: doc,
          data: doc.data(),
          id: doc.id,
        });
      }
    });
    this.setState({
      role: role,
      refresh: !this.state.refresh,
    });
  }

  _renderItem2 = ({item}) => {
    let temp = [];
    if(!item.data.cid) {
      temp.push(
        <ListItem onPress={()=>this.props.navigation.navigate("Chatroom", {item: item})} key={item.id}>
          <Icon name="book"/>
          <Text style={styles.deactiveListItemTextIcon}>{item.data.name}</Text>
        </ListItem>
      )
    }
    return (
      temp
    )
  }

  _renderCategory = ({item, index}) => {
    let temp = [];
    let chatroom = this.state.chatroom;
    let role = this.state.role;
    let user = this.state.user;
    if(item.data.private) {
      if(role.some(r=>item.data.roles.includes(r.id))) {
        temp.push(
          <ListItem
            key={item.id}
            style={chatroom.some(a=>a.data.cid === item.id) ?
              {}:{marginBottom: 10}, styles.category
            }>
            <Left>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color: '#777777', marginLeft: 16, fontSize: 10, fontFamily: 'System', textTransform: 'uppercase'}}>{item.title}</Text>
                <Icon color="#777777" name="lock" style={{marginRight: 15}}/>
              </View>
            </Left>
            <Right>
              <MaterialIcon
                name="add"
                color="#777777"
                onPress={()=>{this.props.navigation.navigate("CreateChatroom", {group: this.group, item: item })}}/>
            </Right>
          </ListItem>
        );
        if(chatroom.some(a=>a.data.cid === item.id)) {
          for (var i = 0; i < chatroom.length; i++) {
            if(chatroom[i].data.cid==item.id){
              let tempData = chatroom[i];
              temp.push(
                <ListItem onPress={()=>{this.props.navigation.navigate("Chatroom", {item: tempData, parent: item})}} key={chatroom[i].id}>
                  <Icon name="book"/>
                  <Text style={styles.deactiveListItemTextIcon}>{chatroom[i].data.name}</Text>
                </ListItem>
              );
            }
          }
        }
      }
    }
    else {
      temp.push(
        <ListItem
          key={item.id}
          onPress={()=>{console.log("Open Dashboard");}}
          style={chatroom.some(a=>a.data.cid === item.id) ?
            {}:{marginBottom: 10}, styles.category
          }>
          <Left>
            <Text style={{color: '#777777', marginLeft: 16, fontSize: 10, fontFamily: 'System', textTransform: 'uppercase'}}>{item.title}</Text>
          </Left>
          <Right>
            <MaterialIcon
              name="add"
              color="#777777"
              onPress={()=>{this.props.navigation.navigate("CreateChatroom", {group: this.group, item: item })}}/>
          </Right>
        </ListItem>
      );
      if(chatroom.some(a=>a.data.cid === item.id)) {
        for (var i = 0; i < chatroom.length; i++) {
          if(chatroom[i].data.cid==item.id){
            let tempData = chatroom[i];
            if(chatroom[i].data.private) {
              if(role.some(r=>chatroom[i].data.roles.includes(r.id))) {
                temp.push(
                  <ListItem onPress={()=>{this.props.navigation.navigate("Chatroom", {item: tempData, parent: item})}} key={chatroom[i].id}>
                    <Icon name="book"/>
                    <Text style={styles.deactiveListItemTextIcon}>{chatroom[i].data.name}</Text>
                    <Icon name="lock" color="#777777" style={{marginLeft: 3}}/>
                  </ListItem>
                );
              }
            }
            else {
              temp.push(
                <ListItem onPress={()=>{this.props.navigation.navigate("Chatroom", {item: tempData, parent: item})}} key={chatroom[i].id}>
                  <Icon name="book"/>
                  <Text style={styles.deactiveListItemTextIcon}>{chatroom[i].data.name}</Text>
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

  _actionSheetClick = (buttonIndex) => {
    if(buttonIndex==0) {
      this.props.navigation.navigate("Setting", {
        group: this.group,
      });
    }
    else if(buttonIndex==1) {
      this.props.navigation.navigate("CreateCategory", {
        group: this.group,
      });
    }
    else if(buttonIndex==2) {
      this.props.navigation.navigate("CreateChatroomUn", {
        group: this.group,
      });
    }
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
            <Text>{this.group.data.name}</Text>
          </Body>
          <Right>
            <Icon name="folder1" size={20} />
            <Icon
              name="profile"
              size={20}
              style={{marginLeft: 16}}
              onPress={()=>{this.props.navigation.navigate("Notes", {group: this.group});}}/>
            <MaterialIcon
              name="more-vert"
              size={20}
              style={{marginBottom: 2, marginLeft: 8}}
              onPress={()=>{
              const BUTTONS = ['Setting', 'Create Category', 'Create Chatroom', 'Cancel'];
              ActionSheet.show({
                options: BUTTONS,
                cancelButtonIndex: BUTTONS.length-1,
              }, (buttonIndex)=>{
                this._actionSheetClick(buttonIndex)
              })
            }}/>
          </Right>
        </Header>
        <Content bounces={false}>
          <FlatList
            data={this.state.chatroom}
            renderItem={this._renderItem2}
            extraData={this.state.refresh}
            keyExtractor={(item, index) => item.id}
          />
          <FlatList
            data={this.state.category}
            extraData={this.state.refresh}
            renderItem={this._renderCategory}
            keyExtractor={(item, index) => item.id}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  category: {
    backgroundColor: '#F0EFF5',
    marginLeft: 0,
    borderColor: '#C9C9C9'
  },
  activeListItem: {
    backgroundColor: '#298CFB',
    marginLeft: 0,
  },
  activeListItemIcon: {
    marginLeft: 16,
    color: '#FFF',
  },
  activeListItemText: {
    marginLeft: 5,
    color: '#FFF',
  },
  deactiveListItemTextIcon: {
    marginLeft: 5,
  }
});
