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
import AllFiles from './AllFiles';
import Images from './Images';
import Files from './Files';

export default class FileManagement extends Component {
	constructor(props) {
	  super(props);
		this.unsubscribeFile = null;
		this.group = this.props.navigation.getParam("group", []);

	  this.state = {
			files: [],
			refresh: false,
		};
	}

	showActionSheet = (item = {empty: true}) => {
    var BUTTONS = ["Photo", "File", "Cancel"];
    var CANCEL_INDEX = BUTTONS.length-1;
    ActionSheet.show(
    {
      options: BUTTONS,
      cancelButtonIndex: CANCEL_INDEX,
    },
    (buttonIndex) => {
      if(buttonIndex == 0) {
        //image
				console.log("Image");
      }
      else if(buttonIndex == 1) {
       //files
			 console.log("Files");
      }
    });
  }

  render() {
    return (
      <Container>
				<Header hasTabs androidStatusBarColor="#1C75BC" style={{backgroundColor: "#1C75BC", borderBottomWidth: 0}}>
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
            <Text style={{color: "#FFFFFF"}}>{this.group.data.name}'s Files</Text>
          </Body>
          <Right>
						<Text
							style={{color: "#FFFFFF"}}
							onPress={()=>{this.showActionSheet()}}>
							Add
						</Text>
					</Right>
        </Header>
				<Tabs>
          <Tab heading="All Files" tabStyle={{backgroundColor: "#1C75BC"}} activeTabStyle={{backgroundColor: "#1C75BC"}}>
            <AllFiles />
          </Tab>
          <Tab heading="Images" tabStyle={{backgroundColor: "#1C75BC"}} activeTabStyle={{backgroundColor: "#1C75BC"}}>
            <Images />
          </Tab>
          <Tab heading="Files" tabStyle={{backgroundColor: "#1C75BC"}} activeTabStyle={{backgroundColor: "#1C75BC"}}>
            <Files />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
