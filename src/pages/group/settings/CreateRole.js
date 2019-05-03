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

export default class CreateRole extends Component {
  constructor(props) {
    super(props);
    this.unsubscribeMembers = null;
    this.group = this.props.navigation.getParam('group', []);

    this.state = {
      status: false,
      name: '',
      nameEdited: false,
      showToast: false,
    }
  }

  onChangeTextName = (name) => {this.setState({name: name});}

  valueChange = (value) => {
		this.setState({
      statusEdited: true,
			status: value,
		});
	}

  createRole = () => {
    if(this.state.name.length!=0) {
      let role = {
        name: this.state.name,
        status: this.state.status,
        gid: this.group.id,
      };
      FirebaseSvc.createRole(role, this.createSuccess());
    }
    else {
      alert("Role Name is Empty");
    }
  }

  createSuccess = () => {
    Toast.show({
      text: "Role Created Successfully",
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
                color="#FFFFFF"
                style={{marginLeft: 10}}
                name={"left"}
                size={25}
                onPress={()=>{this.props.navigation.goBack()}}
              />
            </Button>
          </Left>
          <Body stle={{flex: 3}}>
            <Text style={{color: "#FFFFFF"}}>Create Role</Text>
          </Body>
          <Right>
            <Button transparent
              onPress={()=>{this.createRole()}}>
              <Text style={{color: "#FFFFFF"}}>Save</Text>
            </Button>
          </Right>
        </Header>
        <Content bounces={false}>
          <Form>
            <Item floatingLabel>
              <Label>Role Name</Label>
              <Input onChangeText={(name) => {this.onChangeTextName(name)}}/>
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
