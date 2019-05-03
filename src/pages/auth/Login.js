/* @flow */

import React, { Component } from 'react';
import {
	Container,
	Header,
	Title,
	Content,
	Footer,
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
		if(this.state.email.length!=0 && this.state.password.length!=0) {
			const user = {
				email: this.state.email,
				password: this.state.password,
			};
			FirebaseSvc.login(user, this.loginSuccess, this.loginFailed);
		}
		else {
			alert("Email or Password is Empty!");
		}
	}

	loginSuccess = () => {
		this.props.navigation.navigate("AppBottomNavigator");
	}

	loginFailed = () => {
		alert("Login Failure. Please Check Your Email or Password");
	}

  onPressSignUp = () => {
    this.props.navigation.navigate('SignUp');
  }

	onChangeTextEmail = (email) => {
		this.setState({email});
	}

	onChangeTextPassword = (password) => {
		this.setState({password});
	}

  render() {
    return (
      <Container>
				<Header androidStatusBarColor="#1C75BC" style={{display:'none'}}>
				</Header>
        <Content>
          <Text style={{textAlign: 'center', fontSize: 30, marginTop: 50}}>
            Login
          </Text>
          <Form>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input onChangeText={this.onChangeTextEmail}/>
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input secureTextEntry={true} onChangeText={this.onChangeTextPassword}/>
            </Item>
          </Form>
          <Button
            onPress={()=>this.onPressLogin()}
            style={{backgroundColor: "#1C75BC", alignSelf:'center', marginTop:10, width: '98%', justifyContent: 'center'}}
					>
            <Text>Login</Text>
          </Button>
        </Content>
				<Footer style={{backgroundColor: "#FFFFFF"}}>
					<Text>
						<Text>Don't have an account? </Text>
						<Text style={{color: "#1C75BC"}} onPress={()=>this.onPressSignUp()}>Sign Up</Text>
					</Text>
				</Footer>
      </Container>
    );
  }
}
