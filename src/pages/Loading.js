/* @flow */

import React, { Component } from 'react';
import {
  Content,
  Container,
  Text,
	Header,
} from 'native-base';
import FirebaseSvc from '../assets/services/FirebaseSvc';
import { YellowBox, Image } from 'react-native';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

export default class Loading extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount = async () => {
    setTimeout(()=>{
        this._authCheck();
      },
      1*1000
    );
  }

  _authCheck = async () => {
    const user = await FirebaseSvc.getCurrentUser();
    this.props.navigation.navigate(user ? (user.displayName ? 'AppBottomNavigator' : 'NewUser') : 'AuthTabs');
  }

  render() {
    return (
      <Container style={{backgroundColor: "#1C75BC"}}>
				<Header androidStatusBarColor="#1C75BC" style={{display:'none'}}>
				</Header>
        <Content contentContainerStyle={{justifyContent: 'center', flex: 1}}>
          <Image
            source={require('../assets/images/logo-white.png')}
            style={{width: "40%", height: "20%", alignSelf: 'center'}}
          />
        </Content>
      </Container>
    );
  }
}
