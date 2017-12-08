import { Component, OnInit } from '@angular/core';
import { PracownicyService } from '../pracownicy.service';
import { PracownikModel } from '../pracownik.model';

@Component({
  selector: 'app-pracownicy-list',
  templateUrl: './pracownicy-list.component.html',
  styleUrls: ['./pracownicy-list.component.css']
})
export class PracownicyListComponent implements OnInit {

    private pracownicyList: PracownikModel[] = [];

  constructor(private pracownicyService: PracownicyService) { }

  ngOnInit() {
      this.pracownicyList = this.pracownicyService.pracownicyList;
  }

}
