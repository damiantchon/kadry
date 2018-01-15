import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publikacje-item-start',
  templateUrl: './publikacje-item-start.component.html',
  styleUrls: ['./publikacje-item-start.component.css']
})
export class PublikacjeItemStartComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onAddNewArtykul() {
    this.router.navigate(['publikacje', 'artykul']);
  }
  onAddNewMonografia() {
    this.router.navigate(['publikacje', 'monografia']);
  }
  onAddNewRozdzial() {
    this.router.navigate(['publikacje', 'rozdzial']);
  }


}
