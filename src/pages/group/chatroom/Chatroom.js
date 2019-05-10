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
import { GiftedChat, Actions, Composer, SystemMessage, Send } from 'react-native-gifted-chat';
import FirebaseSvc from '../../../assets/services/FirebaseSvc';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default class Chatroom extends Component {


  constructor(props){
    super(props);
    this.unsubscribeChat = null;
    this.item = this.props.navigation.getParam('item', {data: {name: "Item"}});
    this.parent = this.props.navigation.getParam('parent', {data: {name: ""}})
    this.user = FirebaseSvc.getCurrentUser();

    this.state = {
      messages:[],
      sendImage:'',
    };
  }

  componentWillMount = async () => {
    this.unsubscribeChat = await FirebaseSvc
      .getChatRef(this.item.id)
      .onSnapshot(this.fetchMessage);
  }

  fetchMessage = (querySnapshot) => {
    let messages = [];
    querySnapshot.forEach( (doc) => {
      messages.push(doc.data().message);
    });
    this.setState({
      messages: messages,
    });
  }

  sendMessage = (messages=[]) => {
    FirebaseSvc.sendMessage(messages[0], this.item);
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  renderComposer(props) {
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

  renderSend(props) {
    return (
      <Send
        {...props}
      >
        <View style={{marginRight: 10, marginBottom: 10}}>
          <MaterialIcon name="send" size={29}/>
        </View>
      </Send>
    );
  }

  render() {
    // console.log("This", this);
    return (
      <Container>
        <Header androidStatusBarColor="#1C75BC" style={{backgroundColor: "#1C75BC", borderBottomWidth: 0}}>
          <Left>
            <Button transparent>
              <Icon
                color="#FFFFFF"
                style={{marginLeft: 10}}
                name={"left"}
                size={25}
                onPress={()=>{this.props.navigation.goBack()}}
              />
            </Button>
          </Left>
          <Body stle={{flex: 3}}>
            <Text style={{color: "#FFFFFF"}}>{this.parent.data.name}</Text>
          </Body>
          <Right>
          </Right>
        </Header>
        <ListItem noIndent style={{backgroundColor: "#F8F8F8"}}>
          <Text>{this.item.data.name}</Text>
        </ListItem>
        <GiftedChat
          messages={this.state.messages}
          multiline={true}
          onSend={messages => this.sendMessage(messages)}
          renderUsernameOnMessage={true}
          isLoadingEarlier={true}
          // renderActions={this.renderActions}
          renderComposer={this.renderComposer}
          renderSend={this.renderSend}
          // onPressActionButton = {this.handleChoosePhoto}
          user={{
            _id: this.user.uid,
            avatar: this.user.photoURL,
            name: this.user.displayName,
          }}
        />
      </Container>
    );
  }
}
