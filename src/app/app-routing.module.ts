import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth-guard';

const appRoutes: Routes = [
  { 
    path: 'home', 
    loadChildren: './components/home/home.module#HomeModule'
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
    path: 'board', 
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
