/* @flow */

import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
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
	Icon,
  Grid,
  Col,
  Row,
	Left,
	Right,
	Switch,
} from 'native-base';
import firebase from 'react-native-firebase';

export default class CreateChatroom extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
			header: null,
    };
	};

  constructor(props){
    super(props);
    const { navigation } = this.props;
    this.id = navigation.getParam('id', null);
		this.doc = navigation.getParam('doc', null);
    this.state = {
      name:'',
      status: false,
			refresh: false,
			selectedRoles: [],
			roles: [
				{id: 1, name: 'BPH'},
				{id: 2, name: 'Koordinator'},
				{id: 3, name: 'Koor Acara NPLC'},
				{id: 4, name: 'Koor Konsumsi Technocamp'}
			],
    }
  }

	valueChange = (value) => {
		this.setState({
			status: value,
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
      refresh: !this.state.refresh,
    });
	}

  createChatroom(name, status) {
    if(name!='') {
      this.chatroom.add({
        name: name,
        status: status,
      })
      .then(function (doc) {
        console.log("Doc", doc);
        // let name = doc.data.name;
        // let data = [];
        // data.push({
        //   data: doc.data(),
        //   id: doc.id,
        //   doc: doc,
        //   chatroom: doc.ref,
        // });
        // const { navigation } = this.props;
        // navigation.push("Chatroom", {
        //   title: name,
        //   data: data,
        // });
      })
      .catch(function (e){
        console.log(e);
      });
    }
  }

  render() {
    // console.log("Chatroom", this.chatroom);
    const { navigation } = this.props;
    return (
      <Container>
				<Header>
          <Left>
            <Button transparent onPress={()=>{this.props.navigation.goBack()}}>
              <Icon name='arrow-back' />
							<Text>Back</Text>
            </Button>
          </Left>
          <Body style={{flex: 3}}>
            <Text>Create Chatroom</Text>
          </Body>
          <Right>
            <Button
							transparent
							style={{width: 96}}
							onPress={()=>this.createChatroom(this.state.name, this.state.status)}>
              <Text>Create</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Chatroom Name</Label>
              <Input onChangeText={(name) => this.setState({name})}/>
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
										data={this.state.roles}
			              extraData={this.state.refresh}
										keyExtractor={item => ""+item.id}
										renderItem={({item}) =>
											<View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 8}}>
												<Text style={{color: '#757575'}}>{item.name}</Text>
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
