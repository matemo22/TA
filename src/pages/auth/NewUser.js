/* @flow */

import React, { Component } from 'react';
import {
	Container,
	Header,
	Title,
	Content,
	Button,
	Left,
	Body,
	Right,
	Text,
	Form,
	Label,
	Item,
	Input,
	Thumbnail,
} from 'native-base';
import FirebaseSvc from '../../assets/services/FirebaseSvc';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class NewUser extends Component {
  constructor(props) {
	  super(props);
	  this.state = {
			name: '',
			avatar: '',
			url: '',
		};
	}

	onPressSave = async () => {
		if(this.state.name!='') {
			let user = {
				name: this.state.name,
			}
			if(this.state.avatar!='') {
				await FirebaseSvc.uploadAvatar(this.state.avatar);
			}
			await FirebaseSvc.createProfile(user, this.updateSuccess());
		}
		else {
			alert("Please Input Your Name");
		}
	}

	updateSuccess = () => {
		console.log("User Info Updated");
		this.props.navigation.navigate("AppBottomNavigator");
	}

	onChangeTextName = (name) => {this.setState({name});}

	handleChoosePhoto = () => {
		DocumentPicker.show({
			filetype: [DocumentPickerUtil.images()],
		},(error,res) => {
			if(res) {
				this.setState({avatar: res});
			}
			if(error) {
				console.log("Error", error);
			}
		});
	}

  render() {
		const noImg = <Icon name="account-circle" size={80} />;
		const img = <Thumbnail large source={{uri: this.state.avatar.uri}} />;
    return (
      <Container>
				<Header noLeft androidStatusBarColor="#1C75BC" style={{backgroundColor: "#1C75BC"}}>
					<Left>
					</Left>
					<Body>
						<Text style={{color: "#FFFFFF"}}>New Account</Text>
					</Body>
					<Right>
						<Button transparent onPress={()=>{this.onPressSave()}}>
							<Text style={{color: "#FFFFFF"}}>Save</Text>
						</Button>
					</Right>
				</Header>
        <Content>
					<Form style={{justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
            {(this.state.avatar!='') ? img : noImg}
						<Text onPress={this.handleChoosePhoto} style={{color: "#1C75BC", marginTop: 10}}>Select Avatar</Text>
						<Item floatingLabel>
              <Label>Your Name</Label>
              <Input onChangeText={(name)=>{this.onChangeTextName(name)}}/>
            </Item>
          </Form>
        </Content>
      </Container>
    );
  }
}
