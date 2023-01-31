import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-app',
  templateUrl: './chat-app.component.html',
  styleUrls: ['./chat-app.component.css']
})
export class ChatAppComponent implements OnInit {

  itemRef: AngularFireObject<any>;
  item: Observable<any>;

  constructor(public db: AngularFireDatabase) {
    this.itemRef = db.object('title');
    this.item = this.itemRef.valueChanges();
    console.log(this.item);
  }

  ngOnInit(): void {
  }

}
