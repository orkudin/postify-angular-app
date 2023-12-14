import { Component } from '@angular/core';
import { Post } from '../post/post';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { PostService } from '../post/post.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-post-add',
  templateUrl: './post-add.component.html',
  styleUrls: ['./post-add.component.css']
})
export class PostAddComponent {
//https://stackoverflow.com/questions/49699067/property-has-no-initializer-and-is-not-definitely-assigned-in-the-construc
public posts!: Post[];
public editPost!: Post;
public deletePost!: Post;

constructor(private postService: PostService, private oauthService: OAuthService) {}

public onAddPost(addForm: NgForm): void {
  console.log(addForm.value.postDescription)

  addForm.value.userIdSub = this.oauthService.getIdentityClaims()['sub'];
  document.getElementById('add-post-form')?.click(); //закрыть поп-ап после сохранения файла
  this.postService.addPost(addForm.value).subscribe(
    (response: Post) => {
      console.log(response);
      addForm.reset();
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

}
