import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, Router, Resolve } from '@angular/router';
import { AuthGuard } from './auth/auth-guard';
import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { take, map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class HomeResolver implements Resolve<any> {
  constructor(private auth: AuthService, private router: Router) {}
  resolve(): Observable<any>|Promise<any>|any {
        return this.auth.currentUserObservable
            .pipe(
                take(1),
                map(user => {
                    if (user) {
                        return this.router.navigate(['/user-page'])
                    }
                })
            )
  }
}

const appRoutes: Routes = [
  { 
    path: '', 
    loadChildren: './components/home/home.module#HomeModule',
    resolve: {
        HomeResolver
    },
  },
  {
    path: 'chat-room',
    loadChildren: './chat/src/app/chat.module#ChatModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'user-page',
    loadChildren: './components/user-page/user-page.module#UserPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'advertisment',
    loadChildren: './components/advertisment/advertisment.module#AdvertismentModule',
    canActivate: [AuthGuard]
  },
  { 
    path: 'flowchart', 
    loadChildren: './components/board/board.module#BoardModule',
    canActivate: [AuthGuard]
  },
  { 
    path: 'converse', 
    loadChildren: './converse/converse.module#ConverseModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'meet-section',
    loadChildren: './converse/meet-section/meet-section.module#MeetSectionModule',
    canActivate: [AuthGuard]
  },
  { 
    path: 'video-chart', 
    loadChildren: './converse/video-chart/video-chart.module#VideoChartModule',
    canActivate: [AuthGuard]
  },
  { 
    path: 'profile-info', 
    loadChildren: './converse/profile-info/profile-info.module#ProfileInfoModule',
    canActivate: [AuthGuard]
  },
  { 
    path: 'signup', 
    loadChildren: './auth/signup/signup.module#SignupModule' 
  },
  { 
    path: 'login', 
    loadChildren: './auth/login/login.module#LoginModule' 
  },
  { 
    path: 'reset-password', 
    loadChildren: './auth/reset-password/reset-password.module#ResetPasswordModule' 
  },
  { 
    path: 'forgot-password', 
    loadChildren: './auth/forgot-password/forgot-password.module#ForgotPasswordModule' 
  },
  { 
    path: '**', 
    redirectTo: '/user-page' 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
