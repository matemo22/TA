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
  ActionSheet,
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
		this.unsubscribeComment=null;
    this.item = this.props.navigation.getParam('item', {});
		this.user = FirebaseSvc.getCurrentUser();

    this.state = {
      comments: [],
			user: [],
      refresh: false,
      text: '',
    }
  }

	componentDidMount = async () => {
		this.unsubscribeComment = await FirebaseSvc
      .getCommentRef(this.item.id)
      .onSnapshot(this.fetchComment);
		this.unsubscribeUser = await FirebaseSvc
			.getAllUserRefByGId(this.item.data.gid)
			.onSnapshot(this.fetchUser);
	}

	componentWillUnmount = () => {
		this.unsubscribeComment();
	}

	fetchComment = (querySnapshot) => {
    let comments = [];
    querySnapshot.forEach( (doc) => {
      comments.push({
        doc: doc,
        data: doc.data(),
        id: doc.id,
      });
    });
    this.setState({
      comments: comments,
      refresh: !this.state.refresh,
    });
  }

	fetchUser = (querySnapshot) => {
    let user = [];
    querySnapshot.forEach( (doc) => {
      user.push({
        doc: doc,
        data: doc.data(),
        id: doc.id,
      });
    });
    this.setState({
      user: user,
      refresh: !this.state.refresh,
    });
  }

  goToPage = () => {
    this.props.navigation.navigate("Profile");
  }

  _renderItem = ({item}) => {
		let tmp = this.state.user;
    if ( tmp.some(t=>t.id==item.data.uid ) ) {
      var i = tmp.findIndex(t=>t.id == item.data.uid);
      var user = tmp[i];
			var url = user.data.photoURL;
			return (
				<ListItem avatar>
					<Left>
						{
							url != "" ?
								<Thumbnail source={{ uri: user.data.photoURL }} />
							:
							<View></View>
						}
					</Left>
					<Body>
						<Text style={{fontWeight: 'bold'}}>{user.data.displayName}</Text>
						<Text style={{fontSize: 14}}>{item.data.text}</Text>
						<Text note><TimeAgo time={item.data.createdAt} interval={60000}/></Text>
					</Body>
				</ListItem>
			)
    }
  }

  _onChange = (event) => {
    this.setState({ text: event.nativeEvent.text || '' });
  }

  _resetTextInput = () => {
    this._commentRef.clear();
    this._commentRef.resetHeightToMin();
  }

	_focusTextInput = () => {
		this._commentRef.focus();
	}

  addComment = () => {
    var comment = {
			createdAt: new Date(),
			nid: this.item.id,
			text: this.state.text,
			uid: this.user.uid,
		}
		FirebaseSvc.addComment(comment);
    this._resetTextInput();
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

  render() {
		let avatar = this.item.data.createdBy.avatar;
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
		            { avatar != "" ?
		              <Thumbnail source={{uri: avatar}} />
								:
								<View></View>
		            }
		            <Body>
		              <Text>{this.item.data.createdBy.name}</Text>
		              <Text></Text>
		              <Text note><TimeAgo time={this.item.data.createdAt} interval={1000}/></Text>
		            </Body>
		          </Left>
		          <Right>
		            <Button transparent onPress={this.user.uid == this.item.data.createdBy.uid ? this.showMenu : console.log("Pressed")}>
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
								<Text>
									{this.item.data.text}
								</Text>
		            <Grid>
		              <Col>
		                <Button
		                  transparent
											onPress={()=>{this._focusTextInput()}}
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
                <Text note>{this.state.comments.length} Comment{this.state.comments.length>1 ? "s" : ""}</Text>
							</Right>
            </CardItem>
          </Card>
					<FlatList
            data={this.state.comments}
            extraData={this.state.refresh}
            renderItem={this._renderItem}
            keyExtractor={item => item.id}
          />
        </Content>
        <Footer style={{backgroundColor:"#1C75BC"}}>
          <Item regular
            style={{ width: "98%", borderLeftWidth: 0, borderRightWidth: 0, }}>
            <AutoGrowingTextInput
              onChange={(event)=>{this._onChange(event)}}
              style={{ marginLeft: 10, width: '85%', marginRight: 10, color: "#FFFFFF"}}
              placeholder={'Write a comment...'}
							placeholderTextColor="#FFFFFF"
              maxHeight={100}
              minHeight={20}
              enableScrollToCaret
              ref={r => {
                this._commentRef = r;
              }}
            />
            <MaterialIcon name="send" size={30} color="#FFFFFF" onPress={()=>{this.addComment()}}/>
          </Item>
        </Footer>
      </Container>
    );
  }
}
