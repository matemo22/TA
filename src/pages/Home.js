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
	Left,
	Right,
	Icon,
	Drawer,
} from 'native-base';
import DrawerMenu from '../assets/components/DrawerMenu';
import firebase from 'react-native-firebase';

export default class Home extends Component {
	static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
			// header: null,
			gesturesEnabled: false,
    };
	};

	logout = () => {
		firebase.auth().signOut()
		.then(()=>{
			const { navigation } = this.props;
			navigation.navigate('Loading', {
				title: 'Loading',
			});
			console.log("SignOut");
		})
		.catch((error)=>{
			console.log("Error", error);
		});
	}

	closeDrawer = () => {
		this._drawer._root.close();
	}

	openDrawer = () => {
		this._drawer._root.open();
	}

  render() {
		const { navigation } = this.props;
    const title = navigation.getParam('title', 'Home');
    return (
			<Text>Home</Text>
    );
  }
}
