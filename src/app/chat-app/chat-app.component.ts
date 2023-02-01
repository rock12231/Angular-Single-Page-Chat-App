import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-chat-app',
  templateUrl: './chat-app.component.html',
  styleUrls: ['./chat-app.component.css']
})
export class ChatAppComponent implements OnInit {

  // itemRef: AngularFireObject<any>;
  // item: Observable<any>;
  data = {
    "users": {
      "user_id_1": {
        "username": "User 1",
        "email": "user1@example.com"
      },
      "user_id_2": {
        "username": "User 2",
        "email": "user2@example.com"
      }
    },
    "chats": {
      "chat_id_1": {
        "user_id_1": "user_id_1",
        "user_id_2": "user_id_2",
        "messages": {
          "message_id_1": {
            "sender_id": "user_id_1",
            "text": "Hello User 2!",
            "timestamp": 1609472400
          },
          "message_id_2": {
            "sender_id": "user_id_2",
            "text": "Hi User 1!",
            "timestamp": 1609472500
          }
        }
      }
    }
  }


  userlist: any
  username: any
  lastseen: any

  selectchat:boolean = false

  currentUser: any
  result: any
  chatref: any
  chatlist: any

  imgList: any = [
    {img1:"https://bootdey.com/img/Content/avatar/avatar1.png"},
    {img2:"https://bootdey.com/img/Content/avatar/avatar2.png"},
    {img3:"https://bootdey.com/img/Content/avatar/avatar3.png"},
    {img4:"https://bootdey.com/img/Content/avatar/avatar4.png"},
    {img5:"https://bootdey.com/img/Content/avatar/avatar5.png"},
    {img6:"https://bootdey.com/img/Content/avatar/avatar6.png"},
    {img7:"https://bootdey.com/img/Content/avatar/avatar7.png"},
    {img8:"https://bootdey.com/img/Content/avatar/avatar8.png"}
  ]

  constructor(public db: AngularFireDatabase, public authService: AuthService) {
    // this.itemRef = db.object('title');
    // this.item = this.itemRef.valueChanges();
    // console.log(this.item);
    // this.itemRef = this.db.object('Chat/')
    // this.itemRef.update(this.data)

    // Get Logged in user
    var user = JSON.parse(localStorage.getItem('user')!)
    this.currentUser = user.email
    console.log(this.currentUser, "current user")

    var ref = this.db.database.ref("Users/List");

    // Retrieve the chat user list
    ref.on("value", snapshot => {
      console.log(snapshot.val());
      this.userlist = Object.values(snapshot.val());
      this.result = this.userlist.filter((obj: { user: any; }) => obj.user === this.currentUser)[0]
      console.log(this.result.Created);
    });

  }

  ngOnInit(){}  

  openchat(user: any, lastseen: any) {
    this.selectchat = true
    this.username = user
    var chatname = "Chat" + (Number(this.result.Created) + Number(lastseen))
    console.log(chatname, "chatname")
    var ref = this.db.database.ref("Chats/List/" + chatname)
    ref.update({
      "User1": this.currentUser,
      "User2": this.username,
      "lastseen": Date.now().toString(),
    })

    this.chatref = this.db.database.ref("Chats/List/" + chatname + "/Messages")
    this.chatref.on("value", (snapshot: { val: () => { [s: string]: unknown; } | ArrayLike<unknown>; }) => {
      console.log(snapshot.val());
      this.chatlist = Object.values(snapshot.val());
      console.log(this.chatlist);
    });

  }

  sendMessage(message: any) {
    this.chatref.push({
      "sender": this.currentUser,
      "message": message,
      "Created": Date.now().toString()
    })
  }

}
