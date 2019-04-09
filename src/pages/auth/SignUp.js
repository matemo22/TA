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
	Icon,
	Thumbnail,
} from 'native-base';
import { ImageEditor, } from 'react-native';
import FirebaseSvc from '../../assets/services/FirebaseSvc';
import ImagePicker from 'react-native-image-picker';

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
			try {
				const user = {
					// name: this.state.name,
					email: this.state.email,
					password: this.state.password,
				};
				const created = await FirebaseSvc.createAccount(user, this.createSuccess, this.createFailed);
			} catch({message}) {
				console.log("Create account failed. catch error: "+message);
			}
		}
		else {
			alert("Data belum lengkap");
		}
	}

	createSuccess = () => {
		console.log("Create New Account Successful, navigate to Update Profile.");
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
				<Header>
					<Left>
						<Button transparent onPress={()=>{this.props.navigation.goBack()}}>
							<Icon name='arrow-back' />
							<Text>Back</Text>
						</Button>
					</Left>
					<Body>
						<Text>New Account</Text>
					</Body>
					<Right>
						<Button transparent onPress={()=>{this.onPressCreate()}}>
							<Text>Create</Text>
						</Button>
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
