import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-chat-app',
  templateUrl: './chat-app.component.html',
  styleUrls: ['./chat-app.component.css']
})
export class ChatAppComponent implements OnInit {

  itemRef: AngularFireObject<any>;
  item: Observable<any>;
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
      "user_id_1_user_id_2": {
        "user_id_1": {
          "message": "Hi, okkkkkk how are you?",
          "timestamp": 1615232439
        },
        "user_id_2": {
          "message": "thanks. How about you?",
          "timestamp": 1615232449
        }
      }
    }
  }

  constructor(public db: AngularFireDatabase, public authService: AuthService) {
    this.itemRef = db.object('title');
    this.item = this.itemRef.valueChanges();
    console.log(this.item);
    this.itemRef = this.db.object('Chat/')
    this.itemRef.update(this.data)
  }

  ngOnInit(): void {
  }
 
}
