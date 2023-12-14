import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from './post';
import { environment } from 'environments/environment';
import { OAuthService } from 'angular-oauth2-oidc';
import { PostWithUser } from './post_with_user';
import { CommentsFromPost } from '../post-page/comment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  private apiServerUrl = environment.apiBaseUrl;
  private postData: any;
  private roleAdmin!: boolean ;
  private jwtEncoded: any;
  constructor(private http: HttpClient, private oauthService: OAuthService) { }

  public getAdminRole(): boolean{
    const decodedToken = jwtDecode(this.oauthService.getAccessToken());
    console.log(decodedToken)
    this.jwtEncoded = decodedToken;
    console.log(this.jwtEncoded['realm_access']['roles'].includes('admin'))
    this.roleAdmin = this.jwtEncoded['realm_access']['roles'].includes('admin')
    return this.roleAdmin
  }
  
  public getPosts(): Observable<PostWithUser[]> {
    // console.log(`from post ${this.oauthService.getAccessToken()}`)
    // console.log(`from post ${this.oauthService.getIdentityClaims()['sub']}`)
    // console.log(`from post ${this.oauthService.getIdentityClaims()}`)


    return this.http.get<PostWithUser[]>(`${this.apiServerUrl}/api/v1/posts/all`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        'Access-Control-Allow-Origin': "*"
      }
    })
  }

  public addPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${this.apiServerUrl}/api/v1/posts/add`, post, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        'Access-Control-Allow-Origin': "*"
      }
    })
  }

  public addComment(comment: CommentsFromPost): Observable<CommentsFromPost> {
    return this.http.post<CommentsFromPost>(`${this.apiServerUrl}/api/v1/comments/add`, comment, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        'Access-Control-Allow-Origin': "*"
      }
    })
  }

  public updatePost(post: Post): Observable<Post> {
    console.log("From method")
    console.log(post)
    return this.http.put<Post>(`${this.apiServerUrl}/api/v1/posts/update`, post)
  }

  public plusVote(postId: number, userId: string): Observable<number> {
    const requestBody = { postId, userId };
    return this.http.put<number>(`${this.apiServerUrl}/api/v1/posts/updateVote/${1}`, requestBody,  {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        'Access-Control-Allow-Origin': "*"
      }
    })
  }
  public minusVote(postId: number, userId: string): Observable<number> {
    const requestBody = { postId, userId };
    return this.http.put<number>(`${this.apiServerUrl}/api/v1/posts/updateVote/${0}`, requestBody,  {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        'Access-Control-Allow-Origin': "*"
      }
    })
  }

  public deletePost(postId: number): Observable<void> {//Ничего не возвращаем, поэтому void
    return this.http.delete<void>(`${this.apiServerUrl}/api/v1/posts/delete/${postId}`,  {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        'Access-Control-Allow-Origin': "*"
      }
    })
  }

  public findPost(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiServerUrl}/api/v1/posts/find/${postId}`)
  }

  public getPostsByUser(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiServerUrl}/api/v1/posts/findAllPostsByUserId/${userId}`)
  }

  public getCommentsByPost(postId: number): Observable<CommentsFromPost[]> {
    return this.http.get<CommentsFromPost[]>(`${this.apiServerUrl}/api/v1/comments/post/${postId}`,  {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        'Access-Control-Allow-Origin': "*"
      }
    })
  }

  setPostData(data: any): void {
    this.postData = data;
  }

  getPostData(): any {
    return this.postData;
  }

}
