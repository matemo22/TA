/* @flow */

import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
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
} from 'native-base';
import FirebaseSvc from '../../../assets/services/FirebaseSvc';
import Icon from 'react-native-vector-icons/AntDesign';

export default class Role extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.group = this.props.navigation.getParam('group', []);
    this.state = {
      refresh: false,
      role: [],
      showToast: false,
    }
  }

  componentDidMount = async () => {
    this.unsubscribe = await FirebaseSvc
      .getRoleRef(this.group.id)
      .onSnapshot(this.fetchRole);
  }

  componentWillUnmount = () => {
    this.unsubscribe();
  }

  fetchRole = (querySnapshot) => {
    let role = [];
    querySnapshot.forEach( (doc) => {
			role.push({
        doc: doc,
        data: doc.data(),
        id: doc.id,
      });
    });

    this.setState({
      role: role,
      refresh: !this.state.refresh,
    });
  }

  _renderItem = ({item}) => {
    let temp = [];
    temp.push(
      <ListItem icon
        key={item.id}
        onPress={()=>{this.props.navigation.navigate("EditRole", {item: item})}}>
        <Left></Left>
        <Body>
          <View style={{flexDirection: 'row'}}>
            <Text>{item.data.name}</Text>
            <Icon name="edit"/>
          </View>
        </Body>
        <Right>
          <Icon name="delete" onPress={()=>{this.deleteRole(item)}}/>
        </Right>
      </ListItem>
    )
    return (
      temp
    )
  }

  deleteRole = (item) => {
    //Do Delete FirebaseSvc
    FirebaseSvc.deleteRole(item.id, this.deleteSuccess(item));
  }

  deleteSuccess = (item) => {
    Toast.show({
      text: "Role "+item.data.name+" deleted Successfully",
      buttonText: "Okay!",
      duration: 2000,
    });
  }

  render() {
    return (
      <Container>
        <Header androidStatusBarColor="#1C75BC" style={{backgroundColor: "#1C75BC", borderBottomWidth: 0}}>
          <Left>
            <Button transparent>
              <Icon
                style={{marginLeft: 10}}
                name={"left"}
                size={25}
                color="#FFFFFF"
                onPress={()=>{this.props.navigation.goBack()}}
              />
            </Button>
          </Left>
          <Body style={{flex: 3}}>
            <Text style={{color: "#FFFFFF"}}>Roles</Text>
          </Body>
          <Right>
            <Text
              onPress={()=>{this.props.navigation.navigate("CreateRole", {group: this.group})}}
              style={{marginRight: 5, color: "#FFFFFF"}}
            >
              Add
            </Text>
          </Right>
        </Header>
        <Content bounces={false}>
          <List>
            <FlatList
              data={this.state.role}
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
