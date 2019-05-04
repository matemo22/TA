/* @flow */

import React, { Component } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
  Container,
	Header,
	Title,
	Content,
	Footer,
	FooterTab,
	Tab,
	Tabs,
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
  ActionSheet,
	Fab,
} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default class FileManagement extends Component {
	constructor(props) {
	  super(props);
		this.unsubscribeFile = null;

	  this.state = {
			files: [],
			refresh: false,
		};
	}

  render() {
    return (
      <Container>
        <Content bounces={false}>
					<Text>All Files</Text>
        </Content>
      </Container>
    );
  }
}
