import { Component, OnDestroy, OnInit } from '@angular/core';
import { PracownikModel } from '../../pracownik.model';
import { PracownicyService } from '../../pracownicy.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-pracownicy-item',
  templateUrl: './pracownicy-item.component.html',
  styleUrls: ['./pracownicy-item.component.css']
})
export class PracownicyItemComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  id: string;
  pracownik: PracownikModel;

    constructor(private pracownicyService: PracownicyService,
                private route: ActivatedRoute,
                private router: Router) { }

  ngOnInit() {
      this.subscriptions[0] = this.route.params
        .subscribe(
          (params: Params) => {
            this.id = params['id'];
            console.log(params);
            this.pracownik = this.pracownicyService.getPracownikById(this.id);
          }
        );
  }

  ngOnDestroy() {
      this.subscriptions[0].unsubscribe();
  }

  onSubmit() {
      const pracownik: PracownikModel = this.pracownik;
      this.pracownicyService.addPracownik(pracownik)
        .subscribe(
          data => console.log(data),
          error => console.error(error)
        );
  }

  onEdit() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onAddNew() {
    this.router.navigate(['pracownicy', 'new']);
  }

  onDelete() {

  }
}

