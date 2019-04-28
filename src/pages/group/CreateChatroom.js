/* @flow */

import React, { Component } from 'react';
import { View, AsyncStorage, FlatList } from 'react-native';
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
  List,
  ListItem,
  Thumbnail,
  Drawer,
  Switch,
  Toast,
} from 'native-base';
import FirebaseSvc from '../../assets/services/FirebaseSvc';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default class CreateChatroom extends Component {
  constructor(props){
    super(props);
    this.unsubscribeRole = null;
    this.group = null;
		this.item = null;
    // console.log("Item", this.item);

    this.state = {
      name:'',
      status: false,
			refresh: false,
			selectedRoles: [],
      role: [],
      nameEdited: false,
      statusEdited: false,
      roleEdited: false,
    }
  }

  componentDidMount = async () => {
    this.group = this.props.navigation.getParam('group', []);
		this.item = this.props.navigation.getParam('item', []);
    this.unsubscribeRole = await FirebaseSvc
      .getRoleRef(this.group.id)
      .onSnapshot(this.fetchRole);
  }

  componentWillUnmount = () => {
    this.unsubscribeRole();
  }

  fetchRole = (querySnapshot) => {
    let role = [];
    let selectedRoles = [];
    querySnapshot.forEach( (doc) => {
      role.push({
        doc: doc,
        data: doc.data(),
        id: doc.id,
      });
    });
    this.setState({
      role: role,
      selectedRoles: selectedRoles,
      refresh: !this.state.refresh,
    });
  }

  valueChange = (value) => {
    var selectedRoles = this.state.selectedRoles;
    if(!value) {
      selectedRoles = [];
    }
		this.setState({
			status: value,
      statusEdited: true,
      selectedRoles: selectedRoles,
		});
	}

	onSwitchRolesPress(id) {
		let tmp = this.state.selectedRoles;

    if ( tmp.includes( id ) ) {
      tmp.splice( tmp.indexOf(id), 1 );
    } else {
      tmp.push( id );
    }

    this.setState({
      selectedRoles: tmp,
      roleEdited: true,
      refresh: !this.state.refresh,
    });
	}

  onChangeTextName = (name) => {this.setState({name, nameEdited: true});}

  createChatroom = () => {
    var chatroom = {
      name: this.state.name,
      gid: this.group.id,
      private: this.state.status,
      roles: this.state.selectedRoles,
      cid: this.item.id,
    };

    FirebaseSvc.createChatroom(chatroom, this.createSuccess());
  }

  createSuccess = () => {
    this.setState({
      name:'',
      status: false,
			refresh: false,
			selectedRoles: [],
      role: [],
      nameEdited: false,
      statusEdited: false,
      roleEdited: false,
    });
    Toast.show({
      text: "Create "+this.item.title+"'s Chatroom Success!",
      buttonText: "Okay!",
      duration: 2000,
    });
    this.item = null;
    this.group = null;
    this.props.navigation.goBack();
  }

  render() {
    return (
      <Container>
        <Header style={{backgroundColor: "#F8F8F8", borderBottomWidth: 0}}>
          <Left>
            <Button transparent>
              <Icon
                style={{marginLeft: 10}}
                name={"left"}
                size={25}
                color="#777777"
                onPress={()=>{this.props.navigation.goBack()}}
              />
            </Button>
          </Left>
          <Body stle={{flex: 3}}></Body>
          <Right>
            <Button
              disabled={!this.state.nameEdited && !this.state.roleEdited && !this.state.statusEdited}
              transparent
              onPress={()=>{this.createChatroom()}}>
              <Text>Save</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <ListItem noIndent style={{backgroundColor: "#F8F8F8"}}>
            <Text>{this.item ? this.item.title+"'s Chatroom" : "Category's Chatroom"}</Text>
          </ListItem>
          <Form>
            <Item floatingLabel>
              <Label>Chatroom Name</Label>
              <Input onChangeText={(name) => {this.onChangeTextName(name)}} />
            </Item>
						<View style={{borderBottomColor: '#F2F0F3', borderBottomWidth: 1}}>
							<View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 16}}>
								<Text style={{color: '#757575'}}>Private Chatroom</Text>
								<Switch
									value={this.state.status}
									onValueChange={this.valueChange}
									trackColor={{true: '#298CFB'}}
								/>
							</View>
							<View style={{marginLeft: 16, marginTop: -6, marginBottom: 16}}>
								<Text note>By making a Chatroom private, only selected roles will have access to this Chatroom.</Text>
							</View>
						</View>
						{ this.state.status ?
							<View style={{margin: 16}}>
								<Text style={{textTransform: 'uppercase', fontSize: 12, color: '#757575'}}>Who can Access this Chatroom?</Text>
								<View style={{marginTop: 10}}>
									<FlatList
										data={this.state.role}
			              extraData={this.state.refresh}
										keyExtractor={item => ""+item.id}
										renderItem={({item}) =>
											<View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 8}}>
												<Text style={{color: '#757575'}}>{item.data.name}</Text>
												<Switch
													value={this.state.selectedRoles.includes(item.id) ? true : false}
													trackColor={{true: '#298CFB'}}
													onValueChange={()=>this.onSwitchRolesPress(item.id)}
												/>
											</View>
										}
									/>
								</View>
							</View>
							:
							<View></View>
						}
          </Form>
        </Content>
      </Container>
    );
  }
}
