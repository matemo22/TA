/* @flow */

import React, { Component } from 'react';
import { NavigationActions, SafeAreaView, StackActions } from 'react-navigation';
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
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class drawerMenuComponents extends Component {
  constructor(props) {
    super(props);
    this.unsubscribeGroup=null;
    this.unsubscribeCategory=null;
    this.unsubscribeChatroom=null;

    this.state = {
      groups: [],
      category: [],
      chatroom: [],
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
    this.unsubscribeChatroom = await FirebaseSvc
      .getChatroomRef(this.state.selectedGroup.id)
      .onSnapshot(this.fetchChatroom);

    var user = FirebaseSvc.getCurrentUser();
    this.setState({
      user,
      photoURL: user.photoURL,
    });
  }

  componentWillUnmount() {
		this.unsubscribeGroup();
    this.unsubscribeCategory();
    this.unsubscribeChatroom();
	}

  retrieveDataGroup = async () => {
    try {
      const selectedGroup = await AsyncStorage.getItem('group');
      const item = JSON.parse(selectedGroup);
      // console.log("Item", item);
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

  _storeGroupData = async (items) => {
    try {
      var data = await AsyncStorage.setItem('groups', JSON.stringify(item));
      return data;
    }
    catch(error) {
      console.log("Error Store Data",error);
    }
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

  fetchChatroom = (querySnapshot) => {
    let chatroom = [];
    querySnapshot.forEach( (doc) => {
      chatroom.push({
        doc: doc,
        data: doc.data(),
        id: doc.id,
      });
    });

    this.setState({
      chatroom: chatroom,
      refresh: !this.state.refresh,
    });
  }

  returnData() {
    this.setState({
      refresh: !this.state.refresh
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
    this.unsubscribeChatroom();
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
  );

  // navigateToChatroom = (route) => (
  //   () => {
  //     const resetAction = StackActions.reset({
  //       index: 0,
  //       actions: [NavigationActions.navigate({ routeName: 'Chatroom' })],
  //     });
  //     this.props.navigation.dispatch(resetAction);
  //   }
  // )

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

  _renderItem2 = ({item}) => {
    let temp = [];
    if(!item.data.cid) {
      temp.push(
        <ListItem onPress={this.navigateToScreen("Chatroom")} key={item.id}>
          <Icon name="book"/>
          <Text style={styles.deactiveListItemTextIcon}>{item.data.name}</Text>
        </ListItem>
      )
    }
    return (
      temp
    )
  }

  _renderItem = ({item, index}) => {
    let temp = [];
    let chatroom = this.state.chatroom;
    temp.push(
      <ListItem
        key={item.id}
        onPress={()=>{console.log("Open Dashboard");}}
        style={chatroom.some(a=>a.data.cid === item.id) ?
          {backgroundColor: '#F0EFF5', marginLeft: 0, borderColor: '#C9C9C9'}
          :
          {backgroundColor: '#F0EFF5', marginBottom: 10, borderColor: '#C9C9C9', marginLeft: 0}
        }>
        <Left>
          <Text style={{color: '#777777', marginLeft: 16, fontSize: 10, fontFamily: 'System', textTransform: 'uppercase'}}>{item.title}</Text>
        </Left>
        <Right>
          <MaterialIcon name="add" color="#777777" onPress={()=>{this.props.navigation.navigate("CreateChatroom", {id: item.id, doc: item.doc, })}}/>
        </Right>
      </ListItem>
    );
    if(chatroom.some(a=>a.data.cid === item.id)) {
      for (var i = 0; i < chatroom.length; i++) {
        if(chatroom[i].data.cid==item.id){
          if(chatroom[i].data.private) {
            if(chatroom[i].data.members.includes(FirebaseSvc.getCurrentUser().uid)) {
              temp.push(
                <ListItem onPress={this.navigateToScreen("Chatroom")} key={chatroom[i].id}>
                  <Icon name="book"/>
                  <Text style={styles.deactiveListItemTextIcon}>{chatroom[i].data.name}</Text>
                  <Icon name="lock" color="#777777" style={{marginLeft: 3}}/>
                </ListItem>
              );
            }
          }
          else {
            temp.push(
              <ListItem onPress={this.navigateToScreen("Chatroom")} key={chatroom[i].id}>
                <Icon name="book"/>
                <Text style={styles.deactiveListItemTextIcon}>{chatroom[i].data.name}</Text>
              </ListItem>
            );
          }
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
    this.unsubscribeChatroom = await FirebaseSvc
      .getChatroomRef(this.state.selectedGroup.id)
      .onSnapshot(this.fetchChatroom);
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

  _actionSheetClick = (buttonIndex) => {
    if(buttonIndex==0) {
      this.props.navigation.navigate("Setting", {
        group: this.state.selectedGroup
      });
    }
    else if(buttonIndex==1) {
      console.log("Create Category");
    }
    else if(buttonIndex==2) {
      console.log("Create Chatroom");
    }
  }

  render() {
    const { mainDrawer } = this.state;
    var settingIcon = <Icon name="setting"/>
    var fileTreeIcon = <MaterialCommunityIcon name="file-tree" />
    var chatroomIcon = <Icon name="book"/>
    var cancelIcon = <Icon name="close"/>
    var BUTTONS = [
      {text: "Setting", icon: settingIcon},
      {text: "Create Category", icon: fileTreeIcon},
      {text: "Create Chatroom", icon: chatroomIcon},
      {text: "Close", icon: cancelIcon}
    ];
    var CANCEL_INDEX = 3;

    if(mainDrawer){
      return (
        <Container>
          <Header style={{backgroundColor: '#FFF'}}>
            <Left></Left>
            <Body>
              <Title style={{marginLeft: 5, textAlign: 'left', alignSelf: 'flex-start'}}>{this.state.selectedGroup.doc._data.name}</Title>
            </Body>
            <Right>
              <MaterialIcon
                name="more-vert"
                size={25}
                onPress={()=>
                  ActionSheet.show({
                    options: BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX,
                  }, (buttonIndex)=>{this._actionSheetClick(buttonIndex)
                  })
                }
              />
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
              data={this.state.chatroom}
              renderItem={this._renderItem2}
              extraData={this.state.refresh}
              keyExtractor={item=>item.id}
            />
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

    //If Not Select Group
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
            <Button onPress={()=>{this.props.navigation.navigate("CreateGroup", {
              returnData: this.returnData.bind(this),
            })}}>
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
