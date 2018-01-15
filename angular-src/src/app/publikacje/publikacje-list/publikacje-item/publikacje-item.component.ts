import { Component, OnDestroy, OnInit } from '@angular/core';
import { PublikacjeService } from '../../publikacje.service';
import { PublikacjaModel } from '../../publikacja.model';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PracownikModel } from '../../../pracownicy/pracownik.model';
import { PracownicyService } from '../../../pracownicy/pracownicy.service';
import 'bootbox';

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
  redaktorzyWewnetrzni: PracownikModel[] = [];
  rodzajPublikacji: string;

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
          this.redaktorzyWewnetrzni = [];
          this.rodzajPublikacji = this.publikacja.rodzajPublikacji;
          this.publikacja.autorzyWewnetrzniId.forEach((pracownikId) => {
            this.autorzyWewnetrzni.push(this.pracownicyService.getPracownikById(pracownikId));
          });
          this.publikacja.redaktorzyWewnetrzniId.forEach((pracownikId) => {
            this.autorzyWewnetrzni.push(this.pracownicyService.getPracownikById(pracownikId));
          });
        }
      );
  }

  ngOnDestroy() {
    if(this.subscriptions[0]){
      this.subscriptions[0].unsubscribe();
    }
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

  onGoToRaports() {
    this.router.navigate(['publikacje']);
  }

  onEdit() {
    this.router.navigate(['edit'], {relativeTo: this.route})
  }

  onDelete() {
    let message: string = '';
    switch (this.publikacja.rodzajPublikacji) {
      case 'ATK':
        message = "Czy na pewno chcesz usunąć ten artykuł? <br>" +
          'Tytuł: ' + this.publikacja.tytulPublikacji.bold() + '<br>';
        break;
      case 'MG':
        message = "Czy na pewno chcesz usunąć tą monografię? <br>" +
          'Tytuł: ' + this.publikacja.tytulPublikacji.bold() + '<br>';
        break;
      case 'MGR':
        message = "Czy na pewno chcesz usunąć ten rozdział monografii? <br>" +
          'Tytuł monografii: ' + this.publikacja.tytulPublikacji.bold() + '<br>' +
          'Tytuł rozdziału: ' + this.publikacja.tytulRozdzialu.bold();
        break;

    }

    bootbox.confirm({
      message: message,
      buttons: {
        cancel: {
          label: 'Nie',
          className: 'btn-danger'
        },
        confirm: {
          label: 'Tak',
          className: 'btn-success'
        }
      },
      callback: (result) => {
        if(result){
          this.publikacjeService.deletePublikacja(this.publikacja)
            .subscribe((result) => {
              console.log(result);
              this.publikacjeService.getPublikacje().subscribe(
                () => {
                  let savedStrategy = this.router.routeReuseStrategy.shouldReuseRoute;
                  this.router.routeReuseStrategy.shouldReuseRoute = () => {
                    return false;
                  };
                  this.router.navigate(['/publikacje']).then(() => {
                      this.router.routeReuseStrategy.shouldReuseRoute = savedStrategy;
                    }
                  )
                }
              )
            });
        }
      }
    });
  }
}
