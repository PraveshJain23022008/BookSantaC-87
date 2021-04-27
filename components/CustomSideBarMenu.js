import React,{Component} from 'react';
import {StyleSheet,View,Text,TouchableOpacity} from 'react-native';
import {DrawerItems} from 'react-navigation-drawer';
import {Avatar} from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import firebase from 'firebase';
import db from '../config';
import axios from 'axios';

export default class CustomSideBarMenu extends Component{
//constructor(){
  //super(),
  state={
    userId:firebase.auth().currentUser.email,
    image:"#",
    name:"",
    docId:""
  //}
}
//select the picture from the Image galary
selectPicture=async()=>{
  const{canChannelSplitterNode,uri}=await ImagePicker.launchImageLibraryAsync({
mediaTypes:ImagePicker.MediaTypeOptions.All,
allowsEditing:true,
aspect:[4,3],
quality:1,
  })
  //when action is not cancelled
  if (!cancelled) {
    this.uploadImage(uri, this.state.userId);
  }
  
}

uploadImage = async (uri, imageName) => {
  var response = await fetch(uri);
  var blob = await response.blob();
  var ref=firebase.storage().ref().child("user_profiles/"+imageName);
  return ref.put(blob).then((response)=>{
    this.fetchImage(imageName);
  })

}
fetchImage=(imageName) =>{
var ref = firebase.storage().ref().child("user_profile/"+imageName)  
//get the download url
ref.getDownloadURL().then((url)=>{
  this.setState({image:url});
})
.catch((error)=>{
  this.setState({image:"#"})
})

}
getUserProfile(){
db.collection("users").where("email_id","==",this.state.userId)
.onShapshot((querySnapshot)=>{
  querySnapshot.forEach((doc)=>{
    this.setState({
      name:doc.data().first_name+" "+doc.data().last_name,
      docId: doc.id,
      image:doc.data().image
    })
  })
})
}
componentDidMount(){
  this.fetchImage(this.state.userId);
  this.getUserProfile();
}
  render(){
      return(
<View style={{ flex: 1 }}>
        <View
          style={{
            flex: 0.5,

            alignItems: "center",
            backgroundColor: "orange",
          }}
        >
          <Avatar
            rounded
            source={{
              uri: this.state.image,
            }}
            size="medium"
            onPress={() => this.selectPicture()}
            containerStyle={styles.imageContainer}
            showEditButton
          />

          <Text style={{ fontWeight: "100", fontSize: 20, paddingTop: 10 }}>
            {this.state.name}
          </Text>
        </View>

        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props} />
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity
            style={styles.logOutButton}
            onPress={() => {
              this.props.navigation.navigate("WelcomeScreen");
              firebase.auth().signOut();
            }}
          >
            <Text>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
      )
  }  
}

const styles = StyleSheet.create({
    
    drawerItemsContainer:{
      flex:0.8
    },
    logOutContainer : {
      flex:0.2,
      justifyContent:'flex-end',
      paddingBottom:30
    },
    logOutButton : {
      height:30,
      width:'100%',
      justifyContent:'center',
      padding:10
    }
})