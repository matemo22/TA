/* @flow */

import React, { Component } from 'react';
import {
  Container,
  Content,
  Header,
  Body,
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
  Form,
  Item,
  Label,
  Input,
  Left,
  Right,
} from 'native-base';
import { StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Create extends Component {
  constructor(props) {
    super(props);

    this.state = {
      friends: [{ key: "1", id: 1, name:"Tono" },
                { key: "2", id: 2, name:"Budi" },
                { key: "3", id: 3, name:"Andre" },
                { key: "4", id: 4, name:"Hendro"} ],
      selectedFriendId: [],
      refresh: false,
    };
  }

  returnData(selectedFriendId) {
    this.setState({
      selectedFriendId: selectedFriendId,
      refresh: !this.state.refresh
    });
  }

  removeMember(id) {
    let tmp = this.state.selectedFriendId;

    if ( tmp.includes( id ) ) {
      tmp.splice( tmp.indexOf(id), 1 );
    } else {
      tmp.push( id );
    }

    this.setState({
      selectedFriendId: tmp,
      refresh: !this.state.refresh,
    });
  }

  _renderItem = ({item}) => {
    if(this.state.selectedFriendId.includes(item.id)) {
      return (
        <ListItem icon>
          <Left>
            <Icon name="person" size={30}/>
          </Left>
          <Body>
            <Text>{item.name}</Text>
          </Body>
          <Right>
            <Button
              transparent
              onPress={()=>this.removeMember(item.id)}
            >
              {/* <Icon name="remove" color="#FFF" /> */}
              <Text>Remove</Text>
            </Button>
          </Right>
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
                onPress={()=>{this.props.navigation.goBack()}}
              >
                <Icon name={"chevron-left"} size={30} color="#298CFB"/>
                <Text style={{marginLeft: -5}}>Back</Text>
              </Button>
            </Left>
            <Body stle={{flex: 3}}>
              <Text>Create Absen</Text>
            </Body>
            <Right>
              <Button
                transparent
                onPress={()=>{console.log("Create");}}
              >
                <Text>Create</Text>
              </Button>
            </Right>
          </Header>
          <Form>
            <Item floatingLabel>
              <Label>Nama Kegiatan Absensi</Label>
              <Input onChangeText={(absensi) => {console.log(absensi);}}/>
            </Item>
            <Item style={{marginTop: 30}}>
              <Label>Members</Label>
              <Right>
                <Button
                  transparent
                  style={{marginRight: 15}}
                  onPress={()=>{this.props.navigation.navigate("InviteAbsen", {returnData: this.returnData.bind(this), selectedFriendId: this.state.selectedFriendId, friends: this.state.friends})}}
                >
                  <Text>Add</Text>
                </Button>
              </Right>
            </Item>
            <List>
              <ListItem icon>
                <Left>
                  <Icon name="person" size={30}/>
                </Left>
                <Body>
                  <Text>Matemo</Text>
                </Body>
                <Right>
                </Right>
              </ListItem>
              <FlatList
                data={this.state.friends}
                extraData={this.state.refresh}
                renderItem={this._renderItem}
                keyExtractor={item => item.key}
              />
            </List>
          </Form>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
