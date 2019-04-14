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
    let members = [];
    querySnapshot.forEach( (doc) => {
			if(this.group.data.members.includes(doc.id) && doc.id != FirebaseSvc.getCurrentUser().uid) {
				members.push({
	        doc: doc,
	        data: doc.data(),
	        id: doc.id,
	      });
			}
    });

    // this._storeCategoryData(category);

    this.setState({
      members: members,
      refresh: !this.state.refresh,
    });
  }

  componentDidMount = async () => {
    // await this.retrieveDataGroup();
    this.unsubscribe = await FirebaseSvc
      .getUserRef()
      .onSnapshot(this.fetchUser);

  componentWillUnmount = () => {
    this.unsubscribe();
  }

  _renderItem = ({item}) => {
    let temp = [];
    temp.push(
      <ListItem icon key={item.id}>
        <Left></Left>
        <Body>
          <Text>{item.data.displayName}</Text>
        </Body>
        <Right>
          <Icon name="delete" onPress={()=>{this.deleteMember(item.id)}}/>
        </Right>
      </ListItem>
    )
    return (
      temp
    )
  }

  deleteMember = (id) => {
    FirebaseSvc.deleteMember(id, this.group);
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
