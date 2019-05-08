/* @flow */

import React, { Component } from 'react';
import { View, AsyncStorage, FlatList, TouchableOpacity } from 'react-native';
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
  ActionSheet,
} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { DrawerActions } from 'react-navigation';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import FirebaseSvc from '../../assets/services/FirebaseSvc';
import { Col, Row, Grid } from "react-native-easy-grid";

export default class GroupList extends Component {
  constructor(props) {
    super(props);
    this.unsubscribeGroup = null;

    this.state={
      refresh: false,
      groups: [],
      selectedGroup: '',
    }
  }

  formatData = (data, numColumns) => {
    data.push({
      empty: 1,
    });
    const numberOfFullRow = Math.floor(data.length / numColumns);
    let numberOfElementLastRow = data.length - (numberOfFullRow * numColumns);

    while(numberOfElementLastRow !== numColumns && numberOfElementLastRow !== 0) {
      data.push({
        empty: 2,
      });
      numberOfElementLastRow=numberOfElementLastRow+1;
    }
    return data;
  }

  componentDidMount = async () => {
    this.unsubscribeGroup = await FirebaseSvc
      .getGroupRef()
      .onSnapshot(this.fetchGroup);
  }

  componentWillUnmount = () => {
    this.unsubscribeGroup();
  }

  fetchGroup = async (querySnapshot) => {
    let groups = [];
    querySnapshot.forEach( (doc) => {
      groups.push({
        doc: doc,
        data: doc.data(),
        id: doc.id,
        empty: 0,
      });
    });
    this.setState({
      groups: groups,
      refresh: !this.state.refresh,
    });
  }

  _renderGroup = ({item}) => {
    if(item.empty == 0){
      return (
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 20,
          paddingBottom: 20,
        }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}
            onPress={()=>{
              this.props.navigation.navigate("Group", {group: item});}}>
            <Thumbnail
              small
              source={item.data.photoURL ? {uri:item.data.photoURL} : require('../../assets/images/icon.png')} />
            <Text
              style={{textAlign:'center', marginTop: 10}}>
              {item.data.name}
            </Text>
          </TouchableOpacity>
        </View>
      )
    }
    else if(item.empty == 1){
      var BUTTONS = ["Create Group", "Join Group", "Cancel"];
      var CANCEL_INDEX = 2;
      return(
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 20,
          paddingBottom: 20,
        }}>
          <View
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <Button
							style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
							}}
							transparent
              onPress={()=>
								ActionSheet.show({
									options: BUTTONS,
									cancelButtonIndex: CANCEL_INDEX,
								}, (buttonIndex)=>{
									if(buttonIndex==0) {
										this.props.navigation.navigate("CreateGroup");
									}
									if(buttonIndex==1) {
										this.props.navigation.navigate("JoinGroup");
									}
									// this._actionSheetClick(buttonIndex)
								})
							}>
              <Icon name="plus" size={20}/>
              <Text style={{textAlign:'center', marginTop: 4, color: "#1C75BC"}}>Add Group</Text>
            </Button>
          </View>
        </View>
      )
    }
    else {
      return(
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 20,
          paddingBottom: 20,
        }}>
        </View>
      )
    }
  }

  render() {
    return (
      <Container>
        <Header androidStatusBarColor="#1C75BC" style={{backgroundColor: "#1C75BC", borderWidth: 0}}>
          <Left></Left>
          <Body stle={{flex: 3}}>
            <Text style={{color: "#FFFFFF"}}>Groups</Text>
          </Body>
          <Right>
          </Right>
        </Header>
        <Content bounces={false}>
          <FlatList
            data={this.formatData(this.state.groups, 3)}
            extraData={this.state.refresh}
            renderItem={this._renderGroup}
            numColumns={3}
            keyExtractor={(item, index) => item.id}
          />
        </Content>
				<Footer style={{backgroundColor: "#1C75BC"}}>
					<FooterTab style={{backgroundColor: "#1C75BC"}}>
						<Button onPress={()=>{this.props.navigation.navigate("Groups")}}>
							<Icon name="team" color="#2B3990" size={20}/>
						</Button>
						{/*<Button onPress={()=>{this.props.navigation.navigate("Planner")}}>
							<Icon name="bells" color="#FFFFFF" size={20}/>
						</Button>*/}
						<Button onPress={()=>{this.props.navigation.navigate("Profile")}}>
							<Icon name="user" color="#FFFFFF" size={20}/>
						</Button>
					</FooterTab>
				</Footer>
      </Container>
    )
  }
}
