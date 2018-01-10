import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PracownicyService } from '../../pracownicy.service';

@Component({
  selector: 'app-pracownicy-item-start',
  templateUrl: './pracownicy-item-start.component.html',
  styleUrls: ['./pracownicy-item-start.component.css']
})
export class PracownicyItemStartComponent implements OnInit {


  przedmiotName: string = '';

  constructor(private router: Router,
              private pracownicyService: PracownicyService) { }

  ngOnInit() {

  }

  onAddNew() {
    this.router.navigate(['pracownicy', 'new']);
  }

  onGeneruj(przedmiot: string, action: string) {
    if(przedmiot !== '')
    this.pracownicyService.generatePrzedmiotRaport(przedmiot,action);
  }

}
