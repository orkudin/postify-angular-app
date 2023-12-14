import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../post/post.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpErrorResponse } from '@angular/common/http';
import { PostWithUser } from '../post/post_with_user';
import { CommentsFromPost } from './comment';
import { NgForm } from '@angular/forms';
import { LocalstorageService } from '../local-storage/localstorage.service';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css']
})
export class PostPageComponent {
  public posts_with_user!: PostWithUser;
  public comments!: CommentsFromPost[];

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    public oauthService: OAuthService,
    public localStorageService: LocalstorageService
  ) {}
  
  ngOnInit(): void {
    this.posts_with_user = this.postService.getPostData();
    this.getCommentsByPostId();
    console.log(this.postService.getPostData())

    console.log('Retrieved Data on Page Load:', this.localStorageService.getItem('myData'));
  }
  

  public onDeletePost(postId: number): void {
    this.postService.deletePost(postId).subscribe(
      (response: void) => {
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  
  public onVote(postId: number, userId: string): void{
    this.postService.plusVote(postId, userId).subscribe(
      (response: number) => {
        console.log(response);
        this.posts_with_user.postVotes += 1;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onMinus(postId: number, userId: string): void{
    this.postService.minusVote(postId, userId).subscribe(
      (response: number) => {
        console.log(response);
        this.posts_with_user.postVotes -= 1;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  
  public getCommentsByPostId(): void {
    this.postService.getCommentsByPost(this.posts_with_user.postId).subscribe(
      (response: CommentsFromPost[]) => {
        this.comments = response;
        console.log(this.comments)
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public addComment(addForm: NgForm): void {

    console.log(addForm.value)
    console.log(this.posts_with_user.postId)
    addForm.value.userIdSub = this.oauthService.getIdentityClaims()['sub'];
    addForm.value.postId = this.posts_with_user.postId
    console.log(addForm.value.postId)

    this.postService.addComment(addForm.value).subscribe(
      (response: CommentsFromPost) => {
        console.log(response);
        addForm.reset();
        // this.comments = [...this.comments, addForm.value]
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


}
