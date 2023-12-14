import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostComponent } from './post/post.component';
import { PostAddComponent } from './post-add/post-add.component';
import { PostPageComponent } from './post-page/post-page.component';

const routes: Routes = [
  // {path: '', redirectTo: 'posts', pathMatch: 'full'},
  {path: 'posts', component: PostComponent},
  {path: 'posts/add', component: PostAddComponent},
  {path: 'posts/page/:postId', component: PostPageComponent},
  // {path: '', redirectTo: '/posts', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
