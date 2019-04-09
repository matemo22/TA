/* @flow */

import React, { Component } from 'react';
import {
  Container,
  Content,
  Header,
  Left,
  Body,
  Right,
  Footer,
  Text,
  Button,
  List,
  ListItem,
  Tab,
  Tabs,
  H1,
  Toast,
  Separator,
} from 'native-base';
import { StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Detail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      friends: [{ key: "1", id: 1, name:"Tono" },
                { key: "2", id: 2, name:"Budi" },
                { key: "3", id: 3, name:"Andre" },
                { key: "4", id: 4, name:"Hendro"},
                { key: "5", id: 5, name:"Matemo"}],
      doAbsenFriends: [1],
      refresh: false,
      statusCurrentUser: false,
    };
  }

  //Ganti Component will mount
  //set friends doAbsenFriends statusCurrentUser

  doCheck(id) {
    let tmp = this.state.doAbsenFriends;

    if (tmp.includes( id ) ) {
      tmp.splice( tmp.indexOf(id), 1 );
    } else {
      tmp.push( id );
      Toast.show({
        text: 'Check!',
        buttonText: 'Okay',
        duration: 2000,
        type: 'success',
      });
    }

    this.setState({
      doAbsenFriends: tmp,
      refresh: !this.state.refresh,
    });
  }

  _renderCheckedItem = ({item}) => {
    if(this.state.doAbsenFriends.includes(item.id)) {
      return (
        <ListItem>
          <Text>{item.name}</Text>
        </ListItem>
      )
    }
  }

  _renderUncheckedItem = ({item}) => {
    if(!this.state.doAbsenFriends.includes(item.id)) {
      return (
        <ListItem>
          <Text>{item.name}</Text>
        </ListItem>
      )
    }
  }

  render() {
    return (
      <Container>
        <Content>
          <Header>
            <Left>
              <Button
                transparent
                onPress={()=>{this.props.navigation.goBack()}}>
                <Icon name={"chevron-left"} size={30} color="#298CFB"/>
                <Text style={{marginLeft: -5}}>Back</Text>
              </Button>
            </Left>
            <Body stle={{flex: 3}}>
              <Text>Detail Absen</Text>
            </Body>
            <Right>
            </Right>
          </Header>
          {
            //Ganti H1 & Text
          }
          <H1>NPLC</H1>
          <Text>2019-30-2019</Text>
          <List>
            <Separator bordered>
              <Text>Belum Absen</Text>
            </Separator>
            <FlatList
              data={this.state.friends}
              extraData={this.state.refresh}
              renderItem={this._renderUncheckedItem}
              keyExtractor={item => item.key}
            />
            <Separator bordered>
              <Text>Telah Absen</Text>
            </Separator>
            <FlatList
              data={this.state.friends}
              extraData={this.state.refresh}
              renderItem={this._renderCheckedItem}
              keyExtractor={item => item.key}
            />
          </List>
        </Content>

        <Button style={styles.btnBottom}
          //Ganti -> doCheck(id current user)
          onPress={() => this.doCheck(5)}>
          <Text>Do Absen!</Text>
        </Button>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  btnBottom: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    bottom: 0,
    width: '98%',
    marginBottom: 10,
  },
});
