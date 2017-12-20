import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { PracownicyService } from '../../pracownicy.service';
import { Location } from '@angular/common';
import { PracownikModel } from '../../pracownik.model';

@Component({
  selector: 'app-pracownicy-item-edit',
  templateUrl: './pracownicy-item-edit.component.html',
  styleUrls: ['./pracownicy-item-edit.component.css']
})
export class PracownicyItemEditComponent implements OnInit {

  pracownikForm: FormGroup;
  tempPracownik: PracownikModel = null;

  constructor(private route: ActivatedRoute,
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

  private initForm () {

    let tempImie = '';
    let tempNazwisko = '';
    let tempStopien = '';
    let tempTytul = '';
    let tempSpecjalnosc = '';
    let tempEmail = '';

    if (this.editMode){
      const pracownik = this.pracownicyService.getPracownikById(this.id);
      this.tempPracownik = pracownik;
      tempImie = pracownik.imie;
      tempNazwisko = pracownik.nazwisko;
      tempStopien = pracownik.stopien;
      tempTytul = pracownik.tytul;
      tempSpecjalnosc = pracownik.specjalnosc;
      tempEmail = pracownik.email;
    }

    this.pracownikForm = new FormGroup({
      'imie': new FormControl(tempImie, [Validators.required]),
      'nazwisko': new FormControl(tempNazwisko, [Validators.required]),
      'stopien': new FormControl(tempStopien, [Validators.required]),
      'tytul': new FormControl(tempTytul, [Validators.required]),
      'specjalnosc': new FormControl(tempSpecjalnosc, [Validators.required]),
      'email': new FormControl(tempEmail, [Validators.required, Validators.email]),
    });
  }

  onSubmit() {
    console.log(this.pracownikForm);
  }

  onCancel() {
    this.location.back();
  }

}
