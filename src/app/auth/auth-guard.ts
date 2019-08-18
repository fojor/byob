import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, map, tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    let expDate = this.auth.getAuthExpirationDate();
    if(!expDate || expDate <= new Date()) {
        this.router.navigate(['/login']);
        return false;
    }
    
    if (this.auth.authenticated) { 
        return true; 
    }

    return this.auth.currentUserObservable
            .pipe(
                take(1),
                map(user => !!user),
                tap(loggedIn => {
                    if (!loggedIn) {
                      this.router.navigate(['/login']);
                    }
                })
            )
    }
}
