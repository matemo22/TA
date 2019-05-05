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

export default class DetailEvent extends Component {
  constructor(props){
    super(props);
    this.unsubscribeRole = null;
		this.group = this.props.navigation.getParam('group', {empty: true});
    this.item = this.props.navigation.getParam('item', {empty: true});
		this.event = this.props.navigation.getParam('event', {empty: true});
		this.category = this.props.navigation.getParam('category', []);

    this.state = {
      name: this.event.doc.title,
      note: this.event.doc.note,
      reminder: this.event.doc.reminder,
      roleStatus: this.event.doc.roles.length != 0,
			refresh: false,
      isDateTimePickerVisible: false,
			isDateTimePickerVisible2: false,
      dateText: '',
      hourText: '',
      date: this.event.doc.time,
			dateText2: '',
      hourText2: '',
      date2: this.event.doc.time_reminder,
			selectedRoles: this.event.doc.roles,
      selectedTime: '',
      selectedCategoryId: this.event.doc.cid || '',
      selectedCategory: this.item || '',
      category: this.category,
      role: [],
      availableRole: [],
      group: [],
      chatroom: [],
    }
  }

  componentDidMount = async () => {
    this._convert(this.state.date);
		if(this.state.date2) {
			this._convert(this.state.date2);
		}
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

  reminderChange = (value) => {
		let date = null;;
    if(value) {
      date = new Date();
			this._convert2(date);
    }
		this.setState({
			reminder: value,
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
      refresh: !this.state.refresh,
    });
	}

  onChangeTextName = (name) => {this.setState({name});}
  onChangeTextNote = (note) => {this.setState({note: note.nativeEvent.text || ''});}
  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
	_showDateTimePicker2 = () => this.setState({ isDateTimePickerVisible2: true });
  _hideDateTimePicker2 = () => this.setState({ isDateTimePickerVisible2: false });

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

  _handleDatePicked = (date) => {
    this._hideDateTimePicker();
		this._convert(date);
		this._convert2(date);
  };

	_handleDatePicked2 = (date) => {
    this._hideDateTimePicker2();
		this._convert2(date);
  };

  updateEvent = () => {
    var event = {
			id: this.event.id,
      title: this.state.name,
      time: this.state.date,
      note: this.state.note,
      reminder: this.state.reminder,
      gid: this.group.id,
      time_reminder: this.state.selectedTime,
      cid: this.state.selectedCategory.id || '',
      roles: this.state.selectedRoles,
    };
    FirebaseSvc.updateEvent(event, this.createSuccess())
  }

  createSuccess = () => {
    Toast.show({
      text: "Update Event Success!",
      buttonText: "Okay!",
      duration: 2000,
    });
    this.props.navigation.goBack();
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
            <Text style={{color: "#FFFFFF"}}>Detail Event</Text>
          </Body>
          <Right>
            <Button
              transparent
              onPress={()=>{this.updateEvent()}}>
              <Text style={{color: "#FFFFFF"}}>Save</Text>
            </Button>
          </Right>
        </Header>
        <Content bounces={false}>
          <Form>
            <Item floatingLabel>
              <Label>Event Name</Label>
              <Input onChangeText={(name) => {this.onChangeTextName(name)}} value={this.state.name}/>
            </Item>
            <Item floatingLabel onPress={this._showDateTimePicker}>
							<Label onPress={this._showDateTimePicker}>Date</Label>
							<Input disabled value={this.state.dateText+" "+this.state.hourText} onPress={this._showDateTimePicker}/>
						</Item>
            <View style={{marginTop: 16, marginLeft: 16, marginRight: 16, borderBottomColor: '#F2F0F3', borderBottomWidth: 1, paddingBottom: 16}}>
							<Text style={{color: '#298CFB'}}
                onPress={this._showDateTimePicker}>Select Date</Text>
            </View>
            <View style={{margin: 16, borderBottomColor: '#F2F0F3', borderBottomWidth: 1, paddingBottom: 16}}>
              <Text style={{color: '#757575'}}>Event Notes</Text>
              <AutoGrowingTextInput
                value={this.state.note}
                // onChange={(event) => this._onChange(event)}
                onChange={(note)=>{this.onChangeTextNote(note)}}
                placeholder={'Write a notes...'}
                maxHeight={100}
                minHeight={20}
                enableScrollToCaret
                ref={r => {
                  this._commentRef = r;
                }}
              />
            </View>
            <View style={{marginLeft: 16, marginRight: 16, borderBottomColor: '#F2F0F3', borderBottomWidth: 1, paddingBottom: 16}}>
              <Text style={{color: '#757575'}}>Select Category</Text>
              <Picker
                iosIcon={<MaterialIcon name="arrow-drop-down" color="#757575"/>}
                mode="dropdown"
                placeholder="Uncategorized"
                textStyle={{ color: "#757575", fontSize: 12 }}
                selectedValue={this.state.selectedCategoryId}
                onValueChange={this.onPickerCategoryChange.bind(this)}>
                <Picker.Item label="Uncategorized" value={{empty: true}} />
                {this.state.category.map(item => {
                  return (
                    <Picker.Item key={item.id} label={item.data.name} value={item.id} />
                  )
                })}
              </Picker>
            </View>
						<View style={{marginTop: 16, borderBottomColor: '#F2F0F3', borderBottomWidth: 1}}>
							<View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 16, marginRight: 16, marginBottom: 16}}>
								<Text style={{color: '#757575'}}>REMINDER</Text>
								<Switch
									value={this.state.reminder}
									onValueChange={this.reminderChange}
									trackColor={{true: '#298CFB'}}
								/>
							</View>
							<View style={{marginLeft: 16, marginTop: -6, marginBottom: 16}}>
								<Text note>If Active, You will get Notification about this Event.</Text>
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
    								<Text note>Only Selected Roles can see this Event.</Text>
    							</View>
    						</View>
    						{ this.state.roleStatus ?
    							<View style={{margin: 16}}>
    								<Text
                      style={{textTransform: 'uppercase', fontSize: 12, color: '#757575'}}>
                      Who can see this Event?
                    </Text>
                    <FlatList
  										data={this.state.availableRole}
  			              extraData={this.state.refresh}
  										keyExtractor={item => ""+item.id}
  										renderItem={this.renderRole}
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
