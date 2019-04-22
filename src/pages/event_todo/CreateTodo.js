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
  Textarea,
  Picker
} from 'native-base';
import FirebaseSvc from '../../assets/services/FirebaseSvc';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import { Col, Row, Grid } from "react-native-easy-grid";

export default class CreateEvent extends Component {
  constructor(props){
    super(props);
    this.unsubscribeRole = null;
		this.item = this.props.navigation.getParam('item', {empty: true});
    // console.log("Item", this.item);

    this.state = {
      name:'',
      data:'',
      roleStatus: false,
			refresh: false,
      todo: [],
			selectedRoles: [],
      selectedTime: '',
      selectedGroup: '',
      selectedChatroom: '',
      role: [],
      group: [],
      chatroom: [],
      nameEdited: false,
      statusEdited: false,
      roleEdited: false,
    }
  }

  componentDidMount = async () => {
    this._convert(new Date());
    this.unsubscribeRole = await FirebaseSvc
      .getRoleRef(this.item.data.gid)
      .onSnapshot(this.fetchRole);
  }

  componentWillUnmount = () => {
    this.unsubscribeRole();
  }

  fetchRole = (querySnapshot) => {
    let role = [];
    let availableRole = [];
    let selectedRoles = [];
    let exist = (this.item.data.roles.length != 0);
    querySnapshot.forEach( (doc) => {
      if(exist && this.item.data.roles.includes(doc.id)) {
        availableRole.push({
          doc: doc,
          data: doc.data(),
          id: doc.id,
        });
      }
      role.push({
        doc: doc,
        data: doc.data(),
        id: doc.id,
      });
    });
    this.setState({
      role: exist ? availableRole : role,
      selectedRoles: selectedRoles,
      refresh: !this.state.refresh,
    });
  }

  reminderChange = (value) => {
    var selectedTime = this.state.selectedTime;
    if(!value) {
      selectedTime = '';
    }
		this.setState({
			reminder: value,
      selectedTime: selectedTime,
		});
	}

  roleStatusChange = (value) => {
    var selectedRoles = this.state.selectedRoles;
    if(!value) {
      selectedRoles = [];
    }
		this.setState({
			roleStatus: value,
      statusEdited: true,
      selectedRoles: selectedRoles,
		});
	}

  onPickerReminderChange = (value: string) => {
    this.setState({
      selectedTime: value,
    });
  }

  onPickerGroupChange = (value: string) => {
    this.setState({
      selectedGroup: value,
    });
  }

