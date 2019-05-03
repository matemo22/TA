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
			samePassword: false,
		};
	}

	onPressCreate = async () => {
		if(this.state.email!='' && this.state.password!='' && this.state.confPassword!='')
		{
			if(this.state.samePassword) {
				let user = {
					email: this.state.email,
					password: this.state.password,
				};
				FirebaseSvc.createAccount(user, this.createSuccess);
			}
			else {
				alert("Please Check Your Password and Confirm Password");
			}
		}
		else {
			alert("Data is Empty!");
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
	onChangeTextPassword = (password) => {
		let status = false;
		if(password == this.state.confPassword) {
			status = true;
		}
		this.setState({password, samePassword: status});
	}
	onChangeTextConfPassword = (confPassword) => {
		let status = false;
		if(this.state.password == confPassword) {
			status = true;
		}
		this.setState({confPassword, samePassword: status});
	}

  render() {
    return (
      <Container>
				<Header androidStatusBarColor="#1C75BC" style={{backgroundColor: "#1C75BC"}}>
					<Left>
						<Icon name='left' color="#FFFFFF" size={30} onPress={()=>{this.props.navigation.goBack()}} />
					</Left>
					<Body>
						<Text style={{color: "#FFFFFF"}}>New Account</Text>
					</Body>
					<Right>
						<Text style={{color: "#FFFFFF"}} onPress={()=>{this.onPressCreate()}}>Create</Text>
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
