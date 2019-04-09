/* @flow */

import React, { Component } from 'react';
import {
	Container,
	Header,
	Title,
	Content,
	Button,
	Body,
	Text,
	Form,
	Label,
	Item,
	Input,
	Icon,
  Grid,
  Col,
  Row,
	Left,
	Right,
} from 'native-base';
import firebase from 'react-native-firebase';
import Modal from "react-native-modal";

export default class Detail extends Component {
	static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
			header: null,
        // headerRight:
				// 	<Icon
				// 		style={{ marginRight:15,color:'#000' }}
				// 		name={'add'}
				// 		size={25}
				// 		onPress={()=>params.addPlan()}
				// 	/>
    };
	};

  constructor(props) {
		super(props);
    this.day = props.navigation.getParam('day', 'No Day');
		this.todos = firebase.firestore().collection('todos').where("date", "==", this.day.dateString);
		this.meetings = firebase.firestore().collection('meetings').where("date", "==", this.day.dateString);
		this.unsubscribeTodos = null;
		this.unsubscribeMeetings = null;

		this.state = {
			textInput: '',
			date: '',
			loading1: true,
			loading2: true,
			todos: [],
			meetings: [],
			isModalVisible: false,
			open:'',
			data: [],
		};
	}

  componentDidMount() {
		this.unsubscribeTodos = this.todos.onSnapshot(this.onCollectionTodosUpdate);
		this.unsubscribeMeetings = this.meetings.onSnapshot(this.onCollectionMeetingsUpdate);
		// this.props.navigation.setParams({ addPlan: this.addPlan });
	}

	componentWillUnmount() {
		this.unsubscribeTodos();
    this.unsubscribeMeetings();
	}

  onCollectionTodosUpdate = (querySnapshot) => {
		const todos = [];
    querySnapshot.forEach(function(doc){
      const { title, date, complete, uid } = doc.data();
      todos.push({
        key: doc.id,
        title,
        date,
        complete,
        uid,
      });
    });
    this.setState({
			todos,
			loading1: false,
		});
	}

	onCollectionMeetingsUpdate = (querySnapshot) => {
		const meetings = [];
    querySnapshot.forEach(function(doc){
      const { title, date, start, end } = doc.data();
      meetings.push({
				key: doc.id,
				doc,
				title,
				date,
				start,
				end,
			});
    });
    this.setState({
			meetings,
			loading2: false,
		});
	}

	addPlan = () => {
		this.props.navigation.navigate('CreatePlanner', {
			title: 'Create Plan',
			day: this.day,
		});
	}

	toogleModal = (open, data) => {
		this.setState({
			isModalVisible: !this.state.isModalVisible,
			open: open,
			data: data,
		});
	}

  render() {
    if(this.state.loading1 && this.state.loading2) {
      return null;
    }

    var todos = [];
    var meetings = [];
		var modal = [];
    var i=0;
		var j=0;
		var k=0;

    for (let todo of this.state.todos) {
      var complete="";
      if(todo.complete) complete = "Sudah";
      else complete = "Belum";
      todos.push(
        <Content key={i}>
          <Grid
						style={{paddingTop: 10, paddingBottom: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#9f9f9f"}}
						onPress={()=>{this.toogleModal('todo', todo)}}
						>
            <Col style={{}} size={75}>
              <Text>{ todo.title }</Text>
            </Col>
            <Col style={{}} size={25}>
              <Text style={{textAlign: 'right',}}>{ complete }</Text>
            </Col>
          </Grid>
        </Content>
      );
      i++;
    }

		for (let meeting of this.state.meetings) {
			var complete="";
      if(meeting.complete) complete = "Sudah";
      else complete = "Belum";

			meetings.push(
        <Content key={j}>
          <Grid
						style={{paddingTop: 10, paddingBottom: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#9f9f9f"}}
						onPress={()=>{this.toogleModal('meeting',meeting)}}
						>
            <Col style={{}} size={75}>
              <Text>{ meeting.title }</Text>
            </Col>
            <Col style={{}} size={25}>
              <Text style={{textAlign: 'right',}}>{ complete }</Text>
            </Col>
          </Grid>
        </Content>
      );
      j++;
		}


		if(this.state.open == 'meeting') {
			modal = [];
			modal.push(
				<Modal key={k++}
					isVisible={this.state.isModalVisible}
					style={{ margin: 0 }}
					onSwipeComplete={() => this.toogleModal()}
					swipeDirection="down"
					>
					<Container style={{backgroundColor: "#fff", padding: 10,}}>
						<Text style={{marginTop: 50}}>{this.state.data.title}</Text>
						<Button>
							<Text
								onPress={()=>{this.toogleModal()}}
								>
									Close
							</Text>
						</Button>
					</Container>
				</Modal>
			);
		}
		else if (this.state.open == 'todo'){
			modal = [];
			modal.push(
				<Modal key={k++}
					isVisible={this.state.isModalVisible}
					style={{ margin: 0 }}
					onSwipeComplete={() => this.toogleModal()}
					swipeDirection="down"
					>
					<Container style={{backgroundColor: "#fff", padding: 10,}}>
						<Text style={{marginTop: 50}}>{this.state.data.title}</Text>
						<Button>
							<Text
								onPress={()=>{this.toogleModal()}}
								>
									Close
							</Text>
						</Button>
					</Container>
				</Modal>
			);
		}

    return (
      <Container>
				<Header>
          <Left>
            <Button transparent onPress={()=>{this.props.navigation.goBack()}}>
              <Icon name='arrow-back' />
							<Text>Back</Text>
            </Button>
          </Left>
          <Body>
            <Title>Header</Title>
          </Body>
          <Right>
            <Button transparent onPress={()=>{this.addPlan()}}>
              <Icon name='add' />
            </Button>
          </Right>
        </Header>
        <Content>
						<Text style={{fontSize:36}}>Todos</Text>
	          { todos }

						<Text style={{fontSize:36, marginTop: 10}}>Meetings</Text>
						{ meetings }

						{ modal }
        </Content>
      </Container>
    );
  }
}
