/* @flow */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
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
} from 'native-base';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DrawerActions } from 'react-navigation';

export default class Planner extends Component {
  constructor(props) {
		super(props);

		this.state = {
      items:{},
		};
	}

  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: 'Item for ' + strTime,
              //height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      //console.log(this.state.items);
      const newItems = {};
      Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  renderItem(item) {
    return (
      <View style={[styles.item,]}><Text>{item.name}</Text></View>
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
				<Header>
          <Left>
            <Icon
              style={{marginLeft: 10}}
              name={"menu"}
              size={30}
              color="#298CFB"
              onPress={()=>{this.props.navigation.dispatch(DrawerActions.toggleDrawer());}}
            />
          </Left>
          <Body stle={{flex: 3}}>
            <Text>Planner</Text>
          </Body>
          <Right>
            <Icon
              style={{marginRight: 5}}
              name={"add"}
              size={30}
              color="#298CFB"
              onPress={()=>{this.props.navigation.navigate("CreatePlanner")}}
            />
          </Right>
        </Header>
				<Agenda
					items={this.state.items}
					loadItemsForMonth={this.loadItems.bind(this)}
					renderItem={this.renderItem.bind(this)}
					renderEmptyDate={this.renderEmptyDate.bind(this)}
					rowHasChanged={this.rowHasChanged.bind(this)}
				/>
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
