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
import { ImageEditor, } from 'react-native';
import FirebaseSvc from '../../assets/services/FirebaseSvc';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/AntDesign';

export default class SignUp extends Component {
  constructor(props) {
	  super(props);
	  this.state = {
			email: '',
			password: '',
      confPassword: '',
		};
	}

	onPressCreate = async () => {
		if(this.state.email!='' && this.state.password!='' && this.state.confPassword!='')
		{
			if(this.state.password == this.state.confPassword) {
				let user = {
					email: this.state.email,
					password: this.state.password,
				};
				FirebaseSvc.createAccount(user, this.createSuccess);
			}
		}
		else {
			alert("Data belum lengkap");
		}
	}

	createSuccess = () => {
		console.log("Create New Account Successful, navigate to Update Profile.");
		FirebaseSvc.createUser();
		this.props.navigation.navigate("NewUser");
	}

	createFailed = () => {
		alert("Create New Account Failure. Please Try Again");
	}

	onChangeTextEmail = (email) => {this.setState({email});}
	onChangeTextPassword = (password) => {this.setState({password});}
	onChangeTextConfPassword = (confPassword) => {this.setState({confPassword});}

  render() {
    return (
      <Container>
				<Header style={{backgroundColor: "#F8F8F8"}}>
					<Left>
						<Icon name='left' size={30} onPress={()=>{this.props.navigation.goBack()}} />
					</Left>
					<Body>
						<Text>New Account</Text>
					</Body>
					<Right>
						<Text onPress={()=>{this.onPressCreate()}}>Create</Text>
					</Right>
				</Header>
        <Content>
					<Form>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input onChangeText={(email)=>{this.onChangeTextEmail(email)}}/>
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input secureTextEntry={true} onChangeText={(password)=>{this.onChangeTextPassword(password)}}/>
            </Item>
						<Item floatingLabel last>
              <Label>Confirm Password</Label>
              <Input secureTextEntry={true} onChangeText={(confPassword)=>{this.onChangeTextConfPassword(confPassword)}}/>
            </Item>
          </Form>
        </Content>
      </Container>
    );
  }
}
