import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PracownikModel } from '../../../pracownicy/pracownik.model';
import { PracownicyService } from '../../../pracownicy/pracownicy.service';
import { PublikacjeService } from '../../publikacje.service';

@Component({
  selector: 'app-publikacje-item-start',
  templateUrl: './publikacje-item-start.component.html',
  styleUrls: ['./publikacje-item-start.component.css']
})
export class PublikacjeItemStartComponent implements OnInit {

  constructor(private router: Router,
              private pracownicyService: PracownicyService,
              private publikacjeService: PublikacjeService) { }

  pracownicy: PracownikModel[] = [];
  rodzajPublikacjiRaport: string = 'ALL';
  raportForm: FormGroup;

  ngOnInit() {
    this.pracownicy = this.pracownicyService.pracownicyList;
    this.pracownicy.sort((a, b) => {
      if(a.nazwisko < b.nazwisko) return -1;
      if(a.nazwisko > b.nazwisko) return 1;
      return 0;
    });
    this.raportForm = new FormGroup({
      'rodzajPublikacji': new FormControl('ALL', Validators.required),
      'rokPublikacjiOd': new FormControl(null),
      'rokPublikacjiDo': new FormControl(null),
      'pracownikId': new FormControl('')
    });
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

  onGenerujRaportOgolny(raportForm: FormGroup, action: string) {
    let pracownik: PracownikModel;
    if(raportForm.value.pracownikId !== '') {
      pracownik = this.pracownicyService.getPracownikById(raportForm.value.pracownikId);
    }
    let properties = {
      'rodzajPublikacji': raportForm.value.rodzajPublikacji,
      'rokPublikacjiOd': raportForm.value.rokPublikacjiOd,
      'rokPublikacjiDo': raportForm.value.rokPublikacjiDo,
      'pracownikId': raportForm.value.pracownikId,
      'pracownik': pracownik
    };
    this.publikacjeService.generatePublikacjaRaport(properties, action);
  }



}
