import React, { Component} from 'react';
import { Header,Icon,Badge } from 'react-native-elements';
import { View, Text, StyeSheet ,Alert} from 'react-native';



export default class MYHeader extends Component{
constructor(props){
    super(props);
    this.state={
        value:""
    }
}

getNumberOfUnreadNotifications(){
db.collection("all_notifications").where("notification_status",'==',"unread")
.onSnapshot((snapshot)=>{
    var unreadNotifications=snapshot.docs.map((docs)=>doc.data())
    this.setState({
        value:unreadNotifications.length
    })
})
}
componentDidMount(){
    this.getNumberOfUnreadNotifications();
}
 BellIconWithBadge=()=>{
return(
<View>
<Icon name="bell" type="font-awesome" color="yellow" size={25} onPress={()=>props.navigation.navigate("notification")} />
<Badge value={this.state.value} containerStyle={{ position: 'absolute', top: -4, right: -4 }}/>
   
    </View>
)
}





render(){
    return(
    <Header
    leftComponent={<Icon name="bars" type="font-awesome" color="orange" onPress={()=> props.navigation.toggleDrawer()}/>}
    centerComponent={{text:props.title,style:{color:"Black",fontSize:20,fontWeight:"bold",}}}
    rightComponent={<BellIconWithBadge{...props}/>}
    backgroundColor="#eaf8fe"/>
    )
}

}