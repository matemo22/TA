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
  Grid,
  Col,
  Row,
  Form,
  Item,
  Input,
  ActionSheet,
  Picker,
} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { NavigationActions } from 'react-navigation';
import ViewMoreText from 'react-native-view-more-text';
import TimeAgo from 'react-native-timeago';
import FirebaseSvc from '../../assets/services/FirebaseSvc';

export default class Notes extends Component {
  constructor(props) {
    super(props);
    this.unsubscribeNotes = null;
    this.unsubscribeCategory = null;
    this.group = this.props.navigation.getParam('group', '');
    this.state = {
      refresh: false,
      selectedCategory: "",
      // post: [{key:'1', id: 1, name: 'Andre', time: new Date(), like: 3, comment: 288, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sed neque lorem. Integer quis turpis est. Pellentesque luctus, elit ut iaculis fringilla, sapien mi mollis dui, et sagittis augue risus nec dolor. Mauris lobortis aliquam tempus. Duis ac mollis nulla. Sed semper et ex nec ullamcorper. Suspendisse viverra, sapien non cursus pulvinar, mi lacus mollis quam, a mollis mi ligula et magna. Ut consectetur tortor non pretium egestas. Curabitur scelerisque dignissim erat ut dignissim. Fusce ut porttitor ligula. Aenean tortor tortor, condimentum a lacus bibendum, auctor hendrerit nisi. Aliquam nec nulla imperdiet, viverra turpis vitae, vehicula orci. Aenean interdum mattis erat non convallis. Maecenas rutrum consequat gravida. Sed fringilla maximus elit, vitae consequat ipsum viverra quis. Nunc euismod lobortis fermentum.'},
      //        {key:'2', id: 2, name: 'Matemo', time: new Date(), like: 3, comment: 0, text: 'Test 1'}]
      post: [],
    }
  }

  componentDidMount = async () => {
    this.unsubscribeCategory = await FirebaseSvc
      .getCategoryRef(this.group.id)
      .onSnapshot(this.fetchCategory);
    this.unsubscribeNotes = await FirebaseSvc
      .getNotesRef(this.group.id)
      .onSnapshot(this.fetchNotes);
  }

  componentWillUnmount = () => {
    this.unsubscribe();
  }

  fetchNotes = (querySnapshot) => {
    let post = [];
    querySnapshot.forEach( (doc) => {
      post.push({
        doc: doc,
        data: doc.data(),
        id: doc.id,
      });
    });
    this.setState({
      post: post,
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

  showMenu = (item) => {
    var BUTTONS = ["Edit", "Delete", "Cancel"];
    var DESTRUCTIVE_INDEX = 1;
    var CANCEL_INDEX = 2;
    ActionSheet.show(
    {
      options: BUTTONS,
      destructiveButtonIndex: DESTRUCTIVE_INDEX,
      cancelButtonIndex: CANCEL_INDEX,
    },
    (buttonIndex) => {
      if(buttonIndex == 0) {
        this.props.navigation.navigate("CreateNotes", {item: item});
      }
      else if(buttonIndex == 1) {
        console.log("Delete Notes");
      }
    });
  }

  _renderItem = ({item}) => {
    let avatar = item.data.createdBy.avatar;
    return (
      <Card style={{flex: 0}}>
        <CardItem header bordered>
          <Left>
            { avatar != "" ?
              <Thumbnail source={{uri: avatar}} />
              :
              <View></View>
            }
            <Body>
              <Text>{item.data.createdBy.name}</Text>
              <Text></Text>
              <Text note><TimeAgo time={item.data.createdAt} interval={1000}/></Text>
            </Body>
          </Left>
          <Right>
            <Button transparent onPress={this.showMenu}>
              <MaterialIcon
                name={"more-horiz"}
                size={30}
                color="#87838B"
              />
            </Button>
          </Right>
        </CardItem>
        <CardItem bordered>
          <Body>
            <ViewMoreText
              numberOfLines={3}
              renderViewMore={()=>{return(<Text style={{color: '#298CFB'}} onPress={()=>{this.props.navigation.navigate('DetailNotes', {item: item})}}>Read More</Text>)}}
            >
              <Text onPress={()=>{this.props.navigation.navigate('DetailNotes', {item: item})}}>
                {item.data.text}
              </Text>
            </ViewMoreText>
            <Grid>
              <Col>
                <Button
                  transparent
                  onPress={()=>{this.props.navigation.navigate('DetailNotes', {item: item})}}
                  style={{justifyContent: 'center', alignItems: 'center'}}>
                  <MaterialIcon name="comment" />
                  <Text style={{color: '#87838B'}}>Comment</Text>
                </Button>
              </Col>
            </Grid>
          </Body>
        </CardItem>
      </Card>
    );
  }

  onPickerCategoryChange = (id) => {
    let value = this.state.category.find(item => item.id === id);
    if(!value) {
      value = {empty: true};
    }
    let availableRole = [];
    let role = [];
    let exist = false;
    if(value.empty) {
      exist = false;
    }
    else {
      exist = (value.data.roles.length != 0);
    }
    for (var i = 0; i < this.state.role.length; i++) {
      if(exist && value.data.roles.includes(this.state.role[i].id)) {
        availableRole.push(this.state.role[i]);
      }
      role.push(this.state.role[i]);
    }
    this.setState({
      selectedCategory: value,
      selectedCategoryId: id,
      availableRole: exist ? availableRole : role,
    });

  }

  render() {
    return (
      <Container>
        <Header androidStatusBarColor="#1C75BC" style={{backgroundColor: "#1C75BC", borderBottomColor: "transparent"}}>
          <Left>
            <Button transparent>
              <Icon
                color="#FFFFFF"
                style={{marginLeft: 10}}
                name={"left"}
                size={25}
                onPress={()=>{this.props.navigation.dispatch(NavigationActions.back())}}
              />
            </Button>
          </Left>
          <Body stle={{flex: 3}}>
            <Text style={{color: "#FFFFFF"}}>{this.group.data.name}'s Notes</Text>
          </Body>
          <Right>
            <Text style={{color: "#FFFFFF"}}>Add</Text>
          </Right>
        </Header>
        <Content>
          <ListItem noIndent style={{backgroundColor: "#F8F8F8"}}>
            <Picker
              mode="dropdown"
              iosHeader="Select Category"
              iosIcon={<Icon name="down" />}
              selectedValue={this.state.selectedCategory}
              onValueChange={this.onPickerCategoryChange.bind(this)}>
            >
              <Picker.Item label="Select Category" value=""/>
              <Picker.Item label="Wallet" value="key0" />
              <Picker.Item label="ATM Card" value="key1" />
              <Picker.Item label="Debit Card" value="key2" />
              <Picker.Item label="Credit Card" value="key3" />
              <Picker.Item label="Net Banking" value="key4" />
            </Picker>
          </ListItem>
          <FlatList
            data={this.state.post}
            extraData={this.state.refresh}
            renderItem={this._renderItem}
            keyExtractor={item => item.id}
          />
        </Content>
      </Container>
    );
  }
}
