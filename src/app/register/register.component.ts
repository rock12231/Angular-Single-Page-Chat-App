import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  // itemRef: AngularFireObject<any>;
  // item: Observable<any>;

  Loading: boolean = false

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

  constructor(public authService: AuthService, public db: AngularFireDatabase, router: Router ) {
    // if (JSON.parse(localStorage.getItem('user')!).uid !== null) {
    //   router.navigate(['chat']);
    // }
   }

  ngOnInit(): void { }

  register(email: string, password: string) {
    this.Loading = true
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
