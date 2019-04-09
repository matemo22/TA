/* @flow */

import React, { Component } from 'react';
import { NavigationActions, SafeAreaView } from 'react-navigation';
import { ScrollView, AsyncStorage, View, StyleSheet, FlatList, SectionList } from 'react-native';
import {
  Container,
	Header,
	Title,
	Content,
	Button,
	Body,
  Footer,
  FooterTab,
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
  Separator,
  ActionSheet,
  H2,
} from 'native-base';
import FirebaseSvc from '../services/FirebaseSvc.js';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default class drawerMenuComponents extends Component {
  constructor(props) {
    super(props);
    this.unsubscribeGroup=null;
    this.unsubscribeCategory=null;

    this.groupRef = FirebaseSvc.getGroupRef();
    this.categoryRef = FirebaseSvc.getCategoryRef("JCQ47TKp8wxhOHtpcu6D");

    this.state = {
      groups: [],
      category: [],
      selectedList: '',
      selectedGroup: '',
      user: null,
      photoURL: '',
      refresh: false,
      switch: true,
    }
  }

  async componentDidMount() {
    this.unsubscribeGroup = await this.groupRef.onSnapshot(this.fetchGroup);
    this.unsubscribeCategory = await this.categoryRef.onSnapshot(this.fetchCategory);
    var user = FirebaseSvc.getCurrentUser();
    this.setState({
      user,
      photoURL: user.photoURL,
    });
  }

  componentWillUnmount() {
		this.unsubscribeGroup();
    this.unsubscribeCategory();
	}

  fetchGroup = (querySnapshot) => {
    let groups = [];
    let selectedGroup = this.state.selectedGroup;
    querySnapshot.forEach( (doc) => {
      if(selectedGroup=='') selectedGroup = doc.id;
      groups.push({
        doc: doc,
        data: doc.data(),
        id: doc.id
      });
    });

    this.setState({
      groups: groups,
      selectedGroup: selectedGroup,
      refresh: !this.state.refresh,
    });
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

  _toggleGroup = () => {
    this.setState({
      switch: !this.state.switch,
    })
  }

  navigateToScreen = (route) => (
    () => {
      const navigateAction = NavigationActions.navigate({
        routeName: route,
      });
      this.props.navigation.dispatch(navigateAction);
    }
  )

  logout = async () => {
    await FirebaseSvc.logout(this.logoutSuccess, this.logoutFailed);
  }

  logoutSuccess = () => {
    console.log("Logout Successful. Navigate to AuthTabs");
    this.props.navigation.navigate("AuthTabs");
  }

  logoutFailed = () => {
    alert("Logout Failed");
  }

  _renderItem = ({item, index}) => {
    let temp = [];
    temp.push(
      <ListItem
        key={item.id}
        onPress={()=>{console.log("Open Dashboard");}}
        style={item.data.chatrooms ? {backgroundColor: '#F0EFF5', marginLeft: 0, borderColor: '#C9C9C9'} : {backgroundColor: '#F0EFF5', marginBottom: 10, borderColor: '#C9C9C9', marginLeft: 0}}>
        <Left>
          <Text style={{color: '#777777', marginLeft: 16, fontSize: 10, fontFamily: 'System', textTransform: 'uppercase'}}>{item.title}</Text>
        </Left>
        <Right>
          <MaterialIcon name="add" color="#777777" onPress={()=>{this.props.navigation.navigate("CreateChatroom", {id: item.id, doc: item.doc, })}}/>
        </Right>
      </ListItem>

    );
    if(item.data.chatrooms) {
      for (var i = 0; i < item.data.chatrooms.length; i++) {
        if(item.data.chatrooms[i].private) {
          if(item.data.chatrooms[i].members.includes(this.state.user.uid)) {
            temp.push(
              <ListItem onPress={this.navigateToScreen("Chatroom")} key={item.data.chatrooms[i].cid}>
                <Icon name="book"/>
                <Text style={styles.deactiveListItemTextIcon}>{item.data.chatrooms[i].name}</Text>
                <Icon name="lock" color="#777777" style={{marginLeft: 3}}/>
              </ListItem>
            );
          }
        }
        else {
          temp.push(
            <ListItem onPress={this.navigateToScreen("Chatroom")} key={item.data.chatrooms[i].cid}>
              <Icon name="book"/>
              <Text style={styles.deactiveListItemTextIcon}>{item.data.chatrooms[i].name}</Text>
            </ListItem>
          );
        }
      }
    }
    return(
      temp
    )
  }

  render() {
    return (
      <Container>
        <Header style={{backgroundColor: '#FFF'}}>
          <Left>
            <Thumbnail small source={this.state.photoURL ? {uri:this.state.photoURL} : require('../images/icon.png')} />
          </Left>
          <Body>
            <Title style={{marginLeft: 5, textAlign: 'left', alignSelf: 'flex-start'}}>SU IMT</Title>
          </Body>
          <Right>
            <Icon name="appstore-o" size={25} style={{marginBottom: -2, marginRight: 3}}/>
            <MaterialIcon name="more-vert" size={25}/>
          </Right>
        </Header>
        <Content>
          <ListItem
            onPress={this.navigateToScreen("Home")}
            style={(this.state.selectedList=='Dashboard') ? styles.activeListItem : {}}>
            <Icon name="dashboard" style={(this.state.selectedList=='Dashboard') ? styles.activeListItemIcon : {}}/>
            <Text style={(this.state.selectedList=='Dashboard') ? styles.activeListItemText : styles.deactiveListItemTextIcon}>Dashboard</Text>
          </ListItem>
          <FlatList
            data={this.state.category}
            renderItem={this._renderItem}
            extraData={this.state.refresh}
            keyExtractor={item => item.id}
          />

          <Separator bordered>
            <Text style={{fontSize: 10}}>OTHERS</Text>
          </Separator>
          <ListItem onPress={this.navigateToScreen("Profile")}>
            <Icon name="user"/>
            <Text style={styles.deactiveListItemTextIcon}>Profile</Text>
          </ListItem>
          <ListItem onPress={this.navigateToScreen("Setting")}>
            <Icon name="setting"/>
            <Text style={styles.deactiveListItemTextIcon}>Setting</Text>
          </ListItem>
          <ListItem onPress={()=>{this.logout()}}>
            <Icon name="logout" />
            <Text style={styles.deactiveListItemTextIcon}>Logout</Text>
          </ListItem>
        </Content>
        <Footer>
          <FooterTab>
            <Button onPress={()=>{}}>
              <Icon name="swap"/>
              <Text>Switch Group</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  activeListItem: {
    backgroundColor: '#298CFB',
    marginLeft: 0,
  },
  activeListItemIcon: {
    marginLeft: 16,
    color: '#FFF',
  },
  activeListItemText: {
    marginLeft: 5,
    color: '#FFF',
  },
  deactiveListItemTextIcon: {
    marginLeft: 5,
  }
});
