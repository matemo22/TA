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
  Switch
} from 'native-base';
import FirebaseSvc from '../../../assets/services/FirebaseSvc';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default class EditCategory extends Component {
  constructor(props){
    super(props);
    this.unsubscribeRole = null;
    this.item = this.props.navigation.getParam('item', []);
    this.state = {
      name:this.item.data.name,
      status: this.item.data.private ? true : false,
			refresh: false,
			selectedRoles: [],
      role: [],
      nameEdited: false,
      statusEdited: false,
      roleEdited: false,
    }
  }

  componentDidMount = async () => {
    this.unsubscribeRole = await FirebaseSvc
      .getRoleRef(this.item.data.gid)
      .onSnapshot(this.fetchRole);
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
      if(this.item.data.roles && this.item.data.roles.includes(doc.id)) {
        selectedRoles.push(doc.id);
      }
    });

    // this._storeChatroomsData(chatroom);

    this.setState({
      role: role,
      selectedRoles: selectedRoles,
      refresh: !this.state.refresh,
    });
  }

  valueChange = (value) => {
		this.setState({
			status: value,
      statusEdited: true,
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

  render() {
    return (
      <Container>
        <Header style={{borderBottomWidth: 0}}>
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
          <Body stle={{flex: 3}}>
          </Body>
          <Right>
            <Button
              disabled={!this.state.nameEdited && !this.state.roleEdited && !this.state.statusEdited}
              transparent
              onPress={()=>{this.saveEdit()}}>
              <Text>Save</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Category Name</Label>
              <Input onChangeText={(name) => {this.onChangeTextName(name)}} value={this.state.name}/>
            </Item>
						<View style={{borderBottomColor: '#F2F0F3', borderBottomWidth: 1}}>
							<View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 16}}>
								<Text style={{color: '#757575'}}>Private Category</Text>
								<Switch
									value={this.state.status}
									onValueChange={this.valueChange}
									trackColor={{true: '#298CFB'}}
								/>
							</View>
							<View style={{marginLeft: 16, marginTop: -6, marginBottom: 16}}>
								<Text note>By making a Category private, only selected roles will have access to this Category.</Text>
							</View>
						</View>
						{ this.state.status ?
							<View style={{margin: 16}}>
								<Text style={{textTransform: 'uppercase', fontSize: 12, color: '#757575'}}>Who can Access this Category?</Text>
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
