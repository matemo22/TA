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
	SwipeRow,
  Drawer,
  Toast,
  ActionSheet,
	Fab,
} from 'native-base';
import FirebaseSvc from '../../../assets/services/FirebaseSvc';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class AllFiles extends Component {
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
      files.push({
        doc: doc,
        data: doc.data(),
        id: doc.id,
      });
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
		else if(type[0]=="application") {
			if(type[1]=="msword" || type[1]=="vnd.openxmlformats-officedocument.wordprocessingml.document") {
				img.push(
					<MaterialCommunityIcon size={20} name="file-word-box" key={item.id}/>
				)
			}
			else if(type[1]=="vnd.ms-excel" || type[1]=="vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
				img.push(
					<MaterialCommunityIcon size={20} name="file-excel-box" key={item.id}/>
				)
			}
			else if(type[1]=="vnd.ms-powerpoint" || type[1]=="vnd.openxmlformats-officedocument.presentationml.presentation") {
				img.push(
					<MaterialCommunityIcon size={20} name="file-powerpoint-box" key={item.id}/>
				)
			}
			else if(type[1]=="pdf") {
				img.push(
					<MaterialCommunityIcon size={20} name="file-pdf-box" key={item.id}/>
				)
			}
			else {
				img.push(
					<MaterialCommunityIcon size={20} name="file" key={item.id}/>
				)
			}
		}
		else {
			img.push(
				<MaterialCommunityIcon size={20} name="file" key={item.id}/>
			)
		}
    temp.push(
			<SwipeRow
				leftOpenValue={75}
				rightOpenValue={-75}
				key={item.id}
				body={
					<View style={{flexDirection: 'row', borderWidth: 0}}>
						<View style={{marginLeft: 15}}>
							{img}
						</View>
						<Text style={{marginLeft: 5}}>{item.data.fileName}</Text>
					</View>
				}
				right={
					<Button danger onPress={() => alert('Delete item')}>
						<Icon name="delete" size={20} color="#FFFFFF" />
					</Button>
				}
			/>
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
