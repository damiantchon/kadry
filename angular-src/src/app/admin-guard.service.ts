import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication/authentication.service';


@Injectable()
export class AdminGuard implements CanActivate{

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot)
  : Observable<boolean> {
    return this.authenticationService.authenticate()
      .map(e => {
        console.log(e);
        if (e.admin === true) {
          return true;
        } else {
          this.router.navigate(['/']);
          bootbox.alert('Niewystarczające uprawnienia!');
          return false;
        }
      })
  }
}
