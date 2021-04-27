import * as React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {AppTabNavigator} from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingScreen from "../screens/SettingScreen";
import NotificationsScreen from '../screens/NotificationScreen'
 
export const AppDrawerNavigator= createDrawerNavigator({
     Home:{
         screen:AppTabNavigator
     },
     MyDonations:{
         screen: MyDonationScreen
     },
     Notification:{
         screen: NotificationsScreen
     },
     Setting:{
         screen:SettingScreen
     },
    },
     {
         contentComponent: CustomSideBarMenu
     },
     {
         intitialRouteName: 'Home'
     }
 )