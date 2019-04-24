/* @flow */

import React, { Component } from 'react';
import { View, AsyncStorage, FlatList, StyleSheet } from 'react-native';
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
  ActionSheet,
} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import FirebaseSvc from '../../assets/services/FirebaseSvc';
import { Col, Row, Grid } from "react-native-easy-grid";
import Accordion from 'react-native-collapsible/Accordion';
import NestedListView, {NestedRow} from 'react-native-nested-listview'

export default class EventTodos extends Component {
  constructor(props) {
    super(props);
    this.unsubscribeEvent = null;
    this.unsubscribeTodo = null;
    this.unsubscribeCategory = null;
    this.group = this.props.navigation.dangerouslyGetParent().getParam("group", []);

    this.state={
      refresh: false,
      groups: [],
      category: [],
      event: [],
      todo: [],
      sections: [
        {title: 'NPLC',
          data:[
            {note: 'Note', reminder: true, title: 'New Event'}
          ]
        },
        {title: 'Technocamp',
          data:[
            {note: 'Note', reminder: true, title: 'Event1'},
            {note: 'Note', reminder: true, title: 'Event2'},
            {note: 'Note', reminder: true, title: 'Event3'},
          ]
        },
      ],
    }
  }

  componentDidMount = async () => {
    this.unsubscribeCategory = await FirebaseSvc
      .getCategoryRef(this.group.id)
      .onSnapshot(this.fetchCategory);
    this.unsubscribeEvent = await FirebaseSvc
      .getEventRef(this.group.id)
      .onSnapshot(this.fetchEvent);
    this.unsubscribeTodo = await FirebaseSvc
      .getTodosRef(this.group.id)
      .onSnapshot(this.fetchTodo);
  }

  componentWillUnmount = () => {
    this.unsubscribeEvent();
    this.unsubscribeTodo();
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

  renderNode = (node, level) => {
    const paddingLeft = (level+1) * 10;
    if(level == 1) {
      return(
        <NestedRow
          level={level}
          style={styles.level1}
        >
          <Grid>
            <Col style={{justifyContent: 'center'}}>
              <Text>{node.title}</Text>
            </Col>
            <Col style={{alignItems: 'flex-end', justifyContent: 'center'}}>
              <View style={{flexDirection: 'row'}}>
                <Icon style={{marginRight: 10}} name="plus" onPress={()=>{this.showActionSheet(node.doc)}}/>
                <Icon name={node.opened ? "up" : "down"} style={{marginRight: 10}}/>
              </View>
            </Col>
          </Grid>
        </NestedRow>
      )
    }
    else {
      var temp = [];
      if(node.type == 'event') {
        var reminderText = this._convertTimeReminder(node.doc.time_reminder)
        var date = node.doc.time;
        var dateText = this._convertDate(date);
    		var hourText = this._convertTime(date);
        temp.push(
          <ListItem
            onPress={()=>{console.log("Go To Event");}}
            key={node.id} avatar>
            <Body>
              <Text>{node.doc.title}</Text>
              <Text note>{node.doc.note}</Text>
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
      }
      else {
        if(!node.doc.completed) {
          var list = [];
          var todo = node.doc.todo;
          for (var i = 0; i < todo.length; i++) {
            list.push(
              <Text key={node.id+''+i} note style={todo[i].completed ? {textDecorationLine: 'line-through'} : {}}>{todo[i].title}</Text>
            );
          }
          temp.push(
            <ListItem
              key={node.id} avatar>
              <Body>
                <Text>{node.doc.title}</Text>
                {list}
              </Body>
            </ListItem>
          )
        }
      }
      return (
        temp
      )
    }
  }

  showActionSheet = (item = {empty: true}) => {
    var BUTTONS = ["Create Event", "Create Todos", "Cancel"];
    var CANCEL_INDEX = 2;
    ActionSheet.show(
    {
      options: BUTTONS,
      cancelButtonIndex: CANCEL_INDEX,
    },
    (buttonIndex) => {
      if(buttonIndex == 0) {
        this.props.navigation.navigate("CreateEvent", {group: this.group, item: item});
      }
      else if(buttonIndex == 1) {
        this.props.navigation.navigate("CreateTodo", {group: this.group, item: item});
      }
    });
  }

  formatData = () => {
    let data=[];
    let event = this.state.event;
    let todo = this.state.todo;
    let category = this.state.category;
    for (var i = 0; i < category.length; i++) {
      let temp = {};
      let arr=[];
      let foundEvent = event.some(e => e.data.cid === category[i].id);
      let foundTodo = todo.some(t => t.data.cid === category[i].id);
      if(foundEvent){
        for (var j = 0; j < event.length; j++) {
          if(event[j].data.cid === category[i].id) {
            var doc = event[j].data;
            arr.push({type:"event", id: event[j].id, doc});
          }
        }
      }
      if(foundTodo){
        for (var j = 0; j < todo.length; j++) {
          if(todo[j].data.cid === category[i].id) {
            var doc = todo[j].data;
            arr.push({type:"todo", id: todo[j].id, doc});
          }
        }
      }
      if(foundEvent||foundTodo) {
        temp.title = category[i].title;
        temp.doc = category[i];
        temp.data = arr;
        data.push(temp);
      }
    }
    return data;
  }

  render() {
    return (
      <Container>
        <Header style={{borderBottomWidth: 0}}>
          <Left>
          </Left>
          <Body stle={{flex: 3}}>
            <Text>Dashboard</Text>
          </Body>
          <Right>
          </Right>
        </Header>
        <Content bounces={false}>
          <ListItem noIndent style={{backgroundColor: "#F8F8F8"}}>
            <Left>
              <Text>Event & Todos</Text>
            </Left>
            <Right>
              <Text onPress={()=>{this.showActionSheet()}}>Add</Text>
            </Right>
          </ListItem>
          <NestedListView
            data={this.formatData()}
            getChildrenName={(node) => 'data'}
            extraData={this.state.refresh}
            renderNode={this.renderNode}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  level1: {
    backgroundColor: "#F8F8F8",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
});
