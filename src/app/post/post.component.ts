import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from './post';
import { PostService } from './post.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserService } from '../user/user.service';
import { PostWithUser } from './post_with_user';
import { Router } from '@angular/router';
import { LocalstorageService } from '../local-storage/localstorage.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html', 
  styleUrls: ['./post.component.css']
})
export class PostComponent {
//https://stackoverflow.com/questions/49699067/property-has-no-initializer-and-is-not-definitely-assigned-in-the-construc
public posts!: Post[];
public editPost!: Post;
public deletePost!: PostWithUser;
public posts_with_users!: PostWithUser[];
public current_username!: string;
public roleAdmin: any;
constructor(public oauthService: OAuthService, private postService: PostService, private userService: UserService, private router: Router, private localStorageService: LocalstorageService) {}

ngOnInit() {
  // this.getPosts();
  this.oauthService.events.subscribe((e) => {
    if (this.oauthService.hasValidAccessToken()) {
      this.getPosts();
      this.roleAdmin = this.postService.getAdminRole();
      console.log(`from hasValidAccessToken ${this.roleAdmin}`)
    }
  });
  if (this.oauthService.hasValidAccessToken()) {
    this.getPosts();
  }
}

public getPosts(): void {
  this.postService.getPosts().subscribe(
    (response: PostWithUser[]) => {
      this.posts_with_users = response;
      this.mapPostsToUsers();
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

mapPostsToUsers(): void {
  this.posts_with_users.forEach(post => {
    this.userService.getUserById(post.userId).subscribe(
      (user) => {
        console.log(user.username)
        post.userId = user.userId;
        post.username = user.username;
        post.userProfileImg = user.userProfileImg;
      },
      (error: HttpErrorResponse) => {
        console.error(`Error fetching user for post with ID ${post.userId}: ${error.message}`);
      }
    );
  });
}

public getPostsByUser(userId: number): void {
  this.postService.getPostsByUser(userId).subscribe(
    (response: Post[]) => {
      this.posts = response;
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

public onDeletePost(postId: number): void {
  this.postService.deletePost(postId).subscribe(
    (response: void) => {
      console.log(response);
      this.getPosts();
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

public searchPosts(key: string): void {
  const results: Post[] = [];
  for (const post of this.posts) {
    if (
      post.postTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
      post.postDescription.toLowerCase().indexOf(key.toLowerCase()) !== -1
    ) {
      results.push(post);
    }
  }
  this.posts = results;
  if (results.length === 0 || !key) {
    this.getPosts();
  }
}

public onVote(postId: number, userId: string): void{
  
  this.postService.plusVote(postId, userId).subscribe(
    (response: number) => {
      console.log(response);
      this.posts_with_users = this.posts_with_users.map((post) => {
        if (post.postId == postId) {
          return { ...post, postVotes: post.postVotes + 1 };
        } else {
          return post;
        }
      });
      
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
      this.posts_with_users = this.posts_with_users.map((post) => {
        if (post.postId == postId) {
          return { ...post, postVotes: post.postVotes - 1 };
        } else {
          return post;
        }
      });
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

onPostTitleClick(post: PostWithUser): void {
  this.postService.setPostData(post);
  console.log(post)
  this.router.navigate(['/posts/page', post.postId]);
  this.saveData();
}

saveData(): void {
  const dataToSave = { key: 'value', anotherKey: 'anotherValue' };
  this.localStorageService.setItem('myData', dataToSave);
}

retrieveData(): void {
  const retrievedData = this.localStorageService.getItem('myData');
  console.log('Retrieved Data:', retrievedData);
}

clearData(): void {
  this.localStorageService.removeItem('myData');
}

// public onOpenModal(post: Post | null, mode: string): void {
//   const container = document.getElementById('main-container');
//   const button = document.createElement('button');
//   button.type = 'button';
//   button.style.display = 'none';
//   button.setAttribute('data-toggle', 'modal');
//   if (mode === 'add') {
//     button.setAttribute('data-target', '#addPostModal');
//   }
//   if (mode === 'edit') {
//     this.editPost = post;
//     console.log(this.editPost);
//     button.setAttribute('data-target', '#updatePostModal');
//   }
//   if (mode === 'delete') {
//     this.deletePost = post;
//     button.setAttribute('data-target', '#deletePostModal');
//   }
//   container?.appendChild(button);
//   button.click();
// }
}