  onPickerChatroomChange = (value: string) => {
    this.setState({
      selectedChatroom: value,
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
  onChangeTodo = (data) => {this.setState({data});}
  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _convert = (date) => {
    var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];
    var day = date.getDate();
    var month_index = date.getMonth();
    var year = date.getFullYear();
    var dateText = day + "-" + month_names[month_index] + "-" + year;

		var hours = date.getHours();
		var minutes = date.getMinutes();
		var minute = "";
		var hour = "";
		if(hours<10) hour="0"+hours;
		else hour = hours;
		if(minutes<10) minute="0"+minutes;
		else minute = minutes;
		var hourText = hour+":"+minute;
		this.setState({
			dateText: dateText,
			hourText: hourText,
		});
	}

  _handleDatePicked = (date) => {
    this._hideDateTimePicker();
		this.setState({
			date: date,
		});
		this._convert(date);
  };

  createTodo = () => {
    if(this.state.name!='' && this.state.todo.length!=0) {
      var todo = {
        title: this.state.name,
        gid: this.item.data.gid,
        cid: this.item.id || '',
        roles: this.state.selectedRoles,
        todo: this.state.todo,
      };
      FirebaseSvc.createTodo(todo, this.createSuccess());
    }
    else {
      alert("Title and List cannot be empty");
    }
  }

  createSuccess = () => {
    Toast.show({
      text: "Create Todo Success!",
      buttonText: "Okay!",
      duration: 2000,
    });
    this.props.navigation.goBack();
  }

  removeTodo = (item) => {
    let tmp = this.state.todo;
    if ( tmp.includes( item ) ) {
      tmp.splice( tmp.indexOf(item), 1 );
    }
    this.setState({
      todo: tmp,
      refresh: !this.state.refresh,
    });
  }

  addTodo = () => {
    if(this.state.data != '') {
      var list = this.state.todo;
      var data = {
        title: this.state.data,
        completed: false,
      };
      list.push(data);
      this.setState({
        todo: list,
        data: '',
        refresh: !this.state.refresh,
      });
    }
    else {
      alert("Input Todo cannot be empty");
    }
  }

  _renderTodo = ({item}) => {
    return (
      <ListItem>
        <Left>
          <Text>{item.title}</Text>
        </Left>
        <Right>
          <Icon name="close"
            onPress={() => {this.removeTodo(item)}}/>
        </Right>
      </ListItem>
    )
  }

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
            <Text>Create Todo</Text>
          </Body>
          <Right>
            <Button
              disabled={!this.state.nameEdited && !this.state.roleEdited && !this.state.statusEdited}
              transparent
              onPress={()=>{this.createTodo()}}>
              <Text>Save</Text>
            </Button>
          </Right>
        </Header>
        <Content bounces={false}>
          <Form>
            <Item floatingLabel>
              <Label>Todo Title</Label>
              <Input onChangeText={(name) => {this.onChangeTextName(name)}} />
            </Item>
            <View style={{marginTop: 16, borderBottomColor: '#F2F0F3', borderBottomWidth: 1}}>
              <View style={{marginLeft: 16, marginRight: 16, marginBottom: 16}}>
                <Text style={{color: '#757575'}}>List Todo</Text>
                {this.state.todo.length != 0 ?
                  <FlatList
                    data={this.state.todo}
                    extraData={this.state.refresh}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this._renderTodo}
                  />
                  :
                  <ListItem>
                    <Text note>Empty todo</Text>
                  </ListItem>
                }
              </View>
            </View>

            <View style={{flexDirection: 'row', borderBottomColor: '#F2F0F3', borderBottomWidth: 1}}>
              <Item style={{marginLeft: 11, width: "80%", borderBottomColor: 'transparent'}}>
                <Input onChangeText={(data)=>{this.onChangeTodo(data)}}
                  value={this.state.data}
                  placeholder="Input Todo"
                  placeholderTextColor="#F2F0F3" />
              </Item>
              <Button
                transparent
                onPress={()=>{this.addTodo()}}
                style={{marginTop: 5, marginRight: 15}}>
                <Text>Add</Text>
              </Button>
            </View>
            { this.item && !this.item.empty ?
              <View>
                <View style={{marginTop: 16, borderBottomColor: '#F2F0F3', borderBottomWidth: 1}}>
    							<View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 16, marginRight: 16, marginBottom: 16}}>
    								<Text style={{color: '#757575'}}>ROLE</Text>
    								<Switch
    									value={this.state.roleStatus}
    									onValueChange={this.roleStatusChange}
    									trackColor={{true: '#298CFB'}}
    								/>
    							</View>
    							<View style={{marginLeft: 16, marginTop: -6, marginBottom: 16}}>
    								<Text note>Only Selected Roles can see this Todos</Text>
    							</View>
    						</View>
    						{ this.state.roleStatus ?
    							<View style={{margin: 16}}>
    								<Text
                      style={{textTransform: 'uppercase', fontSize: 12, color: '#757575'}}>
                      Who can see this Todos?
                    </Text>
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
    							:
    							<View></View>
    						}
              </View>
              :
              <View></View>
            }
          </Form>
          <DateTimePicker
	          isVisible={this.state.isDateTimePickerVisible}
	          onConfirm={this._handleDatePicked}
	          onCancel={this._hideDateTimePicker}
						mode="datetime"
	        />
        </Content>
      </Container>
    );
  }
}
