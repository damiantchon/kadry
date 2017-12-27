import { Component, OnDestroy, OnInit } from '@angular/core';
import { PublikacjeService } from '../../publikacje.service';
import { PublikacjaModel } from '../../publikacja.model';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PracownikModel } from '../../../pracownicy/pracownik.model';
import { PracownicyService } from '../../../pracownicy/pracownicy.service';

@Component({
  selector: 'app-publikacje-item',
  templateUrl: './publikacje-item.component.html',
  styleUrls: ['./publikacje-item.component.css']
})
export class PublikacjeItemComponent implements OnInit, OnDestroy{

  subscriptions: Subscription[] = [];

  id: string;
  publikacja: PublikacjaModel;
  autorzyWewnetrzni: PracownikModel[] = [];

  constructor(private publikacjeService: PublikacjeService,
              private pracownicyService: PracownicyService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.subscriptions[0] = this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.publikacja = this.publikacjeService.getPublikacjaById(this.id);
          this.autorzyWewnetrzni = [];
          this.publikacja.autorzyWewnetrzniId.forEach((pracownikId) => {
            this.autorzyWewnetrzni.push(this.pracownicyService.getPracownikById(pracownikId));
          })
        }
      );
  }

  ngOnDestroy() {
    if(this.subscriptions[0]){
      this.subscriptions[0].unsubscribe();
    }
  }

  onSubmit() {
    this.publikacjeService.addPublikacja(this.publikacja)
      .subscribe(
        data => console.log(data),
        error => console.error(error)
      )
  }

  onAddNew() {
    this.router.navigate(['publikacje', 'new']);
  }

  onEdit() {
    this.router.navigate(['edit'], {relativeTo: this.route})
  }

  onDelete() {

  }

}
