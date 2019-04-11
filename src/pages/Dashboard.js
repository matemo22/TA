/* @flow */

import React, { Component } from 'react';
import { Image, FlatList, } from 'react-native';
import {
  Container,
  Content,
  Header,
  Body,
  Footer,
  Text,
  List,
  ListItem,
  Left,
  Right,
  Button,
  Card,
  CardItem,
  Thumbnail,
  Form,
  Item,
  Input
} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DrawerActions } from 'react-navigation';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import FirebaseSvc from '../assets/services/FirebaseSvc';
import { Col, Row, Grid } from "react-native-easy-grid";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state={
      refresh: false,
      schedule: [],
      todo: [],
    }
  }

  _renderSchedule = ({item}) => {
    <Card>
      <CardItem>
        <Body>
          <Text>{item.name}</Text>
        </Body>
      </CardItem>
    </Card>
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
              onPress={()=>{this.props.navigation.dispatch(DrawerActions.toggleDrawer());}}
            />
          </Left>
          <Body stle={{flex: 3}}>
            <Text>Dashboard</Text>
          </Body>
          <Right>
            <Icon
              style={{marginRight: 5}}
              name={"add"}
              size={30}
              onPress={()=>{this.props.navigation.navigate("CreateNotes")}}
            />
          </Right>
        </Header>
        <Content>
          <Text style={{marginLeft: 10, marginTop: 10}}>Schedule</Text>
          {this.state.schedule.length!=0 ?
            <FlatList
              data={this.state.schedule}
              extraData={this.state.refresh}
              renderItem={this._renderSchedule}
              keyExtractor={item => item.key}
            />
            :
            <Text>No Data</Text>
          }


          <Text style={{marginLeft: 10, marginTop: 10}}>Schedule</Text>
          <FlatList
            data={this.state.todo}
            extraData={this.state.refresh}
            renderItem={this._renderSchedule}
            keyExtractor={item => item.key}
          />
        </Content>
      </Container>
    );
  }
}
