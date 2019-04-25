/* @flow */

import React, { Component } from 'react';
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
	Icon,
  Grid,
  Col,
  Row,
	Left,
	Right,
  Toast,
} from 'native-base';
import FirebaseSvc from '../../assets/services/FirebaseSvc';

export default class Login extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
			header: null,
    };
	};

  constructor(props) {
		super(props);

		this.state = {
			email: '',
      password: '',
      user: null,
		};
	}

	onPressLogin = async() => {
		const user = {
			email: this.state.email,
			password: this.state.password,
		};
		FirebaseSvc.login(user, this.loginSuccess, this.loginFailed);
	}

	loginSuccess = () => {
		console.log("Login Successful, navigate to Home.");
		this.props.navigation.navigate("AppBottomNavigator");
	}

	loginFailed = () => {
		alert("Login Failure. Please Try Again");
	}

  signUp = () => {
    this.props.navigation.navigate('SignUp', {
      title: 'Sign Up',
    });
  }

  render() {
    return (
      <Container>
        <Content>
          <Text style={{textAlign: 'center', fontSize: 30, marginTop: 50}}>
            Login
          </Text>
          <Form>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input onChangeText={(email) => this.setState({email})}/>
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input secureTextEntry={true} onChangeText={(password) => this.setState({password})}/>
            </Item>
          </Form>
          <Button
            onPress={()=>this.onPressLogin()}
            style={{alignSelf:'center', marginTop:10, width: '98%', justifyContent: 'center'}}
            >
            <Text>Login</Text>
          </Button>
          <Button
            onPress={()=>this.signUp()}
            style={{alignSelf:'center', marginTop:5, width: '98%', justifyContent: 'center'}}
            >
            <Text>Sign Up</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
