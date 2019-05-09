/* @flow */

import React, { Component } from 'react';
import {
	Platform,
	View,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	NativeAppEventEmitter,
	DeviceEventEmitter,
	NativeModules,
	NativeEventEmitter,
} from 'react-native';
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
import OpenFile from 'react-native-doc-viewer';

export default class Media extends Component {
	constructor(props) {
	  super(props);
		this.unsubscribeFile = null;
		this.group = this.props.group;

	  this.state = {
			files: [],
			refresh: false,
			animating: false,
			progress: "",
			donebuttonclicked: false,
		};
		this.eventEmitter = new NativeEventEmitter(NativeModules.RNReactNativeDocViewer);
		this.eventEmitter.addListener('DoneButtonEvent', (data) => {
			console.log(data.close);
			this.setState({donebuttonclicked: data.close});
		});
	}

	componentDidMount = async () => {
		this.unsubscribeFile = await FirebaseSvc
      .getStorageRef(this.group.id)
      .onSnapshot(this.fetchFile);
		this.eventEmitter.addListener('RNDownloaderProgress', (Event) => {
        console.log("Progress - Download "+Event.progress  + " %")
        this.setState({progress: Event.progress + " %"});
      }
    );
	}

	componentWillUnmount = () => {
		this.unsubscribeFile();
		this.eventEmitter.removeListener();
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

	handlePress = (item, type) => {
    this.setState({animating: true});
    if(Platform.OS === 'ios'){
      OpenFile.openDoc([{
        url:item.data.fileUrl,
        fileNameOptional:item.data.fileName,
				fileType: type,
      }], (error, url) => {
         if (error) {
					 this.setState({animating: false});
         }
				 else {
					 this.setState({animating: false});
           console.log(url)
         }
       })
    }
		else {
      //Android
      this.setState({animating: true});
      OpenFile.openDoc([{
        url:item.data.fileUrl,
        fileName:item.data.fileName,
        cache:false,
				fileType: type
      }], (error, url) => {
         if (error) {
					 this.setState({animating: false});
           console.error(error);
         }
				 else {
					 this.setState({animating: false});
           console.log(url)
         }
       })
    }
  }

	_renderFiles = ({item}) => {
    let temp = [];
		let img = [];
		let type = item.data.fileType.split('/');
		if(type[0]=="image") {
			fileType = type[1];
			img.push(
				<MaterialCommunityIcon size={20} name="file-image" key={item.id}/>
			);
		}
		else if(type[0]=="video") {
			fileType = type[1];
			img.push(
				<MaterialCommunityIcon size={20} name="file-video" key={item.id}/>
			)
		}
		else if(type[0]=="audio") {
			fileType = type[1];
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
			<SwipeRow
				leftOpenValue={75}
				rightOpenValue={-75}
				key={item.id}
				body={
					<TouchableOpacity onPress={()=>{this.handlePress(item, fileType)}} style={{flexDirection: 'row', borderWidth: 0}}>
						<View style={{marginLeft: 15}}>
							{img}
						</View>
						<Text style={{marginLeft: 5}}>{item.data.fileName}</Text>
					</TouchableOpacity>
				}
				right={
					<Button danger onPress={() => {this.deleteFile(item)}}>
						<Icon name="delete" size={20} color="#FFFFFF" />
					</Button>
				}
			/>
    )
    return (
      temp
    )
  }

	deleteFile = (item) => {
		var file = {
			fileName: item.data.fileName,
			gid: this.group.id,
			id: item.id,
		}
		FirebaseSvc.deleteFile(file, this.deleteSuccess());
	}

	deleteSuccess = () => {
		Toast.show({
      text: "Delete Success!",
      buttonText: "Okay!",
      duration: 2000,
    });
	}

	deleteFailed = () => {
		Toast.show({
      text: "Delete Failed!",
      buttonText: "Okay!",
      duration: 2000,
			type: "danger",
    });
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
