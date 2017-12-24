import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pracownicy-item-start',
  templateUrl: './pracownicy-item-start.component.html',
  styleUrls: ['./pracownicy-item-start.component.css']
})
export class PracownicyItemStartComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

  }

  onAddNew() {
    this.router.navigate(['pracownicy', 'new']);
  }

}
