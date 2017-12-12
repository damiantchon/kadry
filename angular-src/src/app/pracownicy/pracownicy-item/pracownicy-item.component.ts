import { Component, OnDestroy, OnInit } from '@angular/core';
import { PracownikModel } from '../pracownik.model';
import { PracownicyService } from '../pracownicy.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-pracownicy-item',
  templateUrl: './pracownicy-item.component.html',
  styleUrls: ['./pracownicy-item.component.css']
})
export class PracownicyItemComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  id: number;
  pracownik: PracownikModel;

    constructor(private pracownicyService: PracownicyService,
                private route: ActivatedRoute) { }

  ngOnInit() {
      this.subscriptions[0] = this.route.params
        .subscribe(
          (params: Params) => {
            this.id = params['id'];
            this.pracownik = this.pracownicyService.getPracownikById(this.id);
          }
        );

      this.subscriptions[1] = this.pracownicyService.pracownikActivated.subscribe(
        (pracownik: PracownikModel) => {
          this.pracownik = pracownik;
        }
      )
  }

  ngOnDestroy() {
      this.subscriptions[0].unsubscribe();
      this.subscriptions[1].unsubscribe();
  }

  onSubmit() {
      const pracownik: PracownikModel = this.pracownik;
      this.pracownicyService.addPracownik(pracownik)
        .subscribe(
          data => console.log(data),
          error => console.error(error)
        );
  }

}
