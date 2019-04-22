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
  Toast,
} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { DrawerActions } from 'react-navigation';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import FirebaseSvc from '../assets/services/FirebaseSvc';
import { Col, Row, Grid } from "react-native-easy-grid";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.unsubscribeEvent = null;
    this.unsubscribeTodo = null;

    this.state={
      refresh: false,
      event: [],
      todo: [],
      selectedGroup: '',
    }
  }

  componentDidMount = async () => {
    let group = await this.retrieveDataGroup();
    this.unsubscribeEvent = await FirebaseSvc
      .getEventRef(this.state.selectedGroup.id)
      .onSnapshot(this.fetchEvent);
    this.unsubscribeTodo = await FirebaseSvc
      .getTodosRef(this.state.selectedGroup.id)
      .onSnapshot(this.fetchTodo);
  }

  componentWillUnmount = () => {
    this.unsubscribeEvent();
  }

  fetchEvent = (querySnapshot) => {
    let event = [];
    querySnapshot.forEach( (doc) => {
      event.push({
        doc: doc,
        data: doc.data(),
        id: doc.id,
      });
    });
    this.setState({
      event: event,
      refresh: !this.state.refresh,
    });
  }

  fetchTodo = (querySnapshot) => {
    let todo = [];
    querySnapshot.forEach( (doc) => {
      todo.push({
        doc: doc,
        data: doc.data(),
        id: doc.id,
      });
    });
    this.setState({
      todo: todo,
      refresh: !this.state.refresh,
    });
  }

  retrieveDataGroup = async () => {
    try {
      const selectedGroup = await AsyncStorage.getItem('group');
      const item = JSON.parse(selectedGroup);
      // console.log("Item", item);
      if(item) {
        this.setState({ selectedGroup: item });
      }
      return item;
    }
    catch(error) {
      console.log("Error Retrieve Data Group AsyncStorage", error);
    }
  }

  _convertDate = (date) => {
    var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];
    var day = date.getDate();
    var month_index = date.getMonth();
    var year = date.getFullYear();
    var dateText = day + " " + month_names[month_index] + " " + year;
    return dateText;
	}

  _convertTime = (date) => {
    var hours = date.getHours();
		var minutes = date.getMinutes();
		var minute = "";
		var hour = "";
		if(hours<10) hour="0"+hours;
		else hour = hours;
		if(minutes<10) minute="0"+minutes;
		else minute = minutes;
		var hourText = hour+":"+minute;
    return hourText;
  }

  _convertTimeReminder = (time_reminder) => {
    let reminderText = '';
    if(time_reminder == "5") {
      reminderText = "5 mins before";
    }
    if(time_reminder == "10") {
      reminderText = "10 mins before";
    }
    if(time_reminder == "60") {
      reminderText = "1 hour before";
    }
    if(time_reminder == "120") {
      reminderText = " 2 hours before";
    }
    if(time_reminder == "720") {
      reminderText = "12 hours before";
    }
    if(time_reminder == "1440") {
      reminderText = "1 day before";
    }
    return reminderText;
  }

  _renderEvent = ({item}) => {
    let temp = [];
    var reminderText = this._convertTimeReminder(item.data.time_reminder)
    var date = item.data.time;
    var dateText = this._convertDate(date);
		var hourText = this._convertTime(date);
    temp.push(
      <ListItem
        key={item.id} avatar>
        <Body>
          <Text>{item.data.title}</Text>
          <Text note>{item.data.note}</Text>
        </Body>
        <Right>
          <Text note>{dateText} {hourText}</Text>
          {reminderText != '' ?
            <View style={{flexDirection: 'row', marginTop: 5}}>
              <Icon name="bells" color="#808080" style={{marginRight: 5, marginTop: 1}}/>
              <Text note>{reminderText}</Text>
            </View>
            :
            <View></View>
          }
        </Right>
      </ListItem>
    )
    return (
      temp
    )
  }

  _renderTodo = ({item}) => {
    let temp = [];
    if(!item.data.completed) {
      var list = [];
      var todo = item.data.todo;
      for (var i = 0; i < todo.length; i++) {
        list.push(
          <Text key={item.id+''+i} note style={todo[i].completed ? {textDecorationLine: 'line-through'} : {}}>{todo[i].title}</Text>
        );
      }
      temp.push(
        <ListItem
          key={item.id} avatar>
          <Body>
            <Text>{item.data.title}</Text>
            {list}
          </Body>
        </ListItem>
      )
    }
    return (
      temp
    )
  }

  render() {
    return (
      <Container>
        <Header style={{borderBottomWidth: 0}}>
          <Left>
            <Button transparent>
              <MaterialIcon
                style={{marginLeft: 10}}
                name={"menu"}
                size={30}
                color="#777777"
                onPress={()=>{this.props.navigation.dispatch(DrawerActions.toggleDrawer());}}
              />
            </Button>
          </Left>
          <Body stle={{flex: 3}}>
            <Text>Dashboard</Text>
          </Body>
          <Right>
          </Right>
        </Header>
        <Content bounces={false}>
          <List>
            <ListItem noIndent style={{backgroundColor: "#F8F8F8"}}>
              <Left>
                <Text>Event</Text>
              </Left>
              <Right>
                { this.state.selectedGroup != '' ?
                  <Icon name="plus"
                    onPress={()=>{this.props.navigation.navigate("CreateEvent", {group: this.state.selectedGroup});}}/>
                  :
                  <View></View>
                }
              </Right>
            </ListItem>
            {this.state.event.length != 0 ?
              <FlatList
                data={this.state.event}
                extraData={this.state.refresh}
                renderItem={this._renderEvent}
                keyExtractor={(item, index) => item.id}
              />
              :
              <ListItem>
                <Text note>No Event</Text>
              </ListItem>
            }
            <ListItem noIndent style={{backgroundColor: "#F8F8F8"}}>
              <Left>
                <Text>Todo List</Text>
              </Left>
              <Right>
                { this.state.selectedGroup != '' ?
                  <Icon name="plus"
                    onPress={()=>{this.props.navigation.navigate("CreateTodo", {group: this.state.selectedGroup});}}/>
                  :
                  <View></View>
                }
              </Right>
            </ListItem>
            {this.state.todo.length != 0 ?
              <FlatList
                data={this.state.todo}
                extraData={this.state.refresh}
                renderItem={this._renderTodo}
                keyExtractor={(item, index) => item.id}
              />
              :
              <ListItem>
                <Text note>No Todo</Text>
              </ListItem>
            }
          </List>
        </Content>
      </Container>
    );
  }
}
