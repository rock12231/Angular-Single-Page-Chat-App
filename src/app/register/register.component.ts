import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  itemRef: AngularFireObject<any>;
  item: Observable<any>;

  constructor(public authService: AuthService, public db: AngularFireDatabase) {
    this.itemRef = db.object('Users/');
    this.item = this.itemRef.valueChanges();
    console.log(this.item);

    var ref = this.db.database.ref("Users/List");
    // ref.set({});
    // var i;
    // for(i=0; i<10; i++){
    // ref.push({
    //   "user": "User name"+i,
    //   "image": "https://bootdey.com/img/Content/avatar/avatar1.png",
    //   "Created": Date.now().toString()
    //   });
    // }

   }

  ngOnInit(): void { }

  register(email: string, password: string) {
    this.authService.SignUp(email, password)
    var ref = this.db.database.ref("Users/List")
    ref.push({
      "user": email,
      "image": "https://bootdey.com/img/Content/avatar/avatar1.png",
      "Created": Date.now().toString()
    })
  }
}
