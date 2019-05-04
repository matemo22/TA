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
  Toast,
  ActionSheet,
	Fab,
} from 'native-base';
import FirebaseSvc from '../../../assets/services/FirebaseSvc';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AllFiles from './AllFiles';
import Media from './Media';
import Files from './Files';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';

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

	selectFile = () => {
		DocumentPicker.show({
			filetype: [DocumentPickerUtil.allFiles()],
		},(error,res) => {
			if(res) {
				FirebaseSvc.uploadFile(res, this.group, this.uploadSuccess());
			}
			if(error) {
				console.log("Error", error);
			}
		});
	}

	uploadSuccess = () => {
		Toast.show({
      text: "Upload Success!",
      buttonText: "Okay!",
      duration: 2000,
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
							onPress={()=>{this.selectFile()}}>
							Add
						</Text>
					</Right>
        </Header>
				<Tabs locked>
          <Tab heading="All Files" tabStyle={{backgroundColor: "#1C75BC"}} textStyle={{color: "#9FBBF7"}} activeTabStyle={{backgroundColor: "#1C75BC"}} activeTextStyle={{color: "#FFFFFF"}}>
            <AllFiles group={this.group} />
          </Tab>
          <Tab heading="Media" tabStyle={{backgroundColor: "#1C75BC"}} textStyle={{color: "#9FBBF7"}} activeTabStyle={{backgroundColor: "#1C75BC"}} activeTextStyle={{color: "#FFFFFF"}}>
            <Media group={this.group} />
          </Tab>
          <Tab heading="Files" tabStyle={{backgroundColor: "#1C75BC"}} textStyle={{color: "#9FBBF7"}} activeTabStyle={{backgroundColor: "#1C75BC"}} activeTextStyle={{color: "#FFFFFF"}}>
            <Files group={this.group} />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
