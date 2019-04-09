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
  List,
  ListItem,
  Thumbnail,
  Drawer,
} from 'native-base';
import { GiftedChat } from 'react-native-gifted-chat';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DrawerActions } from 'react-navigation';

export default class Chatroom extends Component {


  constructor(props){
    super(props);
    this.unsubscribe = null;

    //main data
    // const { navigation } = this.props;
    // this.title = navigation.getParam('title', 'Chatroom');
    // this.data = navigation.getParam('data', 'Data');
    // this.user = firebase.auth().currentUser;
    //
    // //query
    // this.chatroom = this.data.chatroom;
    // this.chats = this.chatroom.doc(this.data.id).collection('chats');
    // this.query = this.chats.orderBy("createdAt", "desc");

    this.state = {
      messages:[],
    };
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
  }

  // componentWillMount() {
    // this.unsubscribe = this.query.onSnapshot(async (querySnapshot)=>{
    //   let messages = [];
    //   querySnapshot.forEach(async (doc)=>{
    //     var data = doc.data();
    //     data.user.avatar = 'https://placeimg.com/140/140/any';
    //     //doc.data().user.push({'avatar': 'gs://tugasakhir-74ab0.appspot.com/any.jpeg',});
    //     messages.push(data);
    //   });
    //   this.setState({ messages });
    // });
  // }

  sendMessage = (messages=[]) => {
    return this.chats.add(messages[0]);
  }

	closeDrawer = () => {
		this._drawer._root.close();
	}

	openDrawer = () => {
		this._drawer._root.open();
	}

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    // console.log("This", this);
    return (
      <Container>
        <Header>
          <Left>
            <Icon
              style={{marginLeft: 10}}
              name={"menu"}
              size={30}
              color="#298CFB"
              onPress={()=>{this.props.navigation.dispatch(DrawerActions.toggleDrawer());}}
            />
          </Left>
          <Body stle={{flex: 3}}>
            <Text>Chatroom</Text>
          </Body>
          <Right>
          </Right>
        </Header>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
      </Container>
    );
  }
}
