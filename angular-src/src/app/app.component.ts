import { Component } from '@angular/core';
import { PracownicyService } from './pracownicy/pracownicy.service';
import { Router } from '@angular/router';
import { PublikacjeService } from './publikacje/publikacje.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private pracownicyService: PracownicyService,
              private publikacjeService: PublikacjeService,
              private router: Router) {

  }
}

