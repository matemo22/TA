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
  Input
} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DrawerActions } from 'react-navigation';
import ViewMoreText from 'react-native-view-more-text';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import TimeAgo from 'react-native-timeago';
import FirebaseSvc from '../../assets/services/FirebaseSvc';

var BUTTONS = ["Option 0", "Option 1", "Option 2"];
export default class Notes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refresh: false,
      post: [{key:'1', id: 1, name: 'Andre', time: new Date(), like: 3, comment: 288, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sed neque lorem. Integer quis turpis est. Pellentesque luctus, elit ut iaculis fringilla, sapien mi mollis dui, et sagittis augue risus nec dolor. Mauris lobortis aliquam tempus. Duis ac mollis nulla. Sed semper et ex nec ullamcorper. Suspendisse viverra, sapien non cursus pulvinar, mi lacus mollis quam, a mollis mi ligula et magna. Ut consectetur tortor non pretium egestas. Curabitur scelerisque dignissim erat ut dignissim. Fusce ut porttitor ligula. Aenean tortor tortor, condimentum a lacus bibendum, auctor hendrerit nisi. Aliquam nec nulla imperdiet, viverra turpis vitae, vehicula orci. Aenean interdum mattis erat non convallis. Maecenas rutrum consequat gravida. Sed fringilla maximus elit, vitae consequat ipsum viverra quis. Nunc euismod lobortis fermentum.'},
             {key:'2', id: 2, name: 'Matemo', time: new Date(), like: 3, comment: 0, text: 'Test 1'}]
    }
  }

  goToPage = () => {
    this.props.navigation.navigate("Profile");
  }

  renderViewMore(onPress){return(null)}
  renderViewLess(onPress){return(null)}

  _menu=null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  _renderItem = ({item}) => {
    return (
      <Card style={{flex: 0}}>
        <CardItem header bordered>
          <Left>
            <Thumbnail
              source={{uri: 'https://cdn-images-1.medium.com/max/1600/1*t_G1kZwKv0p2arQCgYG7IQ.gif'}} />
            <Body style={{flex: 0,}}>
              <Text>{item.name}</Text>
              <Text note><TimeAgo time={item.time} interval={1000}/></Text>
            </Body>
          </Left>
          <Right>
            <Menu
              ref={this.setMenuRef}
              button={
                <Button transparent onPress={this.showMenu}>
                  <Icon
                    name={"more-horiz"}
                    size={30}
                    color="#87838B"
                  />
                </Button>
              }
            >
              <MenuItem onPress={this.hideMenu}>Edit</MenuItem>
              <MenuItem onPress={this.hideMenu}>Delete</MenuItem>
            </Menu>
          </Right>
        </CardItem>
        <CardItem bordered>
          <Body>
            <Image source={{uri: 'https://cdn-images-1.medium.com/max/1600/1*t_G1kZwKv0p2arQCgYG7IQ.gif'}} style={{height: 200, width: 200, flex: 1}}/>
            <ViewMoreText
              numberOfLines={3}
              renderViewMore={()=>{return(<Text style={{color: '#298CFB'}} onPress={()=>{this.props.navigation.navigate('DetailNotes')}}>Read More</Text>)}}
              renderViewLess={this.renderViewLess}
            >
              <Text onPress={()=>{this.props.navigation.navigate('DetailNotes')}}>
                {item.text}
              </Text>
            </ViewMoreText>
            <Grid>
              <Col>
                <Button
                  transparent
                  onPress={()=>{console.log("Like");}}
                  style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Icon name="thumb-up" />
                  <Text style={{color: '#87838B'}}>Like</Text>
                </Button>
              </Col>
              <Col>
                <Button
                  transparent
                  onPress={()=>{console.log("Comment");}}
                  style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Icon name="comment" />
                  <Text style={{color: '#87838B'}}>Comment</Text>
                </Button>
              </Col>
            </Grid>
          </Body>
        </CardItem>
        <CardItem bordered>
          <Left>
            <Icon name="thumb-up" color="#298CFB"/>
            <Text note>{item.like} likes</Text>
          </Left>
          <Right>
            <Text note>{item.comment} comments</Text>
          </Right>
        </CardItem>
      </Card>
    );
  }

  render() {
    return (
      <Container>
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
            <Text>Notes</Text>
          </Body>
          <Right>
            <Icon
              style={{marginRight: 5}}
              name={"add"}
              size={30}
              color="#298CFB"
              onPress={()=>{this.props.navigation.navigate("CreateNotes")}}
            />
          </Right>
        </Header>
        <Content>
          <FlatList
            data={this.state.post}
            extraData={this.state.refresh}
            renderItem={this._renderItem}
            keyExtractor={item => item.key}
            ref={c => (this.flatlist = c)}
          />
        </Content>
      </Container>
    );
  }
}
