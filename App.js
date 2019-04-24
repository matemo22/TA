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
import CreateGroup from './src/pages/CreateGroup';
import JoinGroup from './src/pages/JoinGroup';

import Dashboard from './src/pages/Dashboard';
import GroupList from './src/pages/bottom_tab_navigator/GroupList';
import Profile from './src/pages/Profile';

//##Group
import CategoryChatroom from './src/pages/group/CategoryChatroom';

//##EventTodos
import EventTodos from './src/pages/event_todo/EventTodos';
import CreateEvent from './src/pages/event_todo/CreateEvent';
import CreateTodo from './src/pages/event_todo/CreateTodo';

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
import Chatroom from './src/pages/group/chatroom/Chatroom';
import CreateChatroom from './src/pages/group/CreateChatroom';
import CreateCategory from './src/pages/group/CreateCategory';
import CreateChatroomUn from './src/pages/group/CreateChatroomUn';

//##Settings
import Setting from './src/pages/group/settings/Setting';
import EditGroup from './src/pages/group/settings/EditGroup';
import Category from './src/pages/group/settings/Category';
import EditCategory from './src/pages/group/settings/EditCategory';
import EditChatroom from './src/pages/group/settings/EditChatroom';
import EditChatroomUn from './src/pages/group/settings/EditChatroomUn';
import Members from './src/pages/group/settings/Members';
import EditMember from './src/pages/group/settings/EditMember';
import Role from './src/pages/group/settings/Role';
import CreateRole from './src/pages/group/settings/CreateRole';
import EditRole from './src/pages/group/settings/EditRole';
import InvitationCode from './src/pages/group/settings/InvitationCode';
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

const SettingStackNavigator = createStackNavigator({
  Setting: {
    screen: Setting,
  },
  EditGroup: {
    screen: EditGroup,
  },
  Category: {
    screen: Category,
  },
  EditCategory: {
    screen: EditCategory,
  },
  EditChatroom: {
    screen: EditChatroom,
  },
  EditChatroomUn: {
    screen: EditChatroomUn,
  },
  Members: {
    screen: Members,
  },
  EditMember: {
    screen: EditMember,
  },
  Role: {
    screen: Role,
  },
  CreateRole: {
    screen: CreateRole,
  },
  EditRole: {
    screen: EditRole,
  },
  InvitationCode: {
    screen: InvitationCode,
  }
}, {
  defaultNavigationOptions: ({navigation}) => {
    return {
      header: null
    }
  }
});

const GroupStack = createStackNavigator({
  CategoryChatroom: {
    screen: CategoryChatroom,
  },
  CreateChatroom: {
    screen: CreateChatroom,
  },
  CreateChatroomUn: {
    screen: CreateChatroomUn,
  },
  CreateCategory: {
    screen: CreateCategory,
  },
  Chatroom: {
    screen: Chatroom,
  },
  Notes: {
    screen: NotesStack,
  },
  Setting: {
    screen: SettingStackNavigator,
  },
}, {
  defaultNavigationOptions: ({navigation}) => {
    return {
      header: null,
    }
  },
  transitionConfig: () => ({
    transitionSpec: {
      duration: 0,  // Set the animation duration time as 0 !!
    },
  }),
});

const EventStack = createStackNavigator({
  EventTodos: {
    screen: EventTodos,
  },
  CreateEvent: {
    screen: CreateEvent,
  },
  CreateTodo: {
    screen: CreateTodo,
  },
  Notes: {
    screen: NotesStack,
  },
}, {
  defaultNavigationOptions: ({navigation}) => {
    return {
      header: null,
    }
  },
  transitionConfig: () => ({
    transitionSpec: {
      duration: 0,  // Set the animation duration time as 0 !!
    },
  }),
});

GroupStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
};

const GroupBottomNavigator = createBottomTabNavigator({
  Chatroom: {
    screen: GroupStack,
  },
  Dashboard: {
    screen: EventStack,
  },
});

const GroupListStack = createStackNavigator({
  GroupList: {
    screen: GroupList,
  },
  CreateGroup: {
    screen: CreateGroup,
  },
  JoinGroup: {
    screen: JoinGroup,
  },
  Group: {
    screen: GroupBottomNavigator,
  },
}, {
  defaultNavigationOptions: ({navigation}) => {
    return {
      header: null,
    }
  },
  transitionConfig: () => ({
    transitionSpec: {
      duration: 0,  // Set the animation duration time as 0 !!
    },
  }),
});

GroupListStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
};

const AppBottomNavigator = createBottomTabNavigator({
  Groups: {
    screen: GroupListStack,
  },
  Profile: {
    screen: Profile,
  },
}, {
  initialRouteName: 'Groups'
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
    AppBottomNavigator: {
      screen: AppBottomNavigator,
    },
    // AppDrawerNavigator: {
    //   screen: AppDrawerNavigator,
    // },
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
