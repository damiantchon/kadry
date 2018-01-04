import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-minimum-kadrowe-item-start',
  templateUrl: './minimum-kadrowe-item-start.component.html',
  styleUrls: ['./minimum-kadrowe-item-start.component.css']
})
export class MinimumKadroweItemStartComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onAddNew() {
    this.router.navigate(['/minimum-kadrowe', 'new']);
  }
}
