/* @flow */

import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import {
  Container,
	Header,
	Title,
	Content,
	Footer,
	FooterTab,
	Button,
	Body,
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
  Drawer,
  Toast,
} from 'native-base';
import FirebaseSvc from '../../assets/services/FirebaseSvc';
import Icon from 'react-native-vector-icons/AntDesign';

export default class Setting extends Component {
  constructor(props){
    super(props);
    this.unsubscribe = null;
    this.user = FirebaseSvc.getCurrentUser();

    this.state = {
      group: '',
      doc: '',
      uri: '',
      refresh: false,
      name: this.user.displayName,
      avatar: '',
    };
  }

  componentDidMount = async () => {
    this.user = FirebaseSvc.getCurrentUser();
  }

  componentWillUnmount = () => {

  }

  editProfile = () => {
    // this.props.navigation.navigate("EditProfile");
    if(this.state.name.length!=0) {
      let user = {
        name: this.state.name,
      }
      FirebaseSvc.createProfile(user, this.editSuccess);
    }
  }

  editSuccess = () => {
    Toast.show({
      text: "Update Success!",
      buttonText: "Okay!",
      duration: 2000
    });
  }

  logout = async () => {
    await FirebaseSvc.logout(this.logoutSuccess, this.logoutFailed);
  }

  logoutSuccess = () => {
    console.log("Logout Successful. Navigate to AuthTabs");
    Toast.show({
      text: "Logout Success!",
      buttonText: "Okay!",
      duration: 2000
    });
    this.props.navigation.navigate("AuthTabs");
  }

  logoutFailed = () => {
    alert("Logout Failed");
  }

  render() {
    return (
      <Container>
        <Header androidStatusBarColor="#1C75BC" style={{backgroundColor: "#1C75BC", borderBottomWidth: 0}}>
          <Left></Left>
          <Body stle={{flex: 3}}></Body>
          <Right></Right>
        </Header>
        <Content bounces={false}>
          <View style={{backgroundColor: "#1C75BC", justifyContent: 'center', alignItems: 'center'}}>
            <Thumbnail large source={this.user.photoURL!=null ? {uri: this.user.photoURL} : require('../../assets/images/icon.png')} />
            <Text style={{marginTop: 20, fontSize: 20, color: "#FFFFFF"}}>{this.user.displayName}</Text>
          </View>

          <List>
            <ListItem noIndent style={{backgroundColor: "#1C75BC"}}>
              <Text style={{color: "#FFFFFF"}}>Setting</Text>
            </ListItem>
            <ListItem icon onPress={()=>{this.editProfile()}}>
              <Left>
                <Icon name="user"/>
              </Left>
              <Body>
                <Text>Edit Profile</Text>
              </Body>
              <Right></Right>
            </ListItem>
            <ListItem icon onPress={()=>{this.logout()}}>
              <Left>
                <Icon name="logout"/>
              </Left>
              <Body>
                <Text>Logout</Text>
              </Body>
              <Right></Right>
            </ListItem>
          </List>
        </Content>
				<Footer style={{backgroundColor: "#1C75BC"}}>
					<FooterTab style={{backgroundColor: "#1C75BC"}}>
						<Button onPress={()=>{this.props.navigation.navigate("Groups")}}>
							<Icon name="team" color="#FFFFFF" size={20}/>
						</Button>
						{/*<Button onPress={()=>{this.props.navigation.navigate("Planner")}}>
							<Icon name="bells" color="#FFFFFF" size={20}/>
						</Button>*/}
						<Button onPress={()=>{this.props.navigation.navigate("Profile")}}>
							<Icon name="user" color="#2B3990" size={20}/>
						</Button>
					</FooterTab>
				</Footer>
      </Container>
    );
  }
}
