import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Post } from '../post/post';
import { OAuthService } from 'angular-oauth2-oidc';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-post-update',
  templateUrl: './post-update.component.html',
  styleUrls: ['./post-update.component.css']
})
export class PostUpdateComponent {
  public editPost!: Post;

  constructor(public oauthService: OAuthService, private postService: PostService, private userService: UserService) {}

  public onUpdatePost(post: Post): void {
    console.log(post);
  
    this.postService.updatePost(post).subscribe(
      (response: Post) => {
        console.log(response);
        console.log(this.editPost);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
 
}
