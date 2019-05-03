/* @flow */

import React, { Component } from 'react';
import {
  Container,
  Content,
  Header,
  Body,
  Footer,
  FooterTab,
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
  CheckBox,
} from 'native-base';
import { StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import DateTimePicker from 'react-native-modal-datetime-picker';

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
      isDateTimePickerVisible: false,
    };
  }

  _showDateTimePicker=()=> this.setState({isDateTimePickerVisible: true});
  _hideDateTimePicker=()=> this.setState({isDateTimePickerVisible: false});

  _handleDatePicked = (date) => {
    console.log("Date", date);
    this._hideDateTimePicker();
  }

  _onChange = (event) => {
    this.setState({ text: event.nativeEvent.text || '' });
  }

  _resetTextInput() {
    this._commentRef.clear();
    this._commentRef.resetHeightToMin();
  }

  render() {
    return (
      <Container>
        <Header androidStatusBarColor="#1C75BC" style={{backgroundColor: "#1C75BC"}}>
          <Left>
            <Button
              transparent
              onPress={()=>{this.props.navigation.goBack()}}
            >
              <Icon name={"chevron-left"} size={30} color="#FFFFFF"/>
              <Text style={{marginLeft: -5, color: "#FFFFFF"}}>Back</Text>
            </Button>
          </Left>
          <Body stle={{flex: 3}}>
            <Text style={{color: "#FFFFFF"}}>Create Notes</Text>
          </Body>
          <Right>
            <Button
              transparent
              onPress={()=>{console.log("Create");}}
            >
              <Text style={{color: "#FFFFFF"}}>Post</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <Item regular
            style={{ width: "98%", borderTopColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent'}}>
            <AutoGrowingTextInput
              // value={this.state.textValue}
              // onChange={(event) => this._onChange(event)}
              onChange={(event)=>{this._onChange(event)}}
              style={{ marginLeft: 10, width: '85%', marginRight: 10}}
              placeholder={"What's new?"}
              maxHeight={300}
              minHeight={100}
              enableScrollToCaret
              ref={r => {
                this._commentRef = r;
              }}
            />
          </Item>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            mode='datetime'
          />
        </Content>
        <Footer>
          <FooterTab>
            <Button>
              <Icon name="image" size={20}/>
              <Text>Choose Images</Text>
            </Button>
            <Button onPress={this._showDateTimePicker}>
              <Icon name="today" size={20}/>
              <Text>Set Reminder</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
