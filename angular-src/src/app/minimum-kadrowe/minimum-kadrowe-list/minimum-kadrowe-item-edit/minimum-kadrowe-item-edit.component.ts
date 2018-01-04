import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MinimumKadroweModel } from '../../minimum-kadrowe.model';
import { Subscription } from 'rxjs/Subscription';
import { Location } from '@angular/common';
import { PracownikModel } from '../../../pracownicy/pracownik.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MinimumKadroweService } from '../../minimum-kadrowe.service';
import { PracownicyService } from '../../../pracownicy/pracownicy.service';

@Component({
  selector: 'app-minimum-kadrowe-item-edit',
  templateUrl: './minimum-kadrowe-item-edit.component.html',
  styleUrls: ['./minimum-kadrowe-item-edit.component.css']
})
export class MinimumKadroweItemEditComponent implements OnInit {

  minimumKadroweForm: FormGroup;
  tempMinimumKadrowe: MinimumKadroweModel = null;
  subscriptions: Subscription[] = [];
  doktorzyHabilitowani: PracownikModel[] = [];
  doktorzy: PracownikModel[] = [];


  pracownicyUnique: boolean = true;
  wrongPracownicy: number = 0;
  minimumKadroweUnique: boolean = true;

  lataAkademickie = [
    '2017/2018',
    '2018/2019',
    '2019/2020',
    '2020/2021',
    '2021/2022',
    '2022/2023',
    '2023/2024',
    '2024/2025'
  ];

  stopnie = [
    'pierwszy',
    'drugi'
  ];

  pracownicyList: PracownikModel[] = [];
  pracownicyListDH: PracownikModel[] = [];
  pracownicyListD: PracownikModel[] = [];

