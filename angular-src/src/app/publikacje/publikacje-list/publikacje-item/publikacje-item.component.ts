import { Component, OnInit } from '@angular/core';
import { PublikacjeService } from '../../publikacje.service';
import { PublikacjaModel } from '../../publikacja.model';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-publikacje-item',
  templateUrl: './publikacje-item.component.html',
  styleUrls: ['./publikacje-item.component.css']
})
export class PublikacjeItemComponent implements OnInit {

  subscriptions: Subscription[] = [];

  id: string;
  publikacja: PublikacjaModel;

  constructor(private publikacjeService: PublikacjeService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscriptions[0] = this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.publikacja = this.publikacjeService.getPublikacjaById(this.id);
          console.log(this.publikacja);
        }
      );
  }

  onSubmit() {
    this.publikacjeService.addPublikacja(this.publikacja)
      .subscribe(
        data => console.log(data),
        error => console.error(error)
      )
  }

}
