import { Component } from '@angular/core';
import { PracownicyService } from './pracownicy/pracownicy.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private pracownicyService: PracownicyService) {

  }

}
