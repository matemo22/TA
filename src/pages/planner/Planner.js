/* @flow */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import {
	Container,
	Header,
	Title,
	Footer,
	FooterTab,
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
} from 'native-base';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import FirebaseSvc from '../../assets/services/FirebaseSvc';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { DrawerActions } from 'react-navigation';

export default class Planner extends Component {
  constructor(props) {
		super(props);
		this.unsubscribe = null;
		this.unsubscribeData = [];

		this.state = {
      items:{},
		};
	}

	componentDidMount = async () => {

	}

	componentWillUnmount = () => {
		this.unsubscribe();
		for (var i = 0; i < this.unsubscribeData.length; i++) {
			this.unsubscribeData[i]();
		}
	}

	fetchData = async (doc) => {
		var data = doc.data();
		let event = [];
		for (var i = 0; i < data.groups.length; i++) {
			this.unsubscribeData[i] = await FirebaseSvc
				.getEventRef(data.groups[i])
				.onSnapshot((querySnapshot) => {
					querySnapshot.forEach((doc)=>{
						event.push({
							doc: doc,
			        data: doc.data(),
			        id: doc.id,
						});
					});
				});
		}
	}




	async loadItems() {
		let user = FirebaseSvc.getCurrentUser();
		this.unsubscribe = FirebaseSvc
			.getUserRef(user.uid)
			.onSnapshot(async (doc) => {
				var data = doc.data();
				let event = [];
				function formatDate(date) {
					var d = new Date(date),
							month = '' + (d.getMonth() + 1),
							day = '' + d.getDate(),
							year = d.getFullYear();

					if (month.length < 2) month = '0' + month;
					if (day.length < 2) day = '0' + day;

					return [year, month, day].join('-');
				}
				for (var i = 0; i < data.groups.length; i++) {
					this.unsubscribeData[i] = await FirebaseSvc
						.getEventRef(data.groups[i])
						.onSnapshot(async (querySnapshot) => {
							await querySnapshot.forEach((doc)=>{
								event.push({
									doc: doc,
					        data: doc.data(),
					        id: doc.id,
								});
							});
						});
				}
				event = await event.sort(function(a,b){
					return new Date(b.data.time) - new Date(a.data.time);
				});
				var tempData = this.state.items;
				for (var i = 0; i < event.length; i++) {
					var dateText = formatDate(event[i].data.time);
					if (!tempData[dateText]) {
						tempData[dateText] = [];
					}
					tempData[dateText].push(event[i]);
				}
				console.log("temp", tempData);
				this.setState({
					items: tempData,
				});
			});
		// setTimeout(()=>{
		// 	for (var i = 0; i < this.state.event.length; i++) {
		// 		this.state.event[i]
		// 	}
		// }, 3000);
	}

  // loadItems(day) {
	// 	console.log("Day", day);
  //   setTimeout(() => {
  //     for (let i = -15; i < 85; i++) {
  //       const time = day.timestamp + i * 24 * 60 * 60 * 1000;
  //       const strTime = this.timeToString(time);
  //       if (!this.state.items[strTime]) {
  //         this.state.items[strTime] = [];
  //         const numItems = Math.floor(Math.random() * 5);
  //         for (let j = 0; j < numItems; j++) {
  //           this.state.items[strTime].push({
  //             name: 'Item for ' + strTime,
  //             //height: Math.max(50, Math.floor(Math.random() * 150))
  //           });
  //         }
  //       }
  //     }
  //     //console.log(this.state.items);
  //     const newItems = {};
  //     Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key];});
  //     this.setState({
  //       items: newItems
  //     });
  //   }, 1000);
  //   // console.log(`Load Items for ${day.year}-${day.month}`);
  // }

  renderItem(item) {
    return (
      <View style={[styles.item,]}><Text>{item.data.title}</Text></View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  render() {
    return (
      <Container>
				<Header androidStatusBarColor="#1C75BC" style={{backgroundColor: "#1C75BC", borderWidth: 0}}>
          <Left></Left>
          <Body stle={{flex: 3}}>
            <Text style={{color: "#FFFFFF"}}>Planner</Text>
          </Body>
          <Right></Right>
        </Header>
				<Agenda
					items={this.state.items}
					loadItemsForMonth={this.loadItems.bind(this)}
					renderItem={this.renderItem.bind(this)}
					renderEmptyDate={this.renderEmptyDate.bind(this)}
					rowHasChanged={this.rowHasChanged.bind(this)}
				/>
				<Footer style={{backgroundColor: "#1C75BC"}}>
					<FooterTab style={{backgroundColor: "#1C75BC"}}>
						<Button onPress={()=>{this.props.navigation.navigate("Groups")}}>
							<Icon name="team" color="#FFFFFF" size={20}/>
						</Button>
						<Button onPress={()=>{this.props.navigation.navigate("Planner")}}>
							<Icon name="bells" color="#2B3990" size={20}/>
						</Button>
						<Button onPress={()=>{this.props.navigation.navigate("Profile")}}>
							<Icon name="user" color="#FFFFFF" size={20}/>
						</Button>
					</FooterTab>
				</Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    //height: 15,
    flex:1,
    paddingTop: 30
  }
});
