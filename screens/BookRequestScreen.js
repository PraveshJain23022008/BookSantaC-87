import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput,KeyboardAvoidingView,TouchableOpacity,TouchableHighlight } from 'react-native';
import { ListItem,Input,SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';
import {BookSearch} from 'react-native-google-books'

export default class BookRequestScreen extends Component{
constructor(){
    super();
    this.state = {
        userId: firebase.auth().currentUser.email,
        bookName: "",
        reasonToRequest: "",
        IsBookRequestActive: "",
        requestedBookName: "",
        bookStatus: "",
        requestId: "",
        userDocId: "",
        docId: "",
        Imagelink: "#",
        dataSource: "",
        requestedImageLink: "",
        showFlatlist: false,
      };
}

createUniqueId(){
    return Math.random().toString(20).substring(10);
}

addRequest = async (bookName, reasonToRequest) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();
    var books = await BookSearch.searchbook(
      bookName,
      "AIzaSyA1tNkjnv-mTIKz-ADijLGeuxhiR3glmzw"
    );


    db.collection("requested_books").add({
      user_id: userId,
      book_name: bookName,
      reason_to_request: reasonToRequest,
      request_id: randomRequestId,
      book_status: "requested",
      date: firebase.firestore.FieldValue.serverTimestamp(),
      image_link: books.data[0].volumeInfo.imageLinks.thumbnail,
    });

    await this.getBookRequest();
    db.collection("users")
      .where("email_id", "==", userId)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            IsBookRequestActive: true,
          });
        });
      });

    this.setState({
      bookName: "",
      reasonToRequest: "",
      requestId: randomRequestId,
    });

    return Alert.alert("Book Requested Successfully");
  };

getBookRequest=()=>{
    var bookreqref=db.collection("reqquested_books").
    where("user_id","==",this.state.userId)
    .get()
    .then((snapshot)=>{
        snapshot.forEach((doc)=>{
            if(doc.data().book_status !=="received"){
                this.setState({
                    requestId:doc.data().request_id,
                    requestedBookName:doc.data().book_name,
                    bookStatus:doc.data().book_status,
                    docId: doc.id
                })
            }

        })
    })
}
getIsBookRequestActive(){
    db.collection('users')
    .where('email_id','==',this.state.userId)
    .onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.setState({
            IsBookRequestActive:doc.data().IsBookRequestActive,
            userDocId:doc.id
        })
    })
})
}

receivedBooks=(bookName)=>{
    var userId=this.state.userId
    var requestId=this.state.requestId
    db.collection("received_books").add({
        "user_id": userId,
      "book_name":bookName,
      "request_id"  : requestId,
      "bookStatus"  : "received",
    })
}

sendNotification=()=>{
    db.collection("users").where("email_id","==",this.state.userId).get()
    .then((snapshot)=>{
        snapshot.forEach((doc)=>{
            var name=doc.data().first_name
            var lastName=doc.data().last_name

            db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
            .then((snapshot)=>{
              snapshot.forEach((doc) => {
                var donorId  = doc.data().donor_id
                var bookName =  doc.data().book_name

                db.collection('all_notifications').add({
                    "targeted_user_id" : donorId,
                    "message" : name +" " + lastName + " received the book " + bookName ,
                    "notification_status" : "unread",
                    "book_name" : bookName
                })
            })

        })
    })
    })
}
componentDidMount(){
    this.getBookRequest();
    this.getIsBookRequestActive();
}
UpdateBookRequestStatus=()=>{
    //Update the bookStatus after receiving the book
    db.collection('requested_books').doc(this.state.docId)
    .update({
      book_status : 'recieved'
    })
    db.collection('users').where('email_id','==',this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        //updating the doc
        db.collection('users').doc(doc.id).update({
          IsBookRequestActive: false
        })
      })
    })
  
  
}

async getBooksFromApi(bookName) {
    this.setState({ bookName: bookName });
    if (bookName.length > 2) {
      var books = await BookSearch.searchbook(
        bookName,
        "AIzaSyA1tNkjnv-mTIKz-ADijLGeuxhiR3glmzw"
      );
      this.setState({
        dataSource: books.data,
        showFlatlist: true,
      });
    }
  }
//render Items  functionto render the books from api
renderItem = ({ item, i }) => {


    let obj = {
      title: item.volumeInfo.title,
      selfLink: item.selfLink,
      buyLink: item.saleInfo.buyLink,
      imageLink: item.volumeInfo.imageLinks,
    };

    return (
      <TouchableHighlight
        style={styles.touchableopacity}
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={() => {
          this.setState({
            showFlatlist: false,
            bookName: item.volumeInfo.title,
          });
        }}
        bottomDivider
      >
        <Text> {item.volumeInfo.title} </Text>
      </TouchableHighlight>
    );
  };

    render(){
        if(this.state.IsBookRequestActive===true){
            <View style = {{flex:1,justifyContent:'center'}}>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text>Book Name</Text>
          <Text>{this.state.requestedBookName}</Text>                   
         </View>
         <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text> Book Status </Text>
          <Text>{this.state.bookStatus}</Text>
          </View>
          <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
          onPress={()=>{
            this.sendNotification()
            this.updateBookRequestStatus();
            this.receivedBooks(this.state.requestedBookName)
          }}>
          <Text>I recieved the book </Text>
          </TouchableOpacity>
            </View>
        }else{
    return(
        <View style={{ flex: 1 }}>
        <View style={{ flex: 0.1 }}>
          <MyHeader title="Request Book" navigation={this.props.navigation} />
        </View>
        <View style={{ flex: 0.9 }}>
          <Input
            style={styles.formTextInput}
            label={"Book Name"}
            placeholder={"Book name"}
            containerStyle={{ marginTop: RFValue(60) }}
            onChangeText={(text) => this.getBooksFromApi(text)}
            onClear={(text) => this.getBooksFromApi("")}
            value={this.state.bookName}
          />
          {this.state.showFlatlist ? (
            <FlatList
              data={this.state.dataSource}
              renderItem={this.renderItem}
              enableEmptySections={true}
              style={{ marginTop: RFValue(10) }}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <View style={{ alignItems: "center" }}>
              <Input
                style={styles.formTextInput}
                containerStyle={{ marginTop: RFValue(30) }}
                multiline
                numberOfLines={8}
                label={"Reason"}
                placeholder={"Why do you need the book"}
                onChangeText={(text) => {
                  this.setState({
                    reasonToRequest: text,
                  });
                }}
                value={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={[styles.button, { marginTop: RFValue(30) }]}
                onPress={() => {
                  this.addRequest(
                    this.state.bookName,
                    this.state.reasonToRequest
                  );
                }}
              >
                <Text
                  style={styles.requestbuttontxt}
                >
                  Request
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    )
        
        }
}

}
const styles = StyleSheet.create({
    keyBoardStyle : {
      flex:1,
      alignItems:'center',
      justifyContent:'center'
    },
    formTextInput:{
      width:"75%",
      height:35,
      alignSelf:'center',
      borderColor:'#ffab91',
      borderRadius:10,
      borderWidth:1,
      marginTop:20,
      padding:10,
    },
    button:{
      width:"75%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20
      },
    }
  )