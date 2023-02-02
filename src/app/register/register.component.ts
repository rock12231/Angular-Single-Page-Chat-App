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

  imgList: any = [
    "https://bootdey.com/img/Content/avatar/avatar1.png" ,
    "https://bootdey.com/img/Content/avatar/avatar2.png" ,
    "https://bootdey.com/img/Content/avatar/avatar3.png" ,
    "https://bootdey.com/img/Content/avatar/avatar4.png" ,
    "https://bootdey.com/img/Content/avatar/avatar5.png" ,
    "https://bootdey.com/img/Content/avatar/avatar6.png" ,
    "https://bootdey.com/img/Content/avatar/avatar7.png" ,
    "https://bootdey.com/img/Content/avatar/avatar8.png"
  ]

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
    var btn = document.getElementById("register")
    btn?.setAttribute("disabled", "true")
    // Randomly select an image from the list
    var randomImage = this.imgList[Math.floor(Math.random() * this.imgList.length)];
    if(email != "" && password != "" && email.length > 4 && password.length > 4){
      this.authService.SignUp(email, password)
      var ref = this.db.database.ref("Users/List")
      ref.push({
        "User": email,
        "Image": randomImage,
        "Created_at": Date.now(),
        "Lastseen" : Date.now()
      })
    }
    else{
      alert("Please enter email and password")
    }
  }
}
