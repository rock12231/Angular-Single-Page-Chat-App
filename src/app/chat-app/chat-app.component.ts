import { Component, ChangeDetectorRef, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { AuthService } from '../shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-app',
  templateUrl: './chat-app.component.html',
  styleUrls: ['./chat-app.component.css']
})
export class ChatAppComponent implements OnInit {

  @ViewChild('message') message: ElementRef|any

  Placeholder:any = "Type a message..."
  userlist: any
  Username: any
  Lastseen: any
  img:any
  Created: any

  // sender: any={
  //   "Username": "user_name",
  // }

  selectchat:boolean = false

  currentUser: any
  result: any
  chatref: any
  chatlist: any
  getdata:any
  ids: string[] = [];
  items:any
  constructor(public db: AngularFireDatabase,
              public authService: AuthService, 
              private http: HttpClient,
              private cdref: ChangeDetectorRef,
              public storage: AngularFireStorage,
              router: Router 
              ) {
    // Get Logged in user

    if (JSON.parse(localStorage.getItem('user')!).uid === null) {
      router.navigate(['login']);
    }

    var user = JSON.parse(localStorage.getItem('user')!)
    this.currentUser = user.email
    // console.log(user, "user")
    // console.log(this.currentUser, "current user")
   
    // this.http.get('https://chat-e2390-default-rtdb.firebaseio.com/Users/List').subscribe(data => {
    //   this.getdata = data;
    //   console.log(this.getdata);
    // });
    
    // Retrive Users data
    var re = this.db.database.ref("Users/List")
    re.on("value", snapshot => {
      // console.log(snapshot.val());
      this.userlist = Object.values(snapshot.val());
      // console.log(this.userlist,"All users");
      // this.items = this.items.filter((item: { id: number; }) => item.id !== 2);
      this.userlist = this.userlist.filter((Data: { User: string; }) => Data.User !== this.currentUser)
      // console.log(this.userlist,"Remove current user");
    });
    // Retrive Current User ID
    re.orderByChild("User").equalTo(this.currentUser).on("child_added",  (snapshot) => {
      // console.log(snapshot.key, "key user data");
      // Update Last seen of Current User
      var ref = this.db.database.ref("Users/List/" + snapshot.key)
      ref.update({
        "Lastseen": Date.now().toString()
      })
      // Retrive Current User data
      ref.on("value", snapshot => {
        // console.log(snapshot.val());
        this.result = snapshot.val()
        // console.log(this.result, "result");
      })
    })
  }

  ngOnInit(){ }  

  openchat(User: any, Created_at: any, Lastseen: any, img: any) {
    this.Created = Created_at
    // Active class Apply
    var li = document.getElementsByTagName("li")
    for (var i = 0; i < li.length; i++) {
      li[i].classList.remove("active")
    }
    var classAdd = document.getElementById(User)
    classAdd?.classList.add("active")
    this.selectchat = true
    this.Username = User
    this.Lastseen = Lastseen
    this.img = img
    var Chatname = "Chat" + (Number(this.result.Created_at) + Number(Created_at))
    // console.log(Chatname, "chatname")
    // User Chat data create
    var ref = this.db.database.ref("Chats/List/" + Chatname + "/Info")
    ref.update({
      "User1": this.currentUser,
      "User2": this.Username,
    })
    // Retrive Chat data
    this.chatref = this.db.database.ref("Chats/List/" + Chatname + "/Messages")
    this.chatref.on("value", (snapshot: {
      exists(): unknown; val: () => { [s: string]: unknown; } | ArrayLike<unknown>; }) => {
      if (snapshot.exists()) {
      // console.log(snapshot.val());
      this.chatlist = Object.values(snapshot.val())
      // console.log(this.chatlist);
      }
      else {
        this.chatlist = [
          {
            "error": "No messages"
          }
        ]
        console.error("The path does not exist in the database");
      }
  })



    
  }
  // Send Message
  sendMessage(message: any) {
    if(message == ""){
      this.Placeholder = "Please enter message !!!"
    }
    else{
      this.chatref.push({
        "sender": this.currentUser,
        "message": message,
        "Created": Date.now().toString()
      })
      this.message.nativeElement.value = '';
    }
  }

  deleteChat(){
    this.chatref.remove()
  }

  // Get Last Seen
  getLastseen(lastSeen:any): string {
    let currentTime = new Date();
    let timeDifference = currentTime.getTime() - lastSeen
    let diffInMinutes = Math.floor(timeDifference / (1000 * 60))
    let hours = Math.floor(diffInMinutes / 60);
    let minutes = diffInMinutes % 60;
    let time = hours + 'hr ' + minutes + 'min';
    if(hours == 0 && minutes == 0){
        time = 'Online'
    }
    if (hours == 0 && minutes > 2) {
        time = minutes + ' mins ago'
    }
    else{
      time = time + ' ago'
    }
    return time;
  }
  // Notification
  showNotification() {
    if (Notification.permission === 'granted') {
      const notification = new Notification('Notification Title', {
        body: 'This is the notification body text',
        icon: 'path/to/icon.png'
      });
    } else {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          const notification = new Notification('Notification Title', {
            body: 'This is the notification body text',
            icon: 'path/to/icon.png'
          });
        }
      });
    }
  }
  // Scroll to bottom 
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  uploadImage(event: any) {
    const Chatname = "Chat" + (Number(this.result.Created_at) + Number(this.Created))
    const file = event.target.files[0];
    const filePath = 'User/Chats/' + Chatname + '/img' + '_' + Date.now();
    const ref = this.storage.ref(filePath);
    const task: AngularFireUploadTask = ref.put(file);
    task.snapshotChanges().pipe(
      finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          // console.log(url, "url");
          this.chatref.push({
            "sender": this.currentUser,
            "url": url,
            "Created": Date.now().toString()
          })
        });
      })
    ).subscribe();
  }

  display = 'block';
  left = 0;

  showlist() {
    // If screen size is less than 768px
    if (window.screen.width < 768) {
      this.display = this.display === 'none' ? 'block' : 'none';
      this.left = this.left === -400 ? 0 : -400;
    }
    
  }
 

}
