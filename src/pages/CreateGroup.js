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
	Thumbnail,
	Toast,
} from 'native-base';
import FirebaseSvc from '../assets/services/FirebaseSvc';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default class CreateGroup extends Component {
  constructor(props){
    super(props);
    this.state = {
			name: '',
			avatar: '',
      selectedGroup: '',
		};
  }

  onPressCreate = async () => {
		if(this.state.name!='') {
			let group = {
				name: this.state.name,
			}
			await FirebaseSvc.createGroup(group, this.state.avatar, this.createSuccess());
		}
		else {
			alert("Please Input Group Name");
		}
	}

	createSuccess = () => {
		Toast.show({
      text: 'Create Group Success!',
      buttonText: 'Okay!',
			duration: 2000,
    });
		this.props.navigation.goBack();
	}

  onChangeTextName = (name) => {this.setState({name});}

  handleChoosePhoto = () => {
		DocumentPicker.show({
			filetype: [DocumentPickerUtil.images()],
		},(error,res) => {
			if(res) {
				this.setState({avatar: res})
			}
			if(error) {
				console.log("Error", error);
			}
		});
	}

  render() {
    const noImg = <MaterialIcon name="account-circle" size={80} />;
		const img = <Thumbnail large source={{uri: this.state.avatar.uri}} />;
    return (
      <Container>
				<Header style={{backgroundColor: "#1C75BC"}}>
					<Left>
            <Button transparent onPress={()=>{this.props.navigation.goBack()}}>
							<Icon
								style={{marginLeft: 10}}
								name={"left"}
								size={25}
								color="#FFFFFF"
								onPress={()=>{this.props.navigation.goBack()}}
							/>
            </Button>
					</Left>
					<Body>
						<Text style={{color: "#FFFFFF"}}>New Group</Text>
					</Body>
					<Right>
						<Button transparent onPress={()=>{this.onPressCreate()}}>
							<Text style={{color: "#FFFFFF"}}>Create</Text>
						</Button>
					</Right>
				</Header>
        <Content>
					<Form style={{justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
            {(this.state.avatar!='') ? img : noImg}
						<Text onPress={this.handleChoosePhoto} style={{color: "#298CFB", marginTop: 10}}>Select Avatar</Text>
						<Item floatingLabel>
              <Label>Group Name</Label>
              <Input onChangeText={(name)=>{this.onChangeTextName(name)}}/>
            </Item>
          </Form>
        </Content>
      </Container>
    );
  }
}
