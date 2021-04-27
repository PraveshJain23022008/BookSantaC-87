  
import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {AppStackNavigator} from './AppStackNavigator';
import BookRequestScreen from '../screens/BookRequestScreen';
import BookDonateScreen from '../screens/BookDonateScreen';


export const AppTabNavigator=createBottomTabNavigator({
    DonateBook:{
        screen:BookDonateScreen,
        navigationOptions:{
tabBarIcon:<Image source={require("../assets/request-list.png")}/>,
            tabBarLabel:"Donate Books",
        }
    },
    RequestBook:{
        screen:BookRequestScreen,
        navigationOptions:{
            tabBarIconIcon:<Image source={require("../assets/request-book.png")}/>,
            tarBarLabel:"Request The Books!",
        }
    }
})