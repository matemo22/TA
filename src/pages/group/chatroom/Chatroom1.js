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
  Drawer,
} from 'native-base';
import { GiftedChat } from 'react-native-gifted-chat';
import DrawerMenu from '../../assets/components/DrawerMenu';
import firebase from 'react-native-firebase';

export default class Chatroom extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
			header: null,
			gesturesEnabled: false,
    };
	};

  constructor(props){
    super(props);
    this.unsubscribe = null;

    //main data
    const { navigation } = this.props;
    this.title = navigation.getParam('title', 'Chatroom');
    this.data = navigation.getParam('data', 'Data');
    this.user = firebase.auth().currentUser;

    //query
    this.chatroom = this.data.chatroom;
    this.chats = this.chatroom.doc(this.data.id).collection('chats');
    this.query = this.chats.orderBy("createdAt", "desc");

    this.state = {
      messages:[],
    };
  }

  componentWillMount() {
    this.unsubscribe = this.query.onSnapshot(async (querySnapshot)=>{
      let messages = [];
      querySnapshot.forEach(async (doc)=>{
        var data = doc.data();
        data.user.avatar = 'https://placeimg.com/140/140/any';
        //doc.data().user.push({'avatar': 'gs://tugasakhir-74ab0.appspot.com/any.jpeg',});
        messages.push(data);
      });
      this.setState({ messages });
    });
  }

  sendMessage = (messages=[]) => {
    return this.chats.add(messages[0]);
  }

  sendMessage = (messages=[]) => {
    FirebaseSvc.sendMessage(messages[0], this.chatroom.id);
  }

	closeDrawer = () => {
		this._drawer._root.close();
	}

	openDrawer = () => {
		this._drawer._root.open();
	}

  render() {
    // console.log("This", this);
    return (
      <Drawer
				ref={(ref) => (this._drawer = ref)}
				content = {<DrawerMenu navigation={this.props.navigation} />}
				onClose = {()=>this.closeDrawer()} >
				<Header>
					<Left>
            <Button transparent onPress={()=>this.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body style={{flex: 3}}>
            <Title>{this.title}</Title>
          </Body>
          <Right>
          </Right>
				</Header>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.sendMessage(messages)}
          user={{
            _id: this.user.uid,
          }}
          placeholder="Type a message..."
        />
			</Drawer>
    );
  }
}
