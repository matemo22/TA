/* @flow */

import React, { Component } from 'react';
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
} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DrawerActions } from 'react-navigation';

export default class Absen extends Component {
  goToPage = () => {
    this.props.navigation.navigate("Profile");
  }

  render() {
    return (
      <Container>
        <Content>
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
              <Text>Absen</Text>
            </Body>
            <Right>
              <Icon
                style={{marginRight: 5}}
                name={"add"}
                size={30}
                color="#298CFB"
                onPress={()=>{this.props.navigation.navigate("CreateAbsen")}}
              />
            </Right>
          </Header>
          <List>
            <ListItem itemHeader>
              <Text>Absensi Kegiatan</Text>
            </ListItem>
            <ListItem onPress={() => {this.props.navigation.navigate("DetailAbsen")}}>
              <Text>NPLC</Text>
            </ListItem>
            <ListItem>
              <Text>Red Carpet</Text>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}
