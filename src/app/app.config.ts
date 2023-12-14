import { provideRouter, Routes } from "@angular/router";
import { ApplicationConfig } from "@angular/core";
import { PostComponent } from "./post/post.component";
import { NotFoundComponent } from "./test/not-found.component";
import { HomeComponent } from "./test/home.component";
import { AppComponent } from "./app.component";
 
// компоненты, которые сопоставляются с маршрутами

 
// определение маршрутов
const appRoutes: Routes =[
    { path: "", component: AppComponent},
    { path: "post", component: PostComponent},
    { path: "**", component: NotFoundComponent }
];
 
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes)]
};