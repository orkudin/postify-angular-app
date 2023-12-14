import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  
  ngOnInit() {
    console.log(this.oauthService.getIdentityClaims())
  }

  helloText = '';

  constructor(private oauthService: OAuthService, private httpClient: HttpClient, private router: Router) { }

  logout() {
    this.oauthService.logOut();  
  }

  public addPost(): void {
    this.router.navigate(['/posts/add']);
  }
  
  getHelloTextAdmin(){
    console.log(this.oauthService.getAccessToken());
    this.httpClient.get<{ message: string }>("http://localhost:8222/hello-admin", {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`
      }
    }).subscribe(result => {
      this.helloText = result.message;
    })
  }

  getHelloTextUser(){
    this.httpClient.get<{ message: string }>("http://localhost:8222/hello-user", {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`
      }
    }).subscribe(result => {
      this.helloText = result.message;
    })
  }
}
