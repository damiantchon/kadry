import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './authentication/authentication.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthenticationGuard implements CanActivate{

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot)
  : Observable<boolean> | Promise<boolean> | boolean {
    return this.authenticationService.authenticate()
      .map(e => {
        console.log(e);
        if (e.auth === true) {
          return true;
        } else {
          this.router.navigate(['/']);
          bootbox.alert('Aby kontynuować musisz się zalogować!');
          return false;
        }
      })

  }
}
