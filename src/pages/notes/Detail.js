/* @flow */

import React, { Component } from 'react';
import { Image, ScrollView, FlatList } from 'react-native';
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
  Textarea
} from 'native-base';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { DrawerActions } from 'react-navigation';
import ViewMoreText from 'react-native-view-more-text';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import TimeAgo from 'react-native-timeago';
import FirebaseSvc from '../../assets/services/FirebaseSvc';

export default class Detail extends Component {
  constructor(props) {
    super(props);
		this.unsubscribe=null;
    this.item = this.props.navigation.getParam('item', {});
		this.user = FirebaseSvc.getCurrentUser();
		console.log("item", this.item);

    this.state = {
      comments: [],
      refresh: false,
      text: '',
    }
  }

	componentDidMount = async () => {
		this.unsubscribe = await FirebaseSvc
      .getPostRef(this.item.id)
      .onSnapshot(this.fetchPost);
	}



  goToPage = () => {
    this.props.navigation.navigate("Profile");
  }


  _renderItem = ({item}) => {
    return (
      <ListItem avatar>
        <Left>
          <Thumbnail source={{ uri: item.avatar }} />
        </Left>
        <Body>
          <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
          <Text style={{fontSize: 14}}>{item.message}</Text>
          <Text note><TimeAgo time={item.time} interval={60000}/></Text>
        </Body>
      </ListItem>
    )
  }

  _onChange = (event) => {
    this.setState({ text: event.nativeEvent.text || '' });
  }

  _resetTextInput() {
    this._commentRef.clear();
    this._commentRef.resetHeightToMin();
  }

  addComment = () => {
    let tmp = this.state.comments;
    var key = tmp.length+1;
    var newComment = { key: key+"", id: 3, name: 'Matemo', message:this.state.text, avatar: 'https://cdn-images-1.medium.com/max/1600/1*t_G1kZwKv0p2arQCgYG7IQ.gif', time:new Date() }
    tmp.push(newComment);
    this.setState({
      comments: tmp,
      refresh: !this.state.refresh,
    });
    this._resetTextInput();
    // this.flatlist.scrollToEnd();
    // this.content._root.scrollToEnd();
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
              <MaterialIcon name={"chevron-left"} size={30} color="#FFFFFF"/>
              <Text style={{marginLeft: -5, color: "#FFFFFF"}}>Back</Text>
            </Button>
          </Left>
          <Body stle={{flex: 3}}>
            {/* <Text>Notes</Text> */}
          </Body>
          <Right>
          </Right>
        </Header>
        <Content
          bounces={false}
          enableResetScrollToCoords={false}
          ref={c => (this.content = c)}
        >
          <Card style={{flex: 0}}>
            <CardItem header bordered>
              <Left>
                <Thumbnail
                  source={{uri: 'https://cdn-images-1.medium.com/max/1600/1*t_G1kZwKv0p2arQCgYG7IQ.gif'}} />
                <Body>
                  <Text>NativeBase</Text>
                  <Text note>April 15, 2016</Text>
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
                <Image source={{uri: 'https://cdn-images-1.medium.com/max/1600/1*t_G1kZwKv0p2arQCgYG7IQ.gif'}} style={{height: 200, width: 200, flex: 1}}/>
                <Text onPress={()=>{this.props.navigation.navigate('DetailNotes')}}>
                  {`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at dictum sem. Cras et purus arcu. Cras dignissim ipsum ut sodales porttitor. Curabitur faucibus id lorem vitae suscipit. In et ultrices dolor. Integer magna velit, dignissim blandit feugiat eget, ultricies eu turpis. In sodales lacinia augue, ac porta purus pharetra id.
                  \nCurabitur tristique, dui sit amet accumsan tincidunt, urna lacus convallis tellus, eu porta est tellus eget dolor. Integer rhoncus, magna placerat venenatis maximus, elit ligula tristique ipsum, nec vestibulum quam lorem a arcu. Nulla at condimentum odio. Etiam condimentum dictum diam ac convallis. Suspendisse in sodales arcu. Ut non tristique massa. Curabitur rhoncus, erat eu consectetur gravida, orci lacus iaculis odio, vel ornare lacus ex vitae leo. Quisque ut odio commodo, rhoncus nisi quis, consequat magna. Integer in purus facilisis, euismod ex eget, feugiat ipsum. Pellentesque fermentum vestibulum tristique. In non dolor ligula. Aliquam volutpat, quam a semper vestibulum, dolor lacus rutrum augue, eget pulvinar est ante ac nunc. Donec posuere enim orci, id bibendum velit tempor in. Donec consequat ultricies ligula id dapibus.`}
                </Text>
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
            <CardItem bordered>
              <Left>
              </Left>
              <Right>
                <Text note>2 Comments</Text>
              </Right>
            </CardItem>
          </Card>
          <List>
            <FlatList
              data={this.state.comments}
              extraData={this.state.refresh}
              renderItem={this._renderItem}
              keyExtractor={item => item.key}
              ref={c => (this.flatlist = c)}
            />
          </List>
        </Content>
        <Footer>
          <Item regular
            style={{ width: "98%", borderLeftWidth: 0, borderRightWidth: 0, }}>
            <AutoGrowingTextInput
              // value={this.state.textValue}
              // onChange={(event) => this._onChange(event)}
              onChange={(event)=>{this._onChange(event)}}
              style={{ marginLeft: 10, width: '85%', marginRight: 10}}
              placeholder={'Write a comment...'}
              maxHeight={100}
              minHeight={20}
              enableScrollToCaret
              ref={r => {
                this._commentRef = r;
              }}
            />
            <MaterialIcon name="send" size={30} onPress={()=>{this.addComment()}}/>
          </Item>
        </Footer>
      </Container>
    );
  }
}
