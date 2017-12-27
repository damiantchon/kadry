import { Component, OnDestroy, OnInit } from '@angular/core';
import { PublikacjaModel } from '../../publikacja.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PublikacjeService } from '../../publikacje.service';
import { PracownikModel } from '../../../pracownicy/pracownik.model';
import { PracownicyService } from '../../../pracownicy/pracownicy.service';

@Component({
  selector: 'app-publikacje-item-edit',
  templateUrl: './publikacje-item-edit.component.html',
  styleUrls: ['./publikacje-item-edit.component.css']
})
export class PublikacjeItemEditComponent implements OnInit, OnDestroy {

  publikacjaForm: FormGroup;
  tempPublikacja: PublikacjaModel = null;
  subscriptions: Subscription[] = [];
  autorzyWewnetrzniId: PracownikModel[] = [];

  autorzyWewnetrzniUnique: boolean = true;

  pracownicyList: PracownikModel[] = [];


  id: string;
  editMode: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private publikacjeService: PublikacjeService,
              private pracownicyService: PracownicyService,
              private location: Location) { }

  ngOnInit() {
    this.pracownicyList = this.pracownicyService.pracownicyList;

    this.pracownicyList.sort((a, b) => {
      if(a.nazwisko < b.nazwisko) return -1;
      if(a.nazwisko > b.nazwisko) return 1;
      return 0;
    });

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
  }

  initForm() {
    let tempAutorzyWewnetrzniId = new FormArray([], Validators.required);
    let tempAutorzyZewnetrzni = new FormArray([]);
    let tempTytulPublikacji: string = '';
    let tempTytulCzasopisma: string = '';
    let tempWolumin: string = '';
    let tempWydanie: string = '';
    let tempRokPublikacji: string = '';
    let tempStrony: string = '';
    let tempDoi: string = '';
    let tempPunkty: number = 0;

    if (this.editMode) {
      const publikacja = this.publikacjeService.getPublikacjaById(this.id);
      this.tempPublikacja = publikacja;

      publikacja.autorzyWewnetrzniId.forEach((id)=> {
        this.autorzyWewnetrzniId.push(this.pracownicyService.getPracownikById(id));
      });


      tempTytulPublikacji = publikacja.tytulPublikacji;
      tempTytulCzasopisma = publikacja.tytulCzasopisma;
      tempWolumin = publikacja.wolumin;
      tempWydanie = publikacja.wydanie;
      tempRokPublikacji = publikacja.rokPublikacji;
      tempStrony = publikacja.strony;
      tempDoi = publikacja.doi;
      tempPunkty = publikacja.punkty;
      for (let autor of this.autorzyWewnetrzniId) {
        tempAutorzyWewnetrzniId.push(
          new FormGroup(
            {
              'autorId': new FormControl((autor._id), Validators.required)
            }
          )
        )
      }
      if (publikacja.autorzyZewnetrzni) {
        for (let autor of publikacja.autorzyZewnetrzni) {
          tempAutorzyZewnetrzni.push(
            new FormGroup(
              {
                'autor': new FormControl(autor, Validators.required)
              }
            )
          );
        }
      }
    }

    this.publikacjaForm = new FormGroup({
      'autorzyWewnetrzniId': tempAutorzyWewnetrzniId,
      'autorzyZewnetrzni': tempAutorzyZewnetrzni,
      'tytulPublikacji': new FormControl(tempTytulPublikacji, Validators.required),
      'tytulCzasopisma': new FormControl(tempTytulCzasopisma, Validators.required),
      'wolumin': new FormControl(tempWolumin, Validators.required),
      'wydanie': new FormControl(tempWydanie, Validators.required),
      'rokPublikacji': new FormControl(tempRokPublikacji, Validators.required),
      'strony': new FormControl(tempStrony, Validators.required),
      'doi': new FormControl(tempDoi, Validators.required),
      'punkty': new FormControl(tempPunkty, Validators.required)
    });
    console.log(this.publikacjaForm.controls);
  }

  onSubmit() {

    let autorzyWewnetrzniId: string[] = [];
    let autorzyZewnetrzni: string[] = [];
    this.publikacjaForm.value.autorzyWewnetrzniId.forEach((autor) => {
      autorzyWewnetrzniId.push(autor.autorId);
    });
    this.publikacjaForm.value.autorzyZewnetrzni.forEach((autor) => {
      autorzyZewnetrzni.push(autor.autor);
    });

    // przygotowanie publikacji
    let updatedPublikacja: PublikacjaModel = new PublikacjaModel(
      this.id,
      autorzyWewnetrzniId,
      autorzyZewnetrzni,
      this.publikacjaForm.value.tytulPublikacji,
      this.publikacjaForm.value.tytulCzasopisma,
      this.publikacjaForm.value.wolumin,
      this.publikacjaForm.value.wydanie,
      this.publikacjaForm.value.rokPublikacji,
      this.publikacjaForm.value.strony,
      this.publikacjaForm.value.doi,
      this.publikacjaForm.value.punkty
    );
    console.log(updatedPublikacja);

    if(this.editMode === true) { // edycja istniejącej publikacji
      this.subscriptions[0] = this.publikacjeService.updatePublikacja(updatedPublikacja)
        .subscribe(
          data => {
            console.log(data);
            this.publikacjeService.getPublikacje().subscribe(
              () => {
                let savedStrategy = this.router.routeReuseStrategy.shouldReuseRoute;
                this.router.routeReuseStrategy.shouldReuseRoute = () => {
                  return false;
                };
                this.router.navigate(['/publikacje']).then(()=>{
                  this.router.routeReuseStrategy.shouldReuseRoute = savedStrategy;
                })
              }
            )
          }
        )
    } else { // dodanie nowej publikacji
      this.subscriptions[0] = this.publikacjeService.addPublikacja(updatedPublikacja)
        .subscribe(
          data => {
            console.log(data);
            this.pracownicyService.getPracownicy().subscribe(
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
            );
          },
          error => console.error(error)
        )
    }

  }

  onCancel() {
    this.location.back();
  }

  onDeleteAutorWewnetrzny(i: number){
    this.publikacjaForm.markAsDirty();
    (<FormArray>this.publikacjaForm.get('autorzyWewnetrzniId')).removeAt(i);
  }

  onDeleteAutorZewnetrzny(i: number) {
    this.publikacjaForm.markAsDirty();
    (<FormArray>this.publikacjaForm.get('autorzyZewnetrzni')).removeAt(i);
  }

  onAddAutorWewnetrzny() {
    (<FormArray>this.publikacjaForm.get('autorzyWewnetrzniId')).push(
      new FormGroup(
        {
          'autorId': new FormControl(null, Validators.required)
        }
      )
    )
  }

  onAddAutorZewnetrzny() {
    (<FormArray>this.publikacjaForm.get('autorzyZewnetrzni')).push(
      new FormGroup(
        {
          'autor': new FormControl(null, Validators.required)
        }
      )
    )
  }

  checkIfArrayIsUniqueAndNotEmpty(myArray) {
    if(myArray === []) {
      return false;
    }else{
      return myArray.length === new Set(myArray).size;
    }
  }

  onCheckUnique() {
    console.log(this.publikacjaForm.value.autorzyWewnetrzniId);
    let idArray: any[] = [];
    this.publikacjaForm.value.autorzyWewnetrzniId.forEach((autor) => {
      idArray.push(autor.autorId);
    });
    console.log(this.checkIfArrayIsUniqueAndNotEmpty(idArray));
    this.autorzyWewnetrzniUnique = this.checkIfArrayIsUniqueAndNotEmpty(idArray);
  }

}
