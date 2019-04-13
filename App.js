/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
  DrawerActions,
} from 'react-navigation';
import { Root, Button, Text } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';

//StackNavigator
import Loading from './src/pages/Loading';
import Login from './src/pages/auth/Login';
import SignUp from './src/pages/auth/SignUp';
import NewUser from './src/pages/auth/NewUser';
import Home from './src/pages/Home';
import Dashboard from './src/pages/Dashboard';
import CreateGroup from './src/pages/CreateGroup';
//##TabNavigator
//->Planner
import Planner from './src/pages/planner/Planner';
import DetailPlanner from './src/pages/planner/Detail';
import CreatePlanner from './src/pages/planner/Create';
import InvitePlanner from './src/pages/planner/Invite';
//->Absen
import Absen from './src/pages/absen/Absen';
import DetailAbsen from './src/pages/absen/Detail';
import CreateAbsen from './src/pages/absen/Create';
import InviteAbsen from './src/pages/absen/Invite';
//->FileManagement
import FileManagement from './src/pages/file_management/FileManagement';
//->Notes
import Notes from './src/pages/notes/Notes';
import DetailNotes from './src/pages/notes/Detail';
import CreateNotes from './src/pages/notes/Create';
//->Evaluasi
import Evaluation from './src/pages/evaluation/Evaluation';
//->Vote
import Vote from './src/pages/vote/Vote';
//->Registration Form
import RegistrationForms from './src/pages/registration_forms/RegistrationForms';

//##Drawer
import drawerMenuComponents from './src/assets/components/drawerMenuComponents';
import Chatroom from './src/pages/chatroom/Chatroom';
import CreateChatroom from './src/pages/chatroom/CreateChatroom';
import Profile from './src/pages/drawer/Profile';

//##Settings
import Setting from './src/pages/drawer/settings/Setting';
import EditGroup from './src/pages/drawer/settings/EditGroup';
import Category from './src/pages/drawer/settings/Category';
//->Statistic
import Statistic from './src/pages/drawer/Statistic';
//->Achievement
import Achievement from './src/pages/drawer/Achievement';

const PlannerStack = createStackNavigator({
  Planner: {
    screen: Planner,
    navigationOptions: ({navigation}) => {
      return {
        header: null,
      }
    }
  },
  DetailPlanner: {
    screen: DetailPlanner,
  },
  CreatePlanner: {
    screen: CreatePlanner,
    navigationOptions: ({navigation}) => {
      return {
        header: null,
      }
    }
  },
  InvitePlanner: {
    screen: InvitePlanner,
    navigationOptions: ({navigation}) => {
      return {
        header: null,
      }
    }
  }
}, {
  defaultNavigationOptions: {
    gesturesEnabled: false
  }
});

const AbsenStack = createStackNavigator({
  Absen: {
    screen: Absen,
    navigationOptions: ({navigation}) => {
      return {
        header: null,
        // headerTitle: 'Absen',
        // headerLeft: (
        //   <Icon
        //     style={{marginLeft: 15}}
        //     name={"menu"}
        //     size={30}
        //     color="#298CFB"
        //     onPress={()=>{navigation.dispatch(DrawerActions.toggleDrawer());}}
        //   />
        // ),
        // headerRight: (
        //   <Icon
        //     style={{marginRight: 15}}
        //     name={"add"}
        //     size={30}
        //     color="#298CFB"
        //     onPress={()=>{navigation.navigate("CreateAbsen")}}
        //   />
        // )
      }
    }
  },
  DetailAbsen: {
    screen: DetailAbsen,
    navigationOptions: ({navigation}) => {
      return {
        header: null,
      }
    }
  },
  CreateAbsen: {
    screen: CreateAbsen,
    navigationOptions: ({navigation}) => {
      return {
        header: null,
      }
    }
  },
  InviteAbsen: {
    screen: InviteAbsen,
    navigationOptions: ({navigation}) => {
      return {
        header: null,
      }
    }
  }
}, {
  defaultNavigationOptions: {
    gesturesEnabled: false
  }
});

