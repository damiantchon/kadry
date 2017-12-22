import { Component, OnInit } from '@angular/core';
import { PracownicyService } from './pracownicy/pracownicy.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private pracownicyService: PracownicyService,
              private router: Router) {

  }
}

