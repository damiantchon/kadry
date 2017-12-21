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

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      )
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

  private initForm () {

    let tempImie = '';
    let tempNazwisko = '';
    let tempStopien = '';
    let tempTytul = '';
    let tempSpecjalnosc = '';
    let tempEmail = '';
    let tempFunkcje = new FormArray([]);

    if (this.editMode){
      const pracownik = this.pracownicyService.getPracownikById(this.id);
      this.tempPracownik = pracownik;
      tempImie = pracownik.imie;
      tempNazwisko = pracownik.nazwisko;
      tempStopien = pracownik.stopien;
      tempTytul = pracownik.tytul;
      tempSpecjalnosc = pracownik.specjalnosc;
      tempEmail = pracownik.email;
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
      'imie': new FormControl(tempImie, [Validators.required]),
      'nazwisko': new FormControl(tempNazwisko, [Validators.required]),
      'stopien': new FormControl(tempStopien, [Validators.required]),
      'tytul': new FormControl(tempTytul, [Validators.required]),
      'specjalnosc': new FormControl(tempSpecjalnosc, [Validators.required]),
      'email': new FormControl(tempEmail, [Validators.required, Validators.email]),
      'funkcje': tempFunkcje
    });
    console.log(this.pracownikForm.controls)
  }

  onSubmit() {

    // przygotowanie tablicy funkcji
    let funkcje: any = [];
    this.pracownikForm.value.funkcje.forEach((funkcja) => {
      funkcje.push(funkcja.funkcja);
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
      funkcje
    );

    this.subscriptions[0] = this.pracownicyService.updatePracownik(updatedPracownik)
      .subscribe(
        data => {
          console.log(data);
          this.pracownicyService.getPracownicy().subscribe();
          this.router.navigate(['/pracownicy']);
        },
        error => console.error(error)
      );
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
}
