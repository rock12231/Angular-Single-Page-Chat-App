import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  Loading: boolean = false
  user :any
  constructor(public authService: AuthService, router: Router ) {
    if (JSON.parse(localStorage.getItem('user')!).uid !== null) {
      router.navigate(['chat']);
    }
   }

  ngOnInit(): void {  }

  login(email:any,password:any){
    this.Loading = true
    this.authService.SignIn(email, password)
  }

}
