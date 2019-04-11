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
  Icon,
} from 'native-base';
import { ImageEditor, } from 'react-native';
import FirebaseSvc from '../assets/services/FirebaseSvc';
import ImagePicker from 'react-native-image-picker';
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

  returnData() {
    this.props.navigation.state.params.returnData();
    this.props.navigation.goBack();
  }

  onPressSave = async () => {
		if(this.state.name!='') {
			let group = {
				name: this.state.name,
			}
			await FirebaseSvc.createGroup(group, this.state.avatar);
			this.returnData();
		}
		else {
			alert("Please Input Group Name");
		}
	}

	successUpdate = () => {
		console.log("User Info Updated");
		// this.props.navigation.navigate("AppDrawerNavigator");
	}

  onChangeTextName = (name) => {this.setState({name});}

  handleChoosePhoto = () => {
		const options = {
			noData: true,
		};
		ImagePicker.launchImageLibrary(options, response => {
			if(response.uri) {
				// let uploadUrl = FirebaseSvc.uploadAvatar(response);
				this.setState({ avatar: response });
			}
		});
	}

  render() {
    const noImg = <MaterialIcon name="account-circle" size={80} />;
		const img = <Thumbnail large source={{uri: this.state.avatar.uri}} />;
    return (
      <Container>
				<Header>
					<Left>
            <Button transparent onPress={()=>{this.props.navigation.goBack()}}>
              <Icon name="arrow-back"/>
              <Text>Back</Text>
            </Button>
					</Left>
					<Body>
						<Text>New Group</Text>
					</Body>
					<Right>
						<Button transparent onPress={()=>{this.onPressSave()}}>
							<Text>Save</Text>
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