const NotesStack = createStackNavigator({
  Notes: {
    screen: Notes,
    navigationOptions: ({navigation}) => {
      return {
        header: null,
      }
    },
  },
  DetailNotes: {
    screen: DetailNotes,
    navigationOptions: ({navigation}) => {
      return {
        header: null,
      }
    },
  },
  CreateNotes: {
    screen: CreateNotes,
    navigationOptions: ({navigation}) => {
      return {
        header: null,
        tabBarVisible: false,
      }
    },
  },
}, {
  defaultNavigationOptions: {
    gesturesEnabled: false
  }
});

NotesStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  }
}

const HomeTabNavigator = createBottomTabNavigator({
  //Paling atas = first page
    Notes: NotesStack,
    Planner: PlannerStack,
    Absen: AbsenStack,
    Evaluation: Evaluation,
    Vote: Vote,
    RegistrationFroms: RegistrationForms,
  }, {
    navigationOptions: ({navigation}) => {
      const {routeName} = navigation.state.routes[navigation.state.index];
      return {
        header: null,
        headerTitle: routeName,
      }
    },
  });

const HomeStackNavigator = createStackNavigator({
      // HomeTabNavigator: HomeTabNavigator,
      Dashboard: {
        screen: Dashboard,
        navigationOptions: ({navigation}) => {
          return {
            header: null,
          }
        },
      },
      CreateGroup: {
        screen: CreateGroup,
        navigationOptions: ({navigation}) => {
          return {
            header: null,
          }
        }
      },
    }, {
      defaultNavigationOptions: ({navigation}) => {
        return {
          headerLeft: (
            <Icon
              style={{marginLeft: 15}}
              name="menu"
              onPress={()=>{navigation.dispatch(DrawerActions.toggleDrawer());}}
            />
          ),
          gesturesEnabled: false,
        }
      }
    }
  );

const ChatroomStackNavigator = createStackNavigator({
  Chatroom: {
    screen: Chatroom,
  },
}, {
  defaultNavigationOptions: ({navigation}) => {
    return {
      header: null,
    }
  }
});

const ProfileStackNavigator = createStackNavigator({
  Profile: {
    screen: Profile,
  },
}, {
  defaultNavigationOptions: ({navigation}) => {
    return {
      headerLeft: (
        <Icon
          style={{marginLeft: 15}}
          name="menu"
          onPress={()=>{navigation.dispatch(DrawerActions.toggleDrawer());}}
        />
      )
    }
  }
});

const SettingStackNavigator = createStackNavigator({
  Setting: {
    screen: Setting,
  },
  EditGroup: {
    screen: EditGroup,
  },
  Category: {
    screen: Category,
  }
}, {
  defaultNavigationOptions: ({navigation}) => {
    return {
      header: null
    }
  }
});

//Ubah Custom Drawer
const AppDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: HomeStackNavigator,
  },
  // Setting: {
  //   screen: Setting,
  // },
  // EditGroup: {
  //   screen: EditGroup,
  // },
  Setting: {
    screen: SettingStackNavigator,
  },
  Chatroom: {
    screen: ChatroomStackNavigator,
  },
  CreateChatroom: {
    screen: CreateChatroom,
  },
  Profile: {
    screen: ProfileStackNavigator,
  },
  // Statistic: {
  //   screen: Statistic,
  // },
  // Achievement: {
  //   screen: Achievement,
  // },
}, {
  contentComponent: drawerMenuComponents,
  // mode: Platform.OS === 'ios' ? 'modal' : 'card',
});

const AuthTabs = createStackNavigator({
    Login: Login,
    SignUp: {
      screen: SignUp,
      navigationOptions: ({navigation}) => {
        return {
          header: null,
        }
      }
    },
    NewUser: {
      screen: NewUser,
      navigationOptions: ({navigation}) => {
        return {
          header: null,
          gesturesEnabled: false
        }
      }
    },
  }
);

const RootSwitch = createSwitchNavigator({
    Loading: {
      screen: Loading,
    },
    AppDrawerNavigator: {
      screen: AppDrawerNavigator,
    },
    AuthTabs: {
      screen: AuthTabs,
    },
  },{
    initialRouteName: 'Loading'
  }
);

const AppContainer = createAppContainer(RootSwitch);

export default class App extends React.Component {
  render() {
    return (
      <Root>
        <AppContainer />
      </Root>
    );
  }
}
