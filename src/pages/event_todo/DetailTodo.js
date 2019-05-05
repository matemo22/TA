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
  Picker,
  CheckBox
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
    this.group = this.props.navigation.getParam('group', {empty: true});
    this.item = this.props.navigation.getParam('item', {empty: true});
		this.category = this.props.navigation.getParam('category', []);
		this.todo = this.props.navigation.getParam('todo', []);
		console.log("Todo", this.todo);

    this.state = {
      name:this.todo.doc.title,
      reminder: this.todo.doc.reminder,
      roleStatus: this.todo.doc.roles.length!=0,
			refresh: false,
      isDateTimePickerVisible2: false,
			dateText2: '',
      hourText2: '',
      date2: this.todo.doc.time_reminder,
      todo: this.todo.doc.todo,
			selectedRoles: this.todo.doc.roles,
      selectedCategoryId: this.todo.doc.cid || '',
      selectedCategory: this.item || '',
      category: this.category,
      role: [],
      availableRole: [],
    }
  }

  componentDidMount = async () => {
		this._convert2(this.state.date2);
		var temp = this.state.todo;
		temp.push({title: "", completed: false,});
		this.setState({todo: temp});
    this.unsubscribeRole = await FirebaseSvc
      .getRoleRef(this.group.id)
      .onSnapshot(this.fetchRole);
  }

  componentWillUnmount = () => {
    this.unsubscribeRole();
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

  roleStatusChange = (value) => {
    var selectedRoles = this.state.selectedRoles;
    if(!value) {
      selectedRoles = [];
    }
		this.setState({
			roleStatus: value,
      selectedRoles: selectedRoles,
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
      refresh: !this.state.refresh,
    });
	}

  onChangeTextName = (name) => {this.setState({name});}
  onChangeTodo = (data) => {this.setState({data});}
	_showDateTimePicker2 = () => this.setState({ isDateTimePickerVisible2: true });
  _hideDateTimePicker2 = () => this.setState({ isDateTimePickerVisible2: false });

	_convert2 = (date) => {
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
      date2: date,
			dateText2: dateText,
			hourText2: hourText,
		});
	}

	_handleDatePicked2 = (date) => {
    this._hideDateTimePicker2();
		this._convert2(date);
  };

  updateTodo = () => {
    if(this.state.name!='' && this.state.todo.length!=0) {
      var todo = {
				id: this.todo.id,
        title: this.state.name,
        gid: this.group.id,
        cid: this.state.selectedCategory.id || '',
        roles: this.state.selectedRoles,
        todo: this.state.todo,
				reminder: this.state.reminder,
				time_reminder: this.state.date2,
				completed: !this.state.todo.some(t => t.completed === false),
      };
      FirebaseSvc.updateTodo(todo, this.updateSuccess());
    }
    else {
      alert("Title and List cannot be empty");
    }
  }

  updateSuccess = () => {
    Toast.show({
      text: "Update Todo Success!",
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

  checkItem = (item) => {
    let tmp = this.state.todo;
    if ( tmp.includes( item ) ) {
      var i = tmp.indexOf(item);
      tmp[i].completed = !tmp[i].completed;
    }
    this.setState({
      todo: tmp,
      refresh: !this.state.refresh,
    });
  }

	onChangeTextTodo = (item, text) => {
    let tmp = this.state.todo;
    if ( tmp.includes( item ) ) {
      var i = tmp.indexOf(item);
			if(i==tmp.length-1) {
				tmp.push({title: "", completed: false,});
			}
			if(text.length!=0) {
				tmp[i].title = text;
			}
			else {
				tmp.splice( i, 1 );
			}
    }
    this.setState({
      todo: tmp,
      refresh: !this.state.refresh,
    });
  }

	_renderTodo = ({item}) => {
    return (
      <ListItem>
				{
					item.title.length!=0
						?
							<CheckBox checked={item.completed} onPress={()=>{this.checkItem(item)}}/>
						:
						<View></View>
				}
        <Left>
					<Input
						value={item.title}
						placeholder="Input Todo"
						style={ item.completed ?
							{color: "#777777"} : {}
						}
						onChangeText={(text)=>{this.onChangeTextTodo(item, text)}}/>
        </Left>
        <Right>
					{
						item.title.length != 0 ?
							<Icon name="close"
								onPress={() => {this.removeTodo(item)}}/>
						:
						<View></View>
					}

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
        <Header androidStatusBarColor="#1C75BC" style={{backgroundColor: "#1C75BC", borderBottomWidth: 0}}>
          <Left>
            <Button transparent>
              <Icon
                style={{marginLeft: 10}}
                name={"left"}
                size={25}
                color="#FFFFFF"
                onPress={()=>{this.props.navigation.goBack()}}
              />
            </Button>
          </Left>
          <Body stle={{flex: 3}}>
            <Text style={{color: "#FFFFFF"}}>Detail Todo</Text>
          </Body>
          <Right>
            <Button
              transparent
              onPress={()=>{this.updateTodo()}}>
              <Text style={{color: "#FFFFFF"}}>Save</Text>
            </Button>
          </Right>
        </Header>
        <Content bounces={false}>
          <Form>
            <Item floatingLabel>
              <Label>Todo Title</Label>
              <Input onChangeText={(name) => {this.onChangeTextName(name)}} value={this.state.name}/>
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
								<View>
								</View>
                }
              </View>
            </View>
            <View style={{margin: 16, borderBottomColor: '#F2F0F3', borderBottomWidth: 1, paddingBottom: 16}}>
              <Text style={{color: '#757575'}}>Select Category</Text>
              <Picker
                iosIcon={<MaterialIcon name="arrow-drop-down" color="#757575"/>}
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
							<View>
								<Item floatingLabel onPress={this._showDateTimePicker2}>
									<Label onPress={this._showDateTimePicker2}>Remind Me At</Label>
									<Input disabled value={this.state.dateText2+" "+this.state.hourText2} onPress={this._showDateTimePicker2}/>
								</Item>
								<View style={{marginTop: 16, marginLeft: 16, marginRight: 16, borderBottomColor: '#F2F0F3', borderBottomWidth: 1, paddingBottom: 16}}>
									<Text style={{color: '#298CFB'}}
										onPress={this._showDateTimePicker2}>Select Date</Text>
								</View>
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
	          isVisible={this.state.isDateTimePickerVisible2}
	          onConfirm={this._handleDatePicked2}
	          onCancel={this._hideDateTimePicker2}
						mode="datetime"
						maximumDate={this.state.date}
	        />
        </Content>
      </Container>
    );
  }
}
