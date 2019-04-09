/* @flow */

import React, { Component } from 'react';
import { FlatList } from 'react-native';
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
	Picker,
	Input,
	Left,
	Right,
	List,
	ListItem,

} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from 'react-native-modal-datetime-picker';

export default class Create extends Component {
  constructor(props) {
	  super(props);
		// this.day = props.navigation.getParam('day', 'No Day');
	  this.state = {
			isDateTimePickerVisible: false,
			catatan: '',
			judul: '',
			date: new Date(),
			dateText: '',
			hourText: '',
			friends: [{ key: "1", id: 1, name:"Tono" },
								{ key: "2", id: 2, name:"Budi" },
								{ key: "3", id: 3, name:"Andre" },
								{ key: "4", id: 4, name:"Hendro"} ],
			selectedFriendId: [],
			refresh: false,
		};
	}

	componentWillMount() {
		this._convert(this.state.date) ;
	}

	_convert = (date) => {
	    var month_names =["Jan","Feb","Mar",
	                      "Apr","May","Jun",
	                      "Jul","Aug","Sep",
	                      "Oct","Nov","Dec"];
	    var day = date.getDate();
	    var month_index = date.getMonth();
	    var year = date.getFullYear();
	    var dateText = day + "-" + month_names[month_index] + "-" + year;

			var hours = date.getHours();
			var minutes = date.getMinutes();
			var minute = "";
			var hour = "";
			if(hours<10) hour="0"+hours;
			else hour = hours;
			if(minutes<10) minute="0"+minutes;
			else minute = minutes;
			var hourText = hour+":"+minute;
			this.setState({
				dateText: dateText,
				hourText: hourText,
			})
	}

	_showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
		console.log("currDate: ", new Date());
    this._hideDateTimePicker();

		this.setState({
			date: date,
		});

		this._convert(date);
  };

	returnData(selectedFriendId) {
    this.setState({
      selectedFriendId: selectedFriendId,
      refresh: !this.state.refresh
    });
  }

	removeMember(id) {
    let tmp = this.state.selectedFriendId;

    if ( tmp.includes( id ) ) {
      tmp.splice( tmp.indexOf(id), 1 );
    } else {
      tmp.push( id );
    }

    this.setState({
      selectedFriendId: tmp,
      refresh: !this.state.refresh,
    });
  }

	_renderItem = ({item}) => {
    if(this.state.selectedFriendId.includes(item.id)) {
      return (
        <ListItem icon>
          <Left>
            <Icon name="person" size={30}/>
          </Left>
          <Body>
            <Text>{item.name}</Text>
          </Body>
          <Right>
            <Button
              transparent
              onPress={()=>this.removeMember(item.id)}>
              {/* <Icon name="remove" color="#FFF" /> */}
              <Text>Remove</Text>
            </Button>
          </Right>
        </ListItem>
      )
    }
  }

  render() {
    return (
			<Container>
        <Content>
          <Header>
            <Left>
              <Button
                transparent
                onPress={()=>{this.props.navigation.goBack()}}
              >
                <Icon name={"chevron-left"} size={30} color="#298CFB"/>
                <Text style={{marginLeft: -5}}>Back</Text>
              </Button>
            </Left>
            <Body stle={{flex: 3}}>
              <Text>Create Event</Text>
            </Body>
            <Right>
              <Button
                transparent
                onPress={()=>{console.log("Create");}}
              >
                <Text>Create</Text>
              </Button>
            </Right>
          </Header>
          <Form>
						<Item floatingLabel>
              <Label>Title</Label>
              <Input onChangeText={(judul) => this.setState({judul})}/>
            </Item>
						<Item floatingLabel onPress={this._showDateTimePicker}>
							<Label onPress={this._showDateTimePicker}>Date</Label>
							<Input disabled value={this.state.dateText+" "+this.state.hourText} onPress={this._showDateTimePicker}/>
						</Item>
						<Button
							transparent
							onPress={this._showDateTimePicker}
							style={{marginBottom: -10}}>
							<Text>Select Date</Text>
						</Button>
						<Item floatingLabel>
              <Label>Notes</Label>
              <Input onChangeText={(catatan) => this.setState({catatan})}/>
            </Item>
						<Item style={{marginTop: 20}}>
              <Label>Invite Members</Label>
              <Right>
                <Button
                  transparent
                  style={{marginRight: 15}}
                  onPress={()=>{this.props.navigation.navigate("InvitePlanner", {returnData: this.returnData.bind(this), selectedFriendId: this.state.selectedFriendId, friends: this.state.friends})}}
                >
                  <Text>Add</Text>
                </Button>
              </Right>
            </Item>
            <List>
              <ListItem icon>
                <Left>
                  <Icon name="person" size={30}/>
                </Left>
                <Body>
                  <Text>Matemo</Text>
                </Body>
                <Right>
                </Right>
              </ListItem>
              <FlatList
                data={this.state.friends}
                extraData={this.state.refresh}
                renderItem={this._renderItem}
                keyExtractor={item => item.key}
              />
            </List>
          </Form>
					<DateTimePicker
	          isVisible={this.state.isDateTimePickerVisible}
	          onConfirm={this._handleDatePicked}
	          onCancel={this._hideDateTimePicker}
						mode="datetime"
	        />
        </Content>
      </Container>
    );
  }
}
