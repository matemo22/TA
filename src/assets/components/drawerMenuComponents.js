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
      mainDrawer: false,
    }
  }

  async componentDidMount() {
    let group = await this.retrieveDataGroup();
    this.retrieveDataMainDrawer();
    this.unsubscribeGroup = await FirebaseSvc
      .getGroupRef()
      .onSnapshot(this.fetchGroup);
    this.unsubscribeCategory = await FirebaseSvc
      .getCategoryRef(this.state.selectedGroup.id)
      .onSnapshot(this.fetchCategory);
    console.log("ComponentDidMount");


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

  retrieveDataGroup = async () => {
    try {
      const selectedGroup = await AsyncStorage.getItem('group');
      const item = JSON.parse(selectedGroup);
      console.log("Item", item);
      if(item) {
        this.setState({ selectedGroup: item });
      }
      return item;
    }
    catch(error) {
      console.log("Error Retrieve Data", error);
    }
  }

  retrieveDataMainDrawer = async () => {
    const mainDrawer = await AsyncStorage.getItem('mainDrawer');
    console.log("MainDrawer", mainDrawer);
    if(mainDrawer=='true') {
      this.setState({ mainDrawer: true });
    }
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
      mainDrawer: false,
      selectedGroup: [],
      category: [],
    });
    this._emptyData();
    this.unsubscribeCategory();
  }

  _emptyData = async () => {
    AsyncStorage.clear();
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

  selectGroup = async (item) => {
    await this.setState({
      selectedGroup: item,
      mainDrawer: true,
    });
    var data = this._storeData(item);
    var mainDrawer = this._storeDataMainDrawer(true);
    this.unsubscribeCategory = await FirebaseSvc
      .getCategoryRef(this.state.selectedGroup.id)
      .onSnapshot(this.fetchCategory);
    console.log("User", FirebaseSvc.getCurrentUser());
  }

  _storeData = async (item) => {
    try {
      const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
          if(typeof value === "object" && value!== null){
            if(seen.has(value)){
              return;
            }
            seen.add(value);
          }
          return value;
        };
      };
      var data = await AsyncStorage.setItem('group', JSON.stringify(item, getCircularReplacer()));
      return data;
    }
    catch(error) {
      console.log("Error Store Data",error);
    }
  }

  _storeDataMainDrawer = async (mainDrawer) => {
    try {
      var data = await AsyncStorage.setItem('mainDrawer', JSON.stringify(mainDrawer));
      return data;
    }
    catch(error) {
      console.log("Error Store Data MainDrawer",error);
    }
  }

  _renderGroup = ({item}) => {
    let temp = [];
    if(item.data.members.includes(FirebaseSvc.getCurrentUser().uid)) {
      temp.push(
        <ListItem
          onPress={()=>{this.selectGroup(item)}}
          key={item.id}>
          <Thumbnail small source={item.data.photoURL ? {uri:item.data.photoURL} : require('../images/icon.png')} />
          <Text style={styles.deactiveListItemTextIcon, {marginLeft: 5}}>{item.data.name}</Text>
        </ListItem>
      );
    }
    return(
      temp
    )
  }

  render() {
    const { mainDrawer } = this.state;
    if(mainDrawer){
      return (
        <Container>
          <Header style={{backgroundColor: '#FFF'}}>
            <Left></Left>
            <Body>
              <Title style={{marginLeft: 5, textAlign: 'left', alignSelf: 'flex-start'}}>{this.state.selectedGroup.doc._data.name}</Title>
            </Body>
            <Right>
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
              <Button onPress={this._toggleGroup}>
                <Icon name="swap"/>
                <Text>Change Group</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      );
    }

    return (
      <Container>
        <Header>
          <Left>

          </Left>
          <Body>
            <Title style={{marginLeft: 5, textAlign: 'left', alignSelf: 'flex-start'}}>Group</Title>
          </Body>
          <Right>

          </Right>
        </Header>
        <Content>
          <FlatList
            data={this.state.groups}
            renderItem={this._renderGroup}
            extraData={this.state.refresh}
            keyExtractor={item => item.id}
          />
        </Content>
        <Footer>
          <FooterTab>
            <Button>
              <Text>Create Group</Text>
            </Button>
            <Button>
              <Text>Join Group</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
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
