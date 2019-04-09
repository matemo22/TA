/* @flow */

import React, { Component } from 'react';
import { View } from 'react-native';
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
	Icon,
} from 'native-base';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import firebase from 'react-native-firebase';

export default class Planner extends Component {

	constructor() {
		super();
		// this.todos = firebase.firestore().collection('todos');
		// this.meetings = firebase.firestore().collection('meetings');

		this.unsubscribeTodos = null;
		this.unsubscribeMeetings = null;

		this.state = {
			textInput: '',
			date: '',
			loading1: true,
			loading2: true,
			todos: [],
			meetings: [],
		};
	}

	componentDidMount() {
		// this.unsubscribeTodos = this.todos.onSnapshot(this.onCollectionTodosUpdate);
		// this.unsubscribeMeetings = this.meetings.onSnapshot(this.onCollectionMeetingsUpdate);
	}

	componentWillUnmount() {
		this.unsubscribeTodos();
		this.unsubscribeMeetings();
	}

	onCollectionTodosUpdate = (querySnapshot) => {
		// const todos = [];
		// querySnapshot.forEach(function(doc){
		// 	const { title, date, complete, uid } = doc.data();
		//
		// 	todos.push({
		// 		key: doc.id,
		// 		doc,
		// 		title,
		// 		date,
		// 		complete,
		// 		uid,
		// 	});
		// });
		//
		// this.setState({
		// 	todos,
		// 	loading1: false,
		// });
	}

	onCollectionMeetingsUpdate = (querySnapshot) => {
		// const meetings = [];
		// querySnapshot.forEach(function(doc){
		// 	const { title, date, start, end } = doc.data();
		//
		// 	meetings.push({
		// 		key: doc.id,
		// 		doc,
		// 		title,
		// 		date,
		// 		start,
		// 		end,
		// 	});
		// });
		//
		// this.setState({
		// 	meetings,
		// 	loading2: false,
		// });
	}

	addTodo() {
		this.planner.add({
			title: this.state.textInput,
			complete: false,
			date: this.state.date,
			uid: '',
		});

		this.setState({
			textInput: '',
			date: '',
		});
	}

	onDayClick = (day) => {
		// console.log("Selected day",day);
		this.props.navigation.navigate('DetailPlanner', {
			title: 'Detail Planner',
			day: day,
		});
	}

	render() {
		// if(this.state.loading1 && this.state.loading2) {
		// 	return null;
		// }
		// const meeting = {key:'meeting', color:'red'};
		// const todo = {key:'todo', color:'blue'};
		//
		// //Todos
		// var dateDots = [];
		// for (var i = 0; i < this.state.todos.length; i++) {
		// 	var data=this.state.todos[i];
		// 	var num = -1;
		// 	var exist = dateDots.some(function(element, index){
		// 		if(element.hasOwnProperty(data.date)) num = index;
		// 		else num = -1;
		// 		return element.hasOwnProperty(data.date);
		// 	});
		// 	if(exist) {
		// 		var check = dateDots[num][data.date].dots.some(function(element) {
		// 			return element==todo;
		// 		});
		// 		if(!check) {
		// 			dateDots[num][data.date].dots.push(todo);
		// 		}
		// 	}
		// 	else {
		// 		dateDots.push({
		// 			[data.date]: {dots:[todo]},
		// 		});
		// 	}
		// }
		//
		// //Meetings
		// for (var i = 0; i < this.state.meetings.length; i++) {
		// 	var data=this.state.meetings[i];
		// 	var num = -1;
		// 	var exist = dateDots.some(function(element, index){
		// 		if(element.hasOwnProperty(data.date)) num = index;
		// 		else num = -1;
		// 		return element.hasOwnProperty(data.date);
		// 	});
		// 	if(exist) {
		// 		var check = dateDots[num][data.date].dots.some(function(element) {
		// 			return element==meeting;
		// 		});
		// 		if(!check) {
		// 			dateDots[num][data.date].dots.push(meeting);
		// 		}
		// 	}
		// 	else {
		// 		dateDots.push({
		// 			[data.date]: {dots:[meeting]},
		// 		});
		// 	}
		// }
		// var dots = {};
		// for (var i = 0; i < dateDots.length; i++) {
		// 	// for (const key of dateDots[i]) {
		// 	// 	dots[key] = key;
		// 	// }
		// 	var key = Object.keys(dateDots[i]);
		// 	dots[key[0]]=dateDots[i][key[0]];
		// }
			// for (var i = 0; i < dateDots.length; i++) {
			// 	dateDots.date:{dots: [meeting]},
			// }
    return (
      <Container>
				<Agenda
					items={
						{'2019-03-22': [{text: 'item 1 - any js object'}],
						 '2019-03-23': [{text: 'item 2 - any js object'}],
						 '2019-03-24': [],
						 '2019-03-25': [{text: 'item 3 - any js object'},{text: 'any js object'}],
						}}
					loadItemsForMonth={(month) => {console.log('trigger items loading', month)}}
					onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
					onDayPress={(day)=>{}}
					onDayChange={(day)=>{console.log('day changed', day)}}
					renderItem={(item, firstItemInDay) => {return(<Text>Render Item</Text>)}}
					renderDay={(day, item) => {return (<Text>Render Day</Text>)}}
					renderEmptyData = {() => {return (<Text>Empty Data!!!</Text>);}}
					rowHasChanged={(r1, r2) => {console.log("R1",r1, " - R2",r2);return (<Text>{r1.text !== r2.text}</Text>)}}

				/>
      </Container>
    );
  }
}
