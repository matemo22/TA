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
  Switch,
  Toast,
} from 'native-base';
import FirebaseSvc from '../../../assets/services/FirebaseSvc';
import Icon from 'react-native-vector-icons/AntDesign';

export default class EditRole extends Component {
  constructor(props) {
    super(props);
    this.unsubscribeMembers = null;
    this.item = this.props.navigation.getParam('item', []);

    this.state = {
      status: this.item.data.canEdit,
      name: this.item.data.name,
      id: this.item.id,
      nameEdited: false,
      statusEdited: false,
      showToast: false,
    }
  }

  onChangeTextName = (name) => {this.setState({name: name, nameEdited: true});}

  valueChange = (value) => {
		this.setState({
      statusEdited: true,
			status: value,
		});
	}

  updateRole = () => {
    if(this.state.name.length!=0) {
      var role = {
        name: this.state.name,
        status: this.state.status,
        gid: this.state.id,
      };
      FirebaseSvc.updateRole(role, this.updateSuccess());
    }
    else {
      alert("Role Name is Empty");
    }
  }

  updateSuccess = () => {
    Toast.show({
      text: "Role Updated Successfully",
      buttonText: "Okay!",
      duration: 2000,
    });
    this.props.navigation.goBack();
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
          <Body stle={{flex: 3}}>
            <Text style={{color: "#FFFFFF"}}>Update Role</Text>
          </Body>
          <Right>
            <Button transparent
              disabled={!this.state.nameEdited && !this.state.statusEdited ? true : false}
              onPress={()=>{this.updateRole()}}>
              <Text style={{color: "#FFFFFF"}}>Save</Text>
            </Button>
          </Right>
        </Header>
        <Content bounces={false}>
          <Form>
            <Item floatingLabel>
              <Label>Role Name</Label>
              <Input onChangeText={(name) => {this.onChangeTextName(name)}} value={this.state.name}/>
            </Item>
            <View style={{borderBottomColor: '#F2F0F3', borderBottomWidth: 1}}>
							<View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 16}}>
								<Text style={{color: '#757575'}}>Role Can Edit Group</Text>
								<Switch
									value={this.state.status}
									onValueChange={this.valueChange}
									trackColor={{true: '#298CFB'}}
								/>
							</View>
						</View>
          </Form>
        </Content>
      </Container>
    );
  }
}