  id: string;
  editMode: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private minimumKadroweService: MinimumKadroweService,
              private pracownicyService: PracownicyService,
              private location: Location) {  }

  ngOnInit() {
    this.pracownicyList = this.pracownicyService.pracownicyList;

    this.pracownicyList.forEach((pracownik) => {
      if(pracownik.tytul.includes('dr')){
        this.pracownicyListD.push(pracownik);
       if(pracownik.tytul.includes('hab')){
         this.pracownicyListDH.push(pracownik);
       }
      }
    });

    let sortByNazwisko = (a, b) => {
      if(a.nazwisko < b.nazwisko) return -1;
      if(a.nazwisko > b.nazwisko) return 1;
      return 0;
    };

    this.pracownicyListDH.sort(sortByNazwisko);
    this.pracownicyListD.sort(sortByNazwisko);
    this.pracownicyList.sort(sortByNazwisko);
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
    let tempKierunek = '';
    let tempStopien = '';
    let tempRokAkademicki = '';
    let tempDoktorzyHabilitowani = new FormArray([]);
    let tempDoktorzy = new FormArray([]);

    if(this.editMode) {
      const minimumKadrowe = this.minimumKadroweService.getMinimumKadroweById(this.id);
      this.tempMinimumKadrowe = minimumKadrowe;

      minimumKadrowe.doktorzyHabilitowani.forEach((id) => {
        this.doktorzyHabilitowani.push(this.pracownicyService.getPracownikById(id));
      });
      minimumKadrowe.doktorzy.forEach((id) => {
        this.doktorzy.push(this.pracownicyService.getPracownikById(id));
      });
      tempKierunek = minimumKadrowe.kierunek;
      tempStopien = minimumKadrowe.stopien;
      tempRokAkademicki = minimumKadrowe.rokAkademicki;
      if(minimumKadrowe.doktorzyHabilitowani){
        for (let pracownik of this.doktorzyHabilitowani) {
          tempDoktorzyHabilitowani.push(
            new FormGroup({
              'pracownikId': new FormControl((pracownik._id), Validators.required)
            })
          )
        }
      }
      if(minimumKadrowe.doktorzy){
        for (let pracownik of this.doktorzy) {
          tempDoktorzy.push(
            new FormGroup({
              'pracownikId': new FormControl((pracownik._id), Validators.required)
            })
          );
        }
      }
    }

    this.minimumKadroweForm = new FormGroup({
      "kierunek": new FormControl({value: tempKierunek, disabled: this.editMode}, Validators.required),
      "stopien": new FormControl({value: tempStopien, disabled: this.editMode}, Validators.required),
      "rokAkademicki": new FormControl({value: tempRokAkademicki, disabled: this.editMode}, Validators.required),
      "doktorzyHabilitowani": tempDoktorzyHabilitowani,
      "doktorzy": tempDoktorzy
    });
    console.log(this.minimumKadroweForm.controls);
  }

  onSubmit() {

    //Przygotowanie mimimum kadrowego do zapisu
    let doktorzyHabilitowani: string[] = [];
    let doktorzy: string[] = [];

    this.minimumKadroweForm.value.doktorzyHabilitowani.forEach((doktor) => {
      doktorzyHabilitowani.push(doktor.pracownikId);
    });
    this.minimumKadroweForm.value.doktorzy.forEach((doktor) => {
      doktorzy.push(doktor.pracownikId);
    });

    let poprawne = false;
    if(this.minimumKadroweForm.controls['doktorzyHabilitowani'].value.length === 3
    && this.minimumKadroweForm.controls['doktorzy'].value.length === 6) {
      poprawne = true;
    }

    let updatedMinimumKadrowe: MinimumKadroweModel = new MinimumKadroweModel(
      this.id,
      this.minimumKadroweForm.value.kierunek,
      this.minimumKadroweForm.value.stopien,
      this.minimumKadroweForm.value.rokAkademicki,
      doktorzyHabilitowani,
      doktorzy,
      poprawne
    );
    //Koniec przygotowania mimimum kadrowego do zapisu



    if(this.editMode === true) {
      this.subscriptions[0] = this.minimumKadroweService.updateMinimumKadrowe(updatedMinimumKadrowe)
        .subscribe(
          data => {
            console.log(data);
            this.minimumKadroweService.getMinimaKadrowe().subscribe(
              () => {
                let savedStrategy = this.router.routeReuseStrategy.shouldReuseRoute;
                this.router.routeReuseStrategy.shouldReuseRoute = () => {
                  return false;
                };
                this.router.navigate(['/minimum-kadrowe']).then(()=>{
                  this.router.routeReuseStrategy.shouldReuseRoute = savedStrategy;
                })
              }
            )
          }
        )
    } else {
      this.subscriptions[0] = this.minimumKadroweService.addMinimumKadrowe(updatedMinimumKadrowe)
        .subscribe(
          data => {
            console.log(data);
            this.minimumKadroweService.getMinimaKadrowe().subscribe(
              () => {
                let savedStrategy = this.router.routeReuseStrategy.shouldReuseRoute;
                this.router.routeReuseStrategy.shouldReuseRoute = () => {
                  return false;
                };
                this.router.navigate(['/minimum-kadrowe']).then(()=>{
                  this.router.routeReuseStrategy.shouldReuseRoute = savedStrategy;
                })
              }
            )
          }
        )
    }
  }

  onCancel() {
    this.location.back();
  }

  onAddDoktorHabilitowany() {
    (<FormArray>this.minimumKadroweForm.get('doktorzyHabilitowani')).push(
      new FormGroup(
        {
          'pracownikId': new FormControl(null, Validators.required)
        }
      )
    )
  }

  onDeleteDoktorHabilitowany (i: number) {
    this.minimumKadroweForm.markAsDirty();
    (<FormArray>this.minimumKadroweForm.get('doktorzyHabilitowani')).removeAt(i);
  }

  onAddDoktor() {
    (<FormArray>this.minimumKadroweForm.get('doktorzy')).push(
      new FormGroup(
        {
          'pracownikId': new FormControl(null, Validators.required)
        }
      )
    )
  }

  onDeleteDoktor (i: number) {
    this.minimumKadroweForm.markAsDirty();
    (<FormArray>this.minimumKadroweForm.get('doktorzy')).removeAt(i);
  }

  checkIfArrayIsUniqueAndNotEmpty(myArray) {
    if(myArray === []) {
      return false;
    }else{
      return myArray.length === new Set(myArray).size;
    }
  }

  onCheckUnique() {
    let idArray: any[] = [];
    this.minimumKadroweForm.value.doktorzyHabilitowani.forEach((pracownik) => {
      idArray.push(pracownik.pracownikId);
    });
    this.minimumKadroweForm.value.doktorzy.forEach((pracownik) => {
      idArray.push(pracownik.pracownikId);
    });
    this.pracownicyUnique = this.checkIfArrayIsUniqueAndNotEmpty(idArray);
  }

  checkIfEligible(pracownikId: string, alert: boolean, index?: number, habilitowany?: boolean) {
    console.log(pracownikId);
    let tegoroczneMinimaKadrowe: MinimumKadroweModel[] = this.getTegoroczneMinimaKadrowe();
    console.log(tegoroczneMinimaKadrowe);
    let minimaKadrowePracownika: MinimumKadroweModel[] = [];
    tegoroczneMinimaKadrowe.forEach((minimumKadrowe) => {
      if(minimumKadrowe.doktorzy.includes(pracownikId) || minimumKadrowe.doktorzyHabilitowani.includes(pracownikId)){
        minimaKadrowePracownika.push(minimumKadrowe);
      }
    });
    console.log(minimaKadrowePracownika);

    if(this.editMode) {
      console.log('ID' + this.tempMinimumKadrowe._id);
      minimaKadrowePracownika = minimaKadrowePracownika.filter((minimumKadrowe) => {
        return minimumKadrowe._id !== this.tempMinimumKadrowe._id;
      })
    }

    let concatMeMinimumKadrowe = new MinimumKadroweModel(
      'temporaryId',
      this.minimumKadroweForm.get('kierunek').value,
      this.minimumKadroweForm.get('stopien').value,
      this.minimumKadroweForm.get('rokAkademicki').value,
      [],
      [],
      false
    );
    console.log(concatMeMinimumKadrowe);
    console.log(minimaKadrowePracownika);
    let tempMinimaNames: string = '';
    minimaKadrowePracownika.forEach((minimum) => {
      tempMinimaNames = tempMinimaNames.concat(minimum.kierunek.bold() + ' (' + minimum.stopien + ' stopien), ');
    });
    let minimaDoSprawdzenia = minimaKadrowePracownika.concat(concatMeMinimumKadrowe);
    console.log(minimaDoSprawdzenia);
    console.log(this.setupIsCorrect(minimaDoSprawdzenia));
    if(event) {
      console.log(event);
    }
    if(!this.setupIsCorrect(minimaDoSprawdzenia) && alert) {
      let pracownik = this.pracownicyService.getPracownikById(pracownikId);
      bootbox.alert({
        message: 'Pracownik ' + pracownik.imie + ' ' + pracownik.nazwisko +
          ' jest już wliczany do minimów kadrowych: ' + tempMinimaNames +
          ' więc nie może być już doliczony do tego minimum kadrowego.',
        callback: () => {
          if(index !== null) { //resetowanie formularza w przypadku błędnego pracownika
            console.log(index);
              if(habilitowany){
                (<FormArray>this.minimumKadroweForm.get('doktorzyHabilitowani')).controls[index].reset();
              }else{
                (<FormArray>this.minimumKadroweForm.get('doktorzy')).controls[index].reset();
              }
          }
        }
      });
    }

    return this.setupIsCorrect(minimaDoSprawdzenia);
  }

  setupIsCorrect(minimaKadrowe: MinimumKadroweModel[]) {
    if (minimaKadrowe.length === 1) {
      return true;
    } else if (minimaKadrowe.length === 2) {
      if (minimaKadrowe[0].stopien === 'pierwszy' || minimaKadrowe[1].stopien === 'pierwszy') {
        return true;
      }
    } else if (minimaKadrowe.length === 3) {
      let minimaPierwszegoStopnia = minimaKadrowe.filter((minimum) => {
        return minimum.stopien === 'pierwszy';
      });
      let minimaDrugiegoStopnia = minimaKadrowe.filter((minimum) => {
        return minimum.stopien === 'drugi';
      });
      if (minimaPierwszegoStopnia.length === 2) {
        if (minimaPierwszegoStopnia[0].kierunek === minimaDrugiegoStopnia[0].kierunek ||
            minimaPierwszegoStopnia[1].kierunek === minimaDrugiegoStopnia[0].kierunek) {
          return true;
        }
      }
    }
    return false;
  }

  checkIfMinimumAlreadyExist() {
    let newRokAkademicki = this.minimumKadroweForm.get('rokAkademicki').value;
    let newStopien = this.minimumKadroweForm.get('stopien').value;
    let newKierunek = this.minimumKadroweForm.get('kierunek').value;

    let tegoroczneMinimaKadrowe: MinimumKadroweModel[] = this.getTegoroczneMinimaKadrowe();
    if(newRokAkademicki && newStopien && newKierunek) {
      if(tegoroczneMinimaKadrowe.length === 0) {
        this.minimumKadroweUnique = true;
        return;
      }

      for (let minimumKadrowe of tegoroczneMinimaKadrowe) {
        if(minimumKadrowe.kierunek === newKierunek &&
           minimumKadrowe.stopien === newStopien &&
           minimumKadrowe.rokAkademicki === newRokAkademicki){
          this.minimumKadroweUnique = false;
          return;
        }
        else{
          this.minimumKadroweUnique = true;
        }
      }
    }
  }


  getTegoroczneMinimaKadrowe() {
    return this.minimumKadroweService.minimaKadroweList.filter((minimumKadrowe =>
      minimumKadrowe.rokAkademicki === this.minimumKadroweForm.get('rokAkademicki').value));
  }
}
