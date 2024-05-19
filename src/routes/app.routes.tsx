import { BottomTabNavigationProp, createBottomTabNavigator } from "@react-navigation/bottom-tabs";


import { Exercise } from "@screens/Exercise";
import { History } from "@screens/History";
import { Home } from "@screens/Home";
import { Profile } from "@screens/Profile";
import { useTheme } from "native-base";
import { ClockCounterClockwise, House, UserCircle } from "phosphor-react-native";
import { Platform } from "react-native";

type AppRoutesType = {
  home: undefined;
  history: undefined;
  profile:undefined;
  exercise:{exerciseId:string};
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutesType> 


const {Navigator, Screen} = createBottomTabNavigator<AppRoutesType>();

export function AppRoutes(){
  const {sizes, colors} = useTheme()

  const iconSize =sizes[6];

  return(
    <Navigator screenOptions={{headerShown:false, 
    tabBarShowLabel:false, 
    tabBarActiveTintColor:colors.green[500],
    tabBarInactiveTintColor:colors.gray[200],
    tabBarStyle: {
      backgroundColor: colors.gray[600],
      borderTopWidth:0,
      height: Platform.OS === 'android' ? 'auto' : 96,
      paddingBottom: sizes[10],
      paddingTop:sizes[6]
    }
    }}>
      <Screen
      name="home"
      component={Home}
      options={{
        tabBarIcon: ({color}) => (
          <House size={30} color={color}  />
        )
      }}
      />

       <Screen
      name="history"
      component={History}
       options={{
        tabBarIcon: ({color}) => (
          <ClockCounterClockwise  size={30} color={color}  />
        )
      }}
      />

       <Screen
      name="profile"
      component={Profile}
       options={{
        tabBarIcon: ({color}) => (
          <UserCircle size={30} color={color} />
        )
      }}
      />

       <Screen
      name="exercise"
      component={Exercise}
      options={{
        tabBarButton:() => null
      }}
      />
     
    </Navigator>
  )
}