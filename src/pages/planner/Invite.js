/* @flow */

import React, { Component } from 'react';
import {
  Container,
  Content,
  Header,
  Body,
  Footer,
  Text,
  Button,
  List,
  ListItem,
  Tab,
  Tabs,
  H1,
  Toast,
  Separator,
  Form,
  Item,
  Label,
  Input,
  Left,
  Right,
  CheckBox,
} from 'native-base';
import { StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Invite extends Component {
  constructor(props) {
    super(props);

    this.state = {
      friends: [],
      selectedFriendId: [],
      refresh: false,
    };
  }

  componentWillMount(){
    const friends = this.props.navigation.getParam('friends', []);
    const selectedFriendId = this.props.navigation.getParam('selectedFriendId', []);
    this.setState({
      friends: friends,
      selectedFriendId: selectedFriendId,
    });
  }

  onCheckBoxPress(id) {
    let tmp = this.state.selectedFriendId;

    if ( tmp.includes( id ) ) {
      tmp.splice( tmp.indexOf(id), 1 );
    } else {
      tmp.push( id );
    }

    this.setState({
      selectedFriendId: tmp,
      refresh: !this.state.refresh,
    });
  }

  selectFriend() {
    this.props.navigation.state.params.returnData(this.state.selectedFriendId);
    this.props.navigation.goBack();
  }

  render() {
    return (
      <Container>
        <Content>
          <Header>
            <Left>
              <Button
                transparent
                onPress={()=>{this.props.navigation.goBack()}}
              >
                <Icon name={"chevron-left"} size={30} color="#298CFB"/>
                <Text style={{marginLeft: -5}}>Back</Text>
              </Button>
            </Left>
            <Body stle={{flex: 3}}>
              <Text>Invite People</Text>
            </Body>
            <Right>
              <Button
                transparent
                onPress={()=>this.selectFriend()}
              >
                <Text>Select</Text>
              </Button>
            </Right>
          </Header>
          <List>
            <FlatList
              data={this.state.friends}
              extraData={this.state.refresh}
              renderItem={({item}) =>
                <ListItem>
                  <CheckBox
                    checked={this.state.selectedFriendId.includes(item.id) ? true : false}
                    onPress={()=>this.onCheckBoxPress(item.id)}
                  />
                  <Body>
                    <Text>{item.name}</Text>
                  </Body>
                </ListItem>
              }
              keyExtractor={item => item.key}
            />
          </List>
        </Content>
      </Container>
    );
  }
}
