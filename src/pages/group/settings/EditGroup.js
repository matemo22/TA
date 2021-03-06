/* @flow */

import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
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
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';

export default class EditGroup extends Component {
  constructor(props){
    super(props);
    this.group = this.props.navigation.getParam('group', []);

    this.state = {
      name: this.group._data.name,
      url: this.group._data.photoURL,
      avatar: '',
      nameEdited: false,
      photoEdited: false,
    }
  }

  handleChoosePhoto = () => {
		DocumentPicker.show({
			filetype: [DocumentPickerUtil.allFiles()],
		},(error,res) => {
			if(res) {
				this.setState({avatar: res, photoEdited: true});
			}
			if(error) {
				console.log("Error", error);
			}
		});
	}

  saveEdit = () => {
    const newGroup = {
      id: this.group.id,
      name: this.state.name,
    };
    if(this.state.photoEdited) {
      FirebaseSvc.deleteGroupPhoto(this.group.id, this.state.avatar);
    }
    FirebaseSvc.editGroup(newGroup, this.updateSuccess());
  }

  updateSuccess = () => {
    Toast.show({
      text: "Group Updated",
      buttonText: "Okay!",
      duration: 2000,
    });
    this.props.navigation.goBack();
  }

  onChangeTextName = (name) => {this.setState({name, nameEdited: true});}

  render() {
    const noImg = <MaterialIcon name="account-circle" size={80} />;
    const imgDB = <Thumbnail large source={{uri: this.state.url}} />;
		const img = <Thumbnail large source={{uri: this.state.avatar.uri}} />;
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
          </Body>
          <Right>
            <Button
              disabled={!this.state.nameEdited && !this.state.photoURL}
              transparent
              onPress={()=>{this.saveEdit()}}>
              <Text style={{color: "#FFFFFF"}}>Save</Text>
            </Button>
          </Right>
        </Header>
        <Content>
					<Form style={{justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
            {(this.state.avatar!='') ? img : (this.state.url) ? imgDB : noImg}
						<Text onPress={this.handleChoosePhoto} style={{color: "#298CFB", marginTop: 10}}>Select Avatar</Text>
						<Item floatingLabel>
              <Label>Group Name</Label>
              <Input onChangeText={(name)=>{this.onChangeTextName(name)}} value={this.state.name} />
            </Item>
          </Form>
        </Content>
      </Container>
    );
  }
}
