import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  Loading: boolean = false
  constructor( public authService: AuthService ) { }

  ngOnInit(): void {  }

  login(email:any,password:any){
    this.Loading = true
    this.authService.SignIn(email, password)
  }

}
