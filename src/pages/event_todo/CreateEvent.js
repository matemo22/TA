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

    this.state = {
      name:'',
      note:'',
      reminder: false,
      roleStatus: false,
			refresh: false,
      isDateTimePickerVisible: false,
      dateText: '',
      hourText: '',
      date: '',
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
  onChangeTextNote = (note) => {this.setState({note: note.nativeEvent.text || '', noteEdited: true});}
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

  createEvent = () => {
    var event = {
      title: this.state.name,
      time: this.state.date,
      note: this.state.note,
      reminder: this.state.reminder,
      gid: this.item.data.gid,
      time_reminder: this.state.selectedTime,
      cid: this.item.id || '',
      roles: this.state.selectedRoles,
    };
    FirebaseSvc.createEvent(event, this.createSuccess())
  }

  createSuccess = () => {
    Toast.show({
      text: "Create Event Success!",
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
            <Text>Create Event</Text>
          </Body>
          <Right>
            <Button
              disabled={!this.state.nameEdited && !this.state.roleEdited && !this.state.statusEdited}
              transparent
              onPress={()=>{this.createEvent()}}>
              <Text>Save</Text>
            </Button>
          </Right>
        </Header>
        <Content bounces={false}>
          <Form>
            <Item floatingLabel>
              <Label>Event Name</Label>
              <Input onChangeText={(name) => {this.onChangeTextName(name)}} />
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

						<View style={{borderBottomColor: '#F2F0F3', borderBottomWidth: 1}}>
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
  										data={this.state.role}
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
        </Content>
      </Container>
    );
  }
}
