import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { AuthConfig, OAuthService, provideOAuthClient } from 'angular-oauth2-oidc';
import { PostComponent } from './post/post.component';
import { PostService } from './post/post.service';
import { FormsModule } from '@angular/forms';
import { PostAddComponent } from './post-add/post-add.component';
import { PostUpdateComponent } from './post-update/post-update.component';
import { UserComponent } from './user/user.component';
import { PostPageComponent } from './post-page/post-page.component';

export const authCodeFlowConfig: AuthConfig = {
  issuer: 'http://localhost:9090/realms/postify-dev',
  tokenEndpoint: 'http://localhost:9090/realms/postify-dev/protocol/openid-connect/token',
  redirectUri: 'http://localhost:4200/posts',
  clientId: 'spring-client-rest-api',
  responseType: 'code', 
  scope: 'openid profile',
}

function initializeOauth(oauthService: OAuthService): Promise<void>
{
  return new Promise((resolve) => {
    oauthService.configure(authCodeFlowConfig);
    oauthService.setupAutomaticSilentRefresh();
    oauthService.loadDiscoveryDocumentAndLogin()
    .then(() => resolve());
  });
}

@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    PostAddComponent,
    PostUpdateComponent,
    UserComponent,
    PostPageComponent,
    PostPageComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,      
  ],
  providers: [
    PostService,
    provideHttpClient(),
    provideOAuthClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: (oauthService: OAuthService) => {
        return () => {
          initializeOauth(oauthService);
        }
      },
      multi: true,
      deps: [
        OAuthService
      ]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
