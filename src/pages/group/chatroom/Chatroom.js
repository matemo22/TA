/* @flow */

import React, { Component } from 'react';
import { View } from 'react-native';
import {
  Container,
	Header,
	Title,
	Content,
  Footer,
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
import { GiftedChat, Actions, Composer } from 'react-native-gifted-chat';
import FirebaseSvc from '../../../assets/services/FirebaseSvc';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';

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
      sendImage:'',
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

  renderComposer(props) {
    console.log('props',props);
    return (
      <Composer
         {...props}
         placeholder={'Type a message...'}
         placeholderColor={'#BCBCBC'}
      />
    );
  }

  renderActions(props) {
    const icon = () => {
      return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Icon name="picture" size={20}/>
        </View>
      )
    }
    return(
      <Actions
        {...props}
        icon={icon}
      />
    )
  }

  handleChoosePhoto = () => {
		const options = {
			noData: true,
		};
		ImagePicker.launchImageLibrary(options, response => {
			if(response.uri) {
				// let uploadUrl = FirebaseSvc.uploadAvatar(response);
				this.setState({ sendImage: response });
			}
		});
	}

  render() {
    // console.log("This", this);
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
        </Body>
        <Right>
          <Button transparent>
            <Icon name="folder1" size={20} />
          </Button>
          <Button transparent>
            <Icon name="profile" size={20} />
          </Button>
        </Right>
      </Header>
        <GiftedChat
          messages={this.state.messages}
          multiline={true}
          onSend={messages => this.onSend(messages)}
          renderActions={this.renderActions}
          renderComposer={props => this.renderComposer(props)}
          onPressActionButton = {this.handleChoosePhoto}
          user={{
            _id: 1,
          }}
        />
      </Container>
    );
  }
}
