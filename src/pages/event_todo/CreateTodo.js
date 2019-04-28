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
    this.unsubscribeCategory = null;
    this.group = this.props.navigation.getParam('group', {empty: true});
    this.item = this.props.navigation.getParam('item', {empty: true});

    this.state = {
      name:'',
      data:'',
      reminder: false,
      roleStatus: false,
			refresh: false,
      isDateTimePickerVisible: false,
      dateText: '',
      hourText: '',
      date: '',
      todo: [],
			selectedRoles: [],
      selectedTime: '',
      selectedCategoryId: this.item.id || '',
      selectedCategory: this.item || '',
      selectedGroup: '',
      selectedChatroom: '',
      category: [],
      role: [],
      availableRole: [],
      nameEdited: false,
      statusEdited: false,
      roleEdited: false,
    }
  }

  componentDidMount = async () => {
    this._convert(new Date());
    this.unsubscribeCategory = await FirebaseSvc
      .getCategoryRef(this.group.id)
      .onSnapshot(this.fetchCategory);
    this.unsubscribeRole = await FirebaseSvc
      .getRoleRef(this.group.id)
      .onSnapshot(this.fetchRole);
  }

  componentWillUnmount = () => {
    this.unsubscribeRole();
    this.unsubscribeCategory();
  }

  fetchCategory = (querySnapshot) => {
    let category = [];
    querySnapshot.forEach( (doc) => {
      category.push({
        doc: doc,
        data: doc.data(),
        id: doc.id,
        title: doc.data().name,
      });
    });
    this.setState({
      category: category,
      refresh: !this.state.refresh,
    });
  }

  fetchRole = (querySnapshot) => {
    let role = [];
    let availableRole = [];
    let item = this.state.selectedCategory;
    let exist = false;
    if(item.empty) {
      exist = false;
    }
    else {
      exist = (this.state.selectedCategory.data.roles.length != 0);
    }
    querySnapshot.forEach( (doc) => {
      if(exist && item.data.roles.includes(doc.id)) {
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
      role: role,
      availableRole: exist ? availableRole : role,
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

  onPickerCategoryChange = (id) => {
    let value = this.state.category.find(item => item.id === id);
    if(!value) {
      value = {empty: true};
    }
    let availableRole = [];
    let role = [];
    let exist = false;
    if(value.empty) {
      exist = false;
    }
    else {
      exist = (value.data.roles.length != 0);
    }
    for (var i = 0; i < this.state.role.length; i++) {
      if(exist && value.data.roles.includes(this.state.role[i].id)) {
        availableRole.push(this.state.role[i]);
      }
      role.push(this.state.role[i]);
    }
    this.setState({
      selectedCategory: value,
      selectedCategoryId: id,
      availableRole: exist ? availableRole : role,
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
      date: date,
			dateText: dateText,
			hourText: hourText,
		});
	}

  _handleDatePicked = (date) => {
    this._hideDateTimePicker();
		this._convert(date);
  };

  createTodo = () => {
    if(this.state.name!='' && this.state.todo.length!=0) {
      var todo = {
        title: this.state.name,
        gid: this.group.id,
        cid: this.state.selectedCategory.id || '',
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

  renderRole = ({item}) => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 8}}>
        <Text style={{color: '#757575'}}>{item.data.name}</Text>
        <Switch
          value={this.state.selectedRoles.includes(item.id) ? true : false}
          trackColor={{true: '#298CFB'}}
          onValueChange={()=>this.onSwitchRolesPress(item.id)}
        />
      </View>
    )
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
            <View style={{margin: 16, borderBottomColor: '#F2F0F3', borderBottomWidth: 1, paddingBottom: 16}}>
              <Text style={{color: '#757575'}}>Select Category</Text>
              <Picker
                iosIcon={<Icon name="down-square-o" color="#757575"/>}
                mode="dropdown"
                placeholder="Uncategorized"
                textStyle={{ color: "#757575", fontSize: 12 }}
                selectedValue={this.state.selectedCategoryId}
                onValueChange={this.onPickerCategoryChange.bind(this)}>
                <Picker.Item label="Uncategorized" value={{empty: true}} />
                {this.state.category.map(item => (
                  <Picker.Item key={item.id} label={item.data.name} value={item.id} />
                ))}
              </Picker>
            </View>
            <View style={{ borderBottomColor: '#F2F0F3', borderBottomWidth: 1}}>
							<View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 16, marginRight: 16, marginBottom: 16}}>
								<Text style={{color: '#757575'}}>REMINDER</Text>
								<Switch
									value={this.state.reminder}
									onValueChange={this.reminderChange}
									trackColor={{true: '#298CFB'}}
								/>
							</View>
							<View style={{marginLeft: 16, marginTop: -6, marginBottom: 16}}>
								<Text note>If Active, You will get Notification about this Todos.</Text>
							</View>
						</View>
						{ this.state.reminder ?
							<View style={{margin: 16, borderBottomWidth: 1, borderBottomColor: '#F2F0F3'}}>
								<Text
                  style={{textTransform: 'uppercase', fontSize: 12, color: '#757575'}}>
                  Set Time to get Reminder
                </Text>
                <Picker
                  iosIcon={<Icon name="down-square-o" color="#757575"/>}
                  mode="dropdown"
                  placeholder="Remind me"
                  textStyle={{ color: "#757575", fontSize: 12 }}
                  selectedValue={this.state.selectedTime}
                  onValueChange={this.onPickerReminderChange.bind(this)}>
                  <Picker.Item label="5 mins before event" value="5" />
                  <Picker.Item label="10 mins before event" value="10" />
                  <Picker.Item label="1 hour before event" value="60" />
                  <Picker.Item label="2 hours before event" value="120" />
                  <Picker.Item label="12 hours before event" value="720" />
                  <Picker.Item label="1 day before event" value="1440" />
                </Picker>
							</View>
							:
							<View></View>
						}
            { this.group && !this.group.empty ?
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
  										data={this.state.availableRole}
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
