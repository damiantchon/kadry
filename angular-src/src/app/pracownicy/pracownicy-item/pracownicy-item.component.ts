import { Component, OnInit } from '@angular/core';
import { PracownikModel } from '../pracownik.model';

@Component({
  selector: 'app-pracownicy-item',
  templateUrl: './pracownicy-item.component.html',
  styleUrls: ['./pracownicy-item.component.css']
})
export class PracownicyItemComponent implements OnInit {

    pracownik: PracownikModel =
        new PracownikModel(
            'Adam',
            'Abacki',
            'mjr',
            'dr inz',
            'informatyk'
        );

    constructor() { }

  ngOnInit() {
  }

}
