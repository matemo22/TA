/* @flow */

import React, { Component } from 'react';
import { View, FlatList} from 'react-native';
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
  Switch,
  Toast,
} from 'native-base';
import FirebaseSvc from '../../../assets/services/FirebaseSvc';
import Icon from 'react-native-vector-icons/AntDesign';

export default class EditMember extends Component {
  constructor(props) {
    super(props);
    this.unsubscribeUser = null;
    this.unsubscribeRole = null;
    this.member = this.props.navigation.getParam('member', []);
    this.group = this.props.navigation.getParam('group', []);
    // console.log("Member", this.member);

    this.state = {
      user: this.member,
      role: [],
      selectedRoles: [],
      edited: false,
    }
  }

  componentDidMount = async () => {
    this.unsubscribeUser = await FirebaseSvc
      .getUserRef(this.member.id)
      .onSnapshot(this.fetchUser);
    this.unsubscribeRole = await FirebaseSvc
      .getRoleRef(this.group.id)
      .onSnapshot(this.fetchRole);
  }

  componentWillUnmount = () => {
    this.unsubscribeUser();
    this.unsubscribeRole();
  }

  fetchUser = (doc) => {
    let user = {
      doc: doc,
      data: doc.data(),
      id: doc.id,
    };
    // console.log("User",user);
    this.setState({
      user: user,
    });
  }

  fetchRole = (querySnapshot) => {
    let role = [];
    let selectedRoles = [];
    querySnapshot.forEach( (doc) => {
      let user = this.state.user;
      role.push({
        doc: doc,
        data: doc.data(),
        id: doc.id,
      });
      if(user.data.roles && user.data.roles.includes(doc.id)) {
        selectedRoles.push(doc.id);
      }
    });
    this.setState({
      role: role,
      selectedRoles: selectedRoles,
      refresh: !this.state.refresh,
    });
  }

  onSwitchRolesPress = (id) => {
		let tmp = this.state.selectedRoles;
    if (tmp.includes( id )) {
      tmp.splice( tmp.indexOf(id), 1 );
    }
    else {
      tmp.push( id );
    }
    this.setState({
      selectedRoles: tmp,
      edited: true,
      refresh: !this.state.refresh,
    });
	}

  updateRole = () => {
    let item = {
      uid: this.state.user.id,
      selectedRoles: this.state.selectedRoles,
    };
    FirebaseSvc.updateUserRole(item, this.updateSuccess());
  }

  updateSuccess = () => {
    Toast.show({
      text: "Roles Updated Successfully",
      buttonText: "Okay!",
      duration: 2000,
    });
    this.props.navigation.goBack();
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
                color="#777777"
                onPress={()=>{this.props.navigation.goBack()}}
              />
            </Button>
          </Left>
          <Body stle={{flex: 3}}>
            <Text>{this.state.user.data.displayName}</Text>
          </Body>
          <Right>
            <Button transparent
              disabled={!this.state.edited ? true : false}
              onPress={()=>{this.updateRole()}}>
              <Text>Save</Text>
            </Button>
          </Right>
        </Header>
        <Content bounces={false}>
          <View style={{margin: 16}}>
            <Text style={{textTransform: 'uppercase', fontSize: 12, color: '#757575'}}>Set Role for {this.state.user.data.displayName}</Text>
            <View style={{marginTop: 10}}>
              <FlatList
                data={this.state.role}
                extraData={this.state.refresh}
                keyExtractor={item => ""+item.id}
                renderItem={({item}) =>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 8}}>
                    <Text style={{color: '#757575'}}>{item.data.name}</Text>
                    <Switch
                      value={this.state.selectedRoles.includes(item.id) ? true : false}
                      trackColor={{true: '#298CFB'}}
                      onValueChange={()=>this.onSwitchRolesPress(item.id)}
                    />
                  </View>
                }
              />
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}
