import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MinimumKadroweModel } from '../minimum-kadrowe.model';
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
  lataAkademickie = [
    '2017/2018',
    '2018/2019',
    '2019/2020',
    '2020/2021',
    '2021/2022',
    '2022/2023',
    '2023/2024',
    '2024/2025',
    '2025/2026',
    '2026/2027',
    '2027/2028',
    '2028/2029',
    '2029/2030'
  ];

  pracownicyList: PracownikModel[] = [];

  id: string;
  editMode: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private minimumKadroweService: MinimumKadroweService,
              private pracownicyService: PracownicyService,
              private location: Location) {  }

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
    let tempKierunek = '';
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
      "rokAkademicki": new FormControl({value: tempRokAkademicki, disabled: this.editMode}, Validators.required),
      "doktorzyHabilitowani": tempDoktorzyHabilitowani,
      "doktorzy": tempDoktorzy
    });
    console.log(this.minimumKadroweForm.controls);
  }

  onSubmit() {
    console.log(this.minimumKadroweForm.value);
    let doktorzyHabilitowani: string[] = [];
    let doktorzy: string[] = [];

    this.minimumKadroweForm.value.doktorzyHabilitowani.forEach((doktor) => {
      doktorzyHabilitowani.push(doktor.pracownikId);
    });
    this.minimumKadroweForm.value.doktorzy.forEach((doktor) => {
      doktorzy.push(doktor.pracownikId);
    });

    let updatedMinimumKadrowe: MinimumKadroweModel = new MinimumKadroweModel(
      this.id,
      this.minimumKadroweForm.value.kierunek,
      this.minimumKadroweForm.value.rokAkademicki,
      doktorzyHabilitowani,
      doktorzy,
      false
    );
    console.log(updatedMinimumKadrowe);

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

}
