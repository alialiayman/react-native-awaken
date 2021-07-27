import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Contacts from "./src/features/contacts";
import Settings from "./src/features/settings";

const Tab = createBottomTabNavigator();
const BottomNavigation = ({ navigation }) => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Contacts" component={Contacts} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
