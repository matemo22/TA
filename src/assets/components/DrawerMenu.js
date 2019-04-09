/* @flow */

import React, { Component } from 'react';
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
	Icon,
  List,
  ListItem,
  Thumbnail,
  Separator,
  ActionSheet,
} from 'native-base';
import { ScrollView, AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';

export default class DrawerMenu extends Component {
  constructor(props) {
    super(props);
    this.onCollectionUpdate = this.onCollectionUpdate.bind(this);
    this.user = firebase.auth().currentUser;
    this.groups = firebase.firestore().collection('groups').where('members','array-contains',this.user.uid);
    this.unsubscribe = null;
    this.menu = [];

    this.state = {
      loading: true,
      chatrooms: [],
      groups: [],
      categories: [],
      menu: [],
      groupId: "",
      chatroomId: "",
      active: false,
    }

    AsyncStorage.getItem('active', (error, result) => {
      if(result) {
        let resultParsed = JSON.parse(result);
        this.setState({
          chatroomId: resultParsed.chatroomId,
          groupId: resultParsed.groupId,
        });
      } else {
        this.setState({
          active: false,
        });
      }
    });
  }

  componentDidMount() {
		this.unsubscribe = this.groups.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
		this.unsubscribe();
	}

  saveData(groupId, chatroomId) {
    let chatroom = chatroomId;
    let group = groupId;
    let data = {
      groupId: group,
      chatroomId: chatroom,
    };
    AsyncStorage.setItem('active', JSON.stringify(data));
    this.setState({
      active: true,
    })
  }

  async onCollectionUpdate(querySnapshot) {
    this.menu.length = 0;
    const chatrooms = [];
    const groups = [];
    const categories = [];

    querySnapshot.forEach(async (doc)=>{
      var id_parent = doc.id;
      groups.push({
        data: doc.data(),
        doc: doc,
        id: doc.id,
      });
      const category = doc.ref.collection('categories');
      category.onSnapshot(async (querySnapshot)=>{
        querySnapshot.forEach(async (doc)=>{
          let chatroom = doc.ref.collection('chatrooms');
          categories.push({
            data: doc.data(),
            doc: doc,
            id: doc.id,
            chatroom: chatroom,
          });

          chatroom.onSnapshot(async (querySnapshot)=>{
            querySnapshot.forEach(async (doc)=>{
              if(!this.state.active) {
                this.saveData(id_parent, doc.id);
              }
              chatrooms.push({
                data: doc.data(),
                doc: doc,
                id: doc.id,
                chatroom: chatroom,
              });
            });
            this.setState({
              chatrooms: chatrooms,
            });
          });
        });
        this.setState({
          categories: categories,
        });
      });
    });
    this.setState({
      loading: false,
      groups: groups,
      menu: [],
    });
  }

  logout = () => {
		firebase.auth().signOut()
		.then(()=>{
			const { navigation } = this.props;
			navigation.navigate('Loading', {
				title: 'Loading',
			});
			console.log("SignOut");
		})
		.catch((error)=>{
			console.log("Error", error);
		});
	}

  openList = () => {
    var BUTTONS = [];
    for (var i = 0; i < this.state.groups.length; i++) {
      BUTTONS.push(this.state.groups[i].data.name);
    }
    BUTTONS.push("Create Group");
    BUTTONS.push("Cancel");
    var CANCEL_INDEX = BUTTONS.length-1;
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: "List Group"
      },
      buttonIndex => {
        this.setState({ clicked: BUTTONS[buttonIndex] });
      }
    );
  }

  render() {
    // console.log("Loading", this.state.loading);
    if(this.state.loading) {
      return null;
    }
    const { navigation } = this.props;
    const header = [];
    const check = [];
    const menu = [];
    // console.log("Chatrooms",this.state.chatrooms);
    // console.log("Group", this.state.groups);
    // console.log("Category", this.state.categories);
    var img = require('../images/icon.png');
    var key = 0;

    for (var i = 0; i < this.state.groups.length; i++) {
      var name = this.state.groups[i].data.name;
      var id = this.state.groups[i].id;
      if(this.state.groupId == id) {
        header.push(
          <Header key={i}>
            <Left>
              <Title>{name}</Title>
            </Left>
            <Right>
              <Button transparent>
                <Icon name='more' onPress={()=>{this.openList()}}/>
              </Button>
            </Right>
          </Header>
        );
      }
      for (var j = 0; j < this.state.categories.length; j++) {
        var parent_id = this.state.categories[j].doc.ref.parent.parent.id;

        if(parent_id === this.state.groupId && !check.includes(j)) {
          check.push(j);
          var parent = this.state.categories[j].data.name;
          var chatroom = this.state.categories[j].chatroom;
          var doc = this.state.categories[j].doc;

          var found = false;
          for (var l = 0; l < menu.length; l++) {
            console.log(menu[i].key, "==", parent);
            if(menu[i].key == parent) {
              found = true;
            }
          }
          if(!found) {

            console.log("Data",j, this.state.categories[j]);
            menu.push(
              <ListItem itemHeader key={parent}>
                <Left>
                  <Text>{j}. {parent}</Text>
                </Left>
                <Right>
                  <Icon name="add" onPress={()=>{
                    console.log(
                      "Data", this.state.categories[j],
                      "Clicked", doc,
                      "Parent", parent
                    );
                    navigation.push('CreateChatroom', {
                      title: "Create Chatroom",
                      chatroom: chatroom,
                      doc: doc,
                    });
                  }}/>
                </Right>
              </ListItem>
            );
          }
          for (var k = 0; k < this.state.chatrooms.length; k++) {
            if(this.state.chatrooms[k].doc.ref.parent.parent.id == this.state.categories[j].id) {
              let name = this.state.chatrooms[k].data.name;
              let data = this.state.chatrooms[k];
              var found = false;
              for (var l = 0; l < menu.length; l++) {
                if(menu[i].key == name) {
                  found = true;
                }
              }
              if(!found) {
                menu.push(
                  <ListItem key={name}>
                    <Text
                      onPress={()=>{navigation.push('Chatroom', {
                        title: name,
                        data: data,
                      })}}
                      style={{paddingLeft: 10, fontSize: 12}}>
                      {name}
                    </Text>
                  </ListItem>
                );
              }
            }
          }
        }
      }
    }
    console.log("Menu", menu);

    return (
      <Container>
        <Content style={{backgroundColor: '#f0f0f0'}}>
          <ScrollView style={{marginTop: 40}}>
            {header}
            <List>
              <ListItem onPress={()=>{navigation.push("Home", {
                title:'Home',
              })}}>
                <Text>Home</Text>
              </ListItem>
              {menu}
              <ListItem itemHeader>
                <Text>Option</Text>
              </ListItem>
              <ListItem onPress={()=>{this.logout()}}>
                <Icon name="settings" />
                <Text style={{marginLeft: 10}}>Logout</Text>
              </ListItem>
            </List>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
