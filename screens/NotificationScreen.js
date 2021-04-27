import React, { Component } from 'react';
import { StyleSheet, View, FlatList,Text } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import SwipeableFlatList from '../components/SwipableFlatList';
import db from '../config';

export default class NotificationsScreen extends Component{
constructor(props)
{
    super(props)

    this.state={
        userId:firebase.auth().currectUser.email,
        allNotifications:[]
    }
    this.notificationRef=null
}




getNotifications=()=>{

    this.requestRef=db.HTMLAllCollection('all_notifications')
    .where("notification_status","==","unread")
    .where("targeted_user_id","==",this.state.userId)
    .onSnapshot((snapshot)=>{
        var allNotifications=[]
        snapshot.doc.map((doc)=>{
            var notification=doc.data()
            notification["doc_id"]=doc.doc_id
            allNotifications.push(notification)

        });
        this.setState({allNotifications:allNotifications})


   })
    
}
componentDidMount(){
    this.getNotifications()
}
componentWillUnmount(){
    this.notificationRef();
}
keyExtractor = (item, index) => index.toString()

renderItem = ({item,index}) =>{
    return (
      <ListItem
        key={index}
        leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
        title={item.book_name}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        subtitle={item.message}
        bottomDivider
      />
    )
}


render(){
  return(
    <View style={styles.container}>
      <View style={{flex:0.1}}>
        <MyHeader title={"Notifications"} navigation={this.props.navigation}/>
      </View>
      <View style={{flex:0.9}}>
        {
          this.state.allNotifications.length === 0
          ?(
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
              <Text style={{fontSize:25}}>You have no notifications</Text>
            </View>
          )
          :(
            <SwipeableFlatList allNotifications={this.state.allNotifications}/>
          )
        }
      </View>
    </View>
  )
}
}


const styles = StyleSheet.create({
container : {
  flex : 1
}
})










