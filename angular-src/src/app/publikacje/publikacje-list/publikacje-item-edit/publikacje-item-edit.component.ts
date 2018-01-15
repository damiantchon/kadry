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
  redaktorzyWewnetrzniId: PracownikModel[] = [];
  autorzyWewnetrzniUnique: boolean = true;
  redaktorzyWewnetrzniUnique: boolean = true;
  pracownicyList: PracownikModel[] = [];
  id: string;
  editMode: boolean;
  rodzajPublikacji: string = '';

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

    console.log();
    if(this.route.snapshot.routeConfig.path === 'artykul') this.rodzajPublikacji = 'ATK';
    else if(this.route.snapshot.routeConfig.path === 'monografia') this.rodzajPublikacji = 'MG';
    else if(this.route.snapshot.routeConfig.path === 'rozdzial') this.rodzajPublikacji = 'MGR';

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
    let tempRodzajPublikacji: string = this.rodzajPublikacji;
    let tempAutorzyWewnetrzniId = new FormArray([]);
    let tempAutorzyZewnetrzni = new FormArray([]);
    let tempRedaktorzyWewnetrzniId = new FormArray([]);
    let tempRedaktorzyZewnetrzni = new FormArray([]);
    let tempTytulPublikacji: string = '';
    let tempRokPublikacji: number = 0;
    let tempJezykPublikacji: string = '';
    let tempTytulCzasopisma: string = '';
    let tempZeszyt: string = '';
    let tempStrony: string = '';
    let tempTytulRozdzialu: string = '';
    let tempISSN: string = '';
    let tempISBN: string = '';
    let tempWydawnictwo: string = '';
    let tempDOI: string = '';
    let tempPunkty: number = 0;

    if (this.editMode) {
      const publikacja = this.publikacjeService.getPublikacjaById(this.id);
      this.tempPublikacja = publikacja;
      this.rodzajPublikacji = publikacja.rodzajPublikacji;
      tempRodzajPublikacji = this.rodzajPublikacji;

      if(publikacja.autorzyWewnetrzniId) {
        publikacja.autorzyWewnetrzniId.forEach((id)=> {
          this.autorzyWewnetrzniId.push(this.pracownicyService.getPracownikById(id));
        });
      }

      if(publikacja.redaktorzyWewnetrzniId) {
        publikacja.redaktorzyWewnetrzniId.forEach((id) => {
          this.redaktorzyWewnetrzniId.push(this.pracownicyService.getPracownikById(id));
        });
      }

      tempTytulPublikacji = publikacja.tytulPublikacji;
      tempRokPublikacji = publikacja.rokPublikacji;
      tempJezykPublikacji = publikacja.jezykPublikacji;
      tempTytulCzasopisma = publikacja.tytulCzasopisma;
      tempZeszyt = publikacja.zeszyt;
      tempStrony = publikacja.strony;
      tempTytulRozdzialu = publikacja.tytulRozdzialu;
      tempISSN = publikacja.ISSN;
      tempISBN = publikacja.ISBN;
      tempWydawnictwo = publikacja.wydawnictwo;
      tempDOI = publikacja.DOI;
      tempPunkty = publikacja.punkty;

      if (publikacja.autorzyWewnetrzniId) {
        for (let autor of this.autorzyWewnetrzniId) {
          tempAutorzyWewnetrzniId.push(
            new FormGroup(
              {
                'autorId': new FormControl((autor._id), Validators.required)
              }
            )
          )
        }
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
      if (publikacja.redaktorzyWewnetrzniId) {
        for (let redaktor of this.redaktorzyWewnetrzniId) {
          tempRedaktorzyWewnetrzniId.push(
            new FormGroup(
              {
                'redaktorId': new FormControl((redaktor._id), Validators.required)
              }
            )
          )
        }
      }
      if (publikacja.redaktorzyZewnetrzni) {
        for (let redaktor of publikacja.autorzyZewnetrzni) {
          tempRedaktorzyZewnetrzni.push(
            new FormGroup({
              'redaktor': new FormControl(redaktor, Validators.required)
            })
          )
        }
      }
    }
    // Ustawienie odpowiedniej walidacji
    if(this.rodzajPublikacji === 'ATK'){
      this.publikacjaForm = new FormGroup({
        'rodzajPublikacji': new FormControl(tempRodzajPublikacji, Validators.required),
        'autorzyWewnetrzniId': tempAutorzyWewnetrzniId,
        'autorzyZewnetrzni': tempAutorzyZewnetrzni,
        'redaktorzyWewnetrzniId': tempRedaktorzyWewnetrzniId,
        'redaktorzyZewnetrzni': tempRedaktorzyZewnetrzni,
        'tytulPublikacji': new FormControl(tempTytulPublikacji, Validators.required),
        'rokPublikacji': new FormControl(tempRokPublikacji, Validators.required),
        'jezykPublikacji': new FormControl(tempJezykPublikacji, Validators.required),
        'tytulCzasopisma': new FormControl(tempTytulCzasopisma, Validators.required),
        'zeszyt': new FormControl(tempZeszyt, Validators.required),
        'strony': new FormControl(tempStrony, Validators.required),
        'tytulRozdzialu': new FormControl(tempTytulRozdzialu),
        'ISSN': new FormControl(tempISSN, Validators.required),
        'ISBN': new FormControl(tempISBN),
        'wydawnictwo': new FormControl(tempWydawnictwo),
        'DOI': new FormControl(tempDOI),
        'punkty': new FormControl(tempPunkty, Validators.required)
      });
    } else if (this.rodzajPublikacji === 'MG') {
      this.publikacjaForm = new FormGroup({
        'rodzajPublikacji': new FormControl(tempRodzajPublikacji, Validators.required),
        'autorzyWewnetrzniId': tempAutorzyWewnetrzniId,
        'autorzyZewnetrzni': tempAutorzyZewnetrzni,
        'redaktorzyWewnetrzniId': tempRedaktorzyWewnetrzniId,
        'redaktorzyZewnetrzni': tempRedaktorzyZewnetrzni,
        'tytulPublikacji': new FormControl(tempTytulPublikacji, Validators.required),
        'rokPublikacji': new FormControl(tempRokPublikacji, Validators.required),
        'jezykPublikacji': new FormControl(tempJezykPublikacji, Validators.required),
        'tytulCzasopisma': new FormControl(tempTytulCzasopisma),
        'zeszyt': new FormControl(tempZeszyt),
        'strony': new FormControl(tempStrony),
        'tytulRozdzialu': new FormControl(tempTytulRozdzialu),
        'ISSN': new FormControl(tempISSN),
        'ISBN': new FormControl(tempISBN, Validators.required),
        'wydawnictwo': new FormControl(tempWydawnictwo, Validators.required),
        'DOI': new FormControl(tempDOI),
        'punkty': new FormControl(tempPunkty, Validators.required)
      });
    } else if (this.rodzajPublikacji === 'MGR') {
      this.publikacjaForm = new FormGroup({
        'rodzajPublikacji': new FormControl(tempRodzajPublikacji, Validators.required),
        'autorzyWewnetrzniId': tempAutorzyWewnetrzniId,
        'autorzyZewnetrzni': tempAutorzyZewnetrzni,
        'redaktorzyWewnetrzniId': tempRedaktorzyWewnetrzniId,
        'redaktorzyZewnetrzni': tempRedaktorzyZewnetrzni,
        'tytulPublikacji': new FormControl(tempTytulPublikacji, Validators.required),
        'rokPublikacji': new FormControl(tempRokPublikacji, Validators.required),
        'jezykPublikacji': new FormControl(tempJezykPublikacji, Validators.required),
        'tytulCzasopisma': new FormControl(tempTytulCzasopisma),
        'zeszyt': new FormControl(tempZeszyt),
        'strony': new FormControl(tempStrony),
        'tytulRozdzialu': new FormControl(tempTytulRozdzialu, Validators.required),
        'ISSN': new FormControl(tempISSN),
        'ISBN': new FormControl(tempISBN, Validators.required),
        'wydawnictwo': new FormControl(tempWydawnictwo, Validators.required),
        'DOI': new FormControl(tempDOI),
        'punkty': new FormControl(tempPunkty, Validators.required)
      });
    }
  }

  onSubmit() {
    console.log(this.publikacjaForm);

    let autorzyWewnetrzniId: string[] = [];
    let autorzyZewnetrzni: string[] = [];
    let redaktorzyWewnetrzniId: string[] = [];
    let redaktorzyZewnetrzni: string[] = [];
    this.publikacjaForm.value.autorzyWewnetrzniId.forEach((autor) => {
      autorzyWewnetrzniId.push(autor.autorId);
    });
    this.publikacjaForm.value.autorzyZewnetrzni.forEach((autor) => {
      autorzyZewnetrzni.push(autor.autor);
    });
    this.publikacjaForm.value.redaktorzyWewnetrzniId.forEach((redaktor) => {
      redaktorzyWewnetrzniId.push(redaktor.redaktorId);
    });
    this.publikacjaForm.value.redaktorzyZewnetrzni.forEach((redaktor) => {
      redaktorzyZewnetrzni.push(redaktor.redaktor);
    });

    // przygotowanie publikacji
    let updatedPublikacja: PublikacjaModel = new PublikacjaModel(
      this.id,
      this.publikacjaForm.value.rodzajPublikacji,
      autorzyWewnetrzniId,
      autorzyZewnetrzni,
      redaktorzyWewnetrzniId,
      redaktorzyZewnetrzni,
      this.publikacjaForm.value.tytulPublikacji,
      this.publikacjaForm.value.rokPublikacji,
      this.publikacjaForm.value.jezykPublikacji,
      this.publikacjaForm.value.tytulCzasopisma,
      this.publikacjaForm.value.zeszyt,
      this.publikacjaForm.value.strony,
      this.publikacjaForm.value.tytulRozdzialu,
      this.publikacjaForm.value.ISSN,
      this.publikacjaForm.value.ISBN,
      this.publikacjaForm.value.wydawnictwo,
      this.publikacjaForm.value.DOI,
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

  onDeleteRedaktorWewnetrzny(i: number){
    this.publikacjaForm.markAsDirty();
    (<FormArray>this.publikacjaForm.get('redaktorzyWewnetrzniId')).removeAt(i);
  }

  onDeleteRedaktorZewnetrzny(i: number) {
    this.publikacjaForm.markAsDirty();
    (<FormArray>this.publikacjaForm.get('redaktorzyZewnetrzni')).removeAt(i);
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

  onAddRedaktorWewnetrzny() {
    (<FormArray>this.publikacjaForm.get('redaktorzyWewnetrzniId')).push(
      new FormGroup(
        {
          'redaktorId': new FormControl(null, Validators.required)
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

  onAddRedaktorZewnetrzny() {
    (<FormArray>this.publikacjaForm.get('redaktorzyZewnetrzni')).push(
      new FormGroup(
        {
          'redaktor': new FormControl(null, Validators.required)
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

  onCheckUniqueRed() {
    console.log(this.publikacjaForm.value.redaktorzyWewnetrzniId);
    let idArray: any[] = [];
    this.publikacjaForm.value.redaktorzyWewnetrzniId.forEach((redaktor) => {
      idArray.push(redaktor.redaktorId);
    });
    console.log(this.checkIfArrayIsUniqueAndNotEmpty(idArray));
    this.redaktorzyWewnetrzniUnique = this.checkIfArrayIsUniqueAndNotEmpty(idArray);
  }

}
