/* @flow */

import React, { Component } from 'react';
import {
  Content,
  Container,
  Text,
} from 'native-base';
import FirebaseSvc from '../assets/services/FirebaseSvc';
import { YellowBox } from 'react-native';

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
      <Container>
        <Content contentContainerStyle={{justifyContent: 'center', flex: 1}}>
          <Text style={{alignSelf: 'center'}}>Logo</Text>
        </Content>
      </Container>
    );
  }
}
