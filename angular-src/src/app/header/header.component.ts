import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';
import { PracownicyService } from '../pracownicy/pracownicy.service';
import { PublikacjeService } from '../publikacje/publikacje.service';
import { MinimumKadroweService } from '../minimum-kadrowe/minimum-kadrowe.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  adminHeader = false;

  constructor(private authenticationService: AuthenticationService,
              private pracownicyService: PracownicyService,
              private publikacjeService: PublikacjeService,
              private minimumKadroweService: MinimumKadroweService,
              private router: Router) { }

  ngOnInit() {
    this.authenticationService.logowanieActivated.subscribe(()=>{
      this.authenticationService.authenticate()
        .map(e => {
          console.log(e);
          this.adminHeader = e.admin === true;
        }).subscribe();
    });

    this.authenticationService.logowanieActivated.next();
  }

  ngOnDestroy() {

  }

  isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

  onLogOut() {
    this.authenticationService.logout();
    this.authenticationService.logowanieActivated.next();
    this.router.navigate(['/']);
  }
  refreshData() {
    this.authenticationService.authenticate()
      .subscribe(
        data => {
          if(data.auth === true) {
            this.subscriptions[0] = this.pracownicyService.getPracownicy().subscribe(
              () => {this.subscriptions[0].unsubscribe()}
            );
            this.subscriptions[1] = this.publikacjeService.getPublikacje().subscribe(
              () => {this.subscriptions[1].unsubscribe()}
            );
            this.subscriptions[2] = this.minimumKadroweService.getMinimaKadrowe().subscribe(
              () => {this.subscriptions[2].unsubscribe()}
            )
          }
          this.router.navigate(['/']);
        },
        err => {console.error(err)}
      )
  }
}
