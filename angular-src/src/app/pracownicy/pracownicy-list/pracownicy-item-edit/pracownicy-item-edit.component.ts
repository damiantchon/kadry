import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PracownicyService } from '../../pracownicy.service';
import { Location } from '@angular/common';
import { PracownikModel } from '../../pracownik.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-pracownicy-item-edit',
  templateUrl: './pracownicy-item-edit.component.html',
  styleUrls: ['./pracownicy-item-edit.component.css']
})
export class PracownicyItemEditComponent implements OnInit, OnDestroy {

  pracownikForm: FormGroup;
  tempPracownik: PracownikModel = null;

  subscriptions: Subscription[] = [];
  constructor(private route: ActivatedRoute,
              private router: Router,
              private pracownicyService: PracownicyService,
              private location: Location) { }

  id: string;
  editMode: boolean;
  przedmioty: string[] = [];

  ngOnInit() {
    this.przedmioty = this.pracownicyService.przedmioty;
    this.przedmioty.sort();
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }

  ngOnDestroy() {
    if(this.subscriptions[0]){
      this.subscriptions[0].unsubscribe();
    }
    // this.subscriptions.forEach((subscription: Subscription) => {
    //   if(subscription) {
    //     subscription.unsubscribe();
    //   }
    // });
  }

  initForm () {

    let tempNazwisko: string = '';
    let tempImie: string = '';
    let tempTytul: string = '';
    let tempStopien: string = '';
    let tempEmail: string = '';
    let tempSpecjalnosc: string = '';
    let tempPrzedmioty = new FormArray([]);
    let tempFunkcje = new FormArray([]);

    if (this.editMode){
      const pracownik = this.pracownicyService.getPracownikById(this.id);
      this.tempPracownik = pracownik;
      tempNazwisko = pracownik.nazwisko;
      tempImie = pracownik.imie;
      tempTytul = pracownik.tytul;
      tempStopien = pracownik.stopien;
      tempEmail = pracownik.email;
      tempSpecjalnosc = pracownik.specjalnosc;
      if (pracownik.przedmioty) {
        for (let przedmiot of pracownik.przedmioty) {
          tempPrzedmioty.push(
            new FormGroup(
              {
                'przedmiot': new FormControl(przedmiot, Validators.required)
              }
            )
          );
        }
      }
      if (pracownik.funkcje) {
        for (let funkcja of pracownik.funkcje) {
          tempFunkcje.push(
            new FormGroup(
              {
                'funkcja': new FormControl(funkcja, Validators.required)
              }
            )
          );
        }
      }
    }

    this.pracownikForm = new FormGroup({
      'nazwisko': new FormControl(tempNazwisko, [Validators.required]),
      'imie': new FormControl(tempImie, [Validators.required]),
      'tytul': new FormControl(tempTytul, [Validators.required]),
      'stopien': new FormControl(tempStopien),
      'email': new FormControl(tempEmail, [Validators.required, Validators.email]),
      'specjalnosc': new FormControl(tempSpecjalnosc, [Validators.required]),
      'przedmioty': tempPrzedmioty,
      'funkcje': tempFunkcje
    });
  }

  onSubmit() {

    // przygotowanie tablicy funkcji
    let funkcje: any = [];
    this.pracownikForm.value.funkcje.forEach((funkcja) => {
      funkcje.push(funkcja.funkcja);
    });

    // przygotowanie tablicy przedmiotów
    let przedmioty: any = [];
    this.pracownikForm.value.przedmioty.forEach((przedmiot) => {
      przedmioty.push(przedmiot.przedmiot);
    });

    // przygotowanie pracownika do
    let updatedPracownik: PracownikModel = new PracownikModel(
      this.id,
      this.pracownikForm.value.imie,
      this.pracownikForm.value.nazwisko,
      this.pracownikForm.value.stopien,
      this.pracownikForm.value.tytul,
      this.pracownikForm.value.specjalnosc,
      this.pracownikForm.value.email,
      przedmioty,
      funkcje
    );

    if(this.editMode === true){ // edycja istniejącego pracownika
      this.subscriptions[0] = this.pracownicyService.updatePracownik(updatedPracownik)
        .subscribe(
          data => {
            console.log(data);
            this.pracownicyService.getPracownicy().subscribe(
              ()=> {
                let savedStrategy = this.router.routeReuseStrategy.shouldReuseRoute;
                this.router.routeReuseStrategy.shouldReuseRoute = () => {
                  return false;
                };
                this.router.navigate(['/pracownicy']).then(() => {
                    this.router.routeReuseStrategy.shouldReuseRoute = savedStrategy;
                })
              }
            );
          },
          error => console.error(error)
        );
    } else { // dodanie nowego pracownika
      this.subscriptions[0] = this.pracownicyService.addPracownik(updatedPracownik)
        .subscribe(
          data => {
            console.log(data);
            this.pracownicyService.getPracownicy().subscribe(
              ()=> {
                let savedStrategy = this.router.routeReuseStrategy.shouldReuseRoute;
                this.router.routeReuseStrategy.shouldReuseRoute = () => {
                  return false;
                };
                this.router.navigate(['/pracownicy']).then(() => {
                    this.router.routeReuseStrategy.shouldReuseRoute = savedStrategy;
                  }
                )
              }
            );
          },
          error => console.error(error)
        );
    }


  }

  onCancel() {
    this.location.back();
  }

  onAddFunction() {
    (<FormArray>this.pracownikForm.get('funkcje')).push(
      new FormGroup({
        'funkcja': new FormControl(null, Validators.required)
      })
    )
  }

  onDeleteFunction(i: number) {
    (<FormArray>this.pracownikForm.get('funkcje')).removeAt(i);
  }

  onAddPrzedmiot() {
    (<FormArray>this.pracownikForm.get('przedmioty')).push(
      new FormGroup({
        'przedmiot': new FormControl(null, Validators.required)
      })
    )
  }

  onDeletePrzedmiot(i: number) {
    (<FormArray>this.pracownikForm.get('przedmioty')).removeAt(i);
  }

  onCheckUnique() {

  }

}
