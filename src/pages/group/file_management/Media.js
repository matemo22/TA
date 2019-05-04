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
import FirebaseSvc from '../../../assets/services/FirebaseSvc';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class Media extends Component {
	constructor(props) {
	  super(props);
		this.unsubscribeFile = null;
		this.group = this.props.group;

	  this.state = {
			files: [],
			refresh: false,
		};
	}

	componentDidMount = async () => {
		this.unsubscribeFile = await FirebaseSvc
      .getStorageRef(this.group.id)
      .onSnapshot(this.fetchFile);
	}

	componentWillUnmount = () => {
		this.unsubscribeFile();
	}

	fetchFile = (querySnapshot) => {
    let files = [];
    querySnapshot.forEach( (doc) => {
			let type = doc.data().fileType.split('/');
			if(type[0]=="image" || type[0]=="video" || type[0]=="audio") {
				files.push({
	        doc: doc,
	        data: doc.data(),
	        id: doc.id,
	      });
			}
    });
    this.setState({
      files: files,
      refresh: !this.state.refresh,
    });
  }

	_renderFiles = ({item}) => {
    let temp = [];
		let img = [];
		let type = item.data.fileType.split('/');
		if(type[0]=="image") {
			img.push(
				<MaterialCommunityIcon size={20} name="file-image" key={item.id}/>
			);
		}
		else if(type[0]=="video") {
			img.push(
				<MaterialCommunityIcon size={20} name="file-video" key={item.id}/>
			)
		}
		else if(type[0]=="audio") {
			img.push(
				<MaterialCommunityIcon size={20} name="file-music" key={item.id}/>
			)
		}
		else {
			img.push(
				<MaterialCommunityIcon size={20} name="file" key={item.id}/>
			)
		}
    temp.push(
      <ListItem key={item.id}>
				{img}
        <Text style={{marginLeft: 5}}>{item.data.fileName}</Text>
      </ListItem>
    )
    return (
      temp
    )
  }

  render() {
    return (
      <Container>
        <Content bounces={false}>
					<FlatList
						data={this.state.files}
						extraData={this.state.refresh}
						renderItem={this._renderFiles}
						keyExtractor={(item, index) => item.id}
					/>
        </Content>
      </Container>
    );
  }
}
