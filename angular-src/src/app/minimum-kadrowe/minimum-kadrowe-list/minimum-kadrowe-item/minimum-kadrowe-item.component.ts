import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MinimumKadroweService } from '../../minimum-kadrowe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MinimumKadroweModel } from '../../minimum-kadrowe.model';
import { PracownikModel } from '../../../pracownicy/pracownik.model';
import { PracownicyService } from '../../../pracownicy/pracownicy.service';

@Component({
  selector: 'app-minimum-kadrowe-item',
  templateUrl: './minimum-kadrowe-item.component.html',
  styleUrls: ['./minimum-kadrowe-item.component.css']
})
export class MinimumKadroweItemComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  id: string;
  minimumKadrowe: MinimumKadroweModel;
  doktorzyHabilitowani: PracownikModel[] = [];
  doktorzy: PracownikModel[] = [];

  constructor(private minimumKadroweService: MinimumKadroweService,
              private pracownicyService: PracownicyService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.subscriptions[0] = this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.minimumKadrowe = this.minimumKadroweService.getMinimumKadroweById(this.id);
          this.doktorzyHabilitowani = [];
          this.minimumKadrowe.doktorzyHabilitowani.forEach((id) => {
              this.doktorzyHabilitowani.push(this.pracownicyService.getPracownikById(id));
          });
          this.doktorzy = [];
          this.minimumKadrowe.doktorzy.forEach((id) => {
            this.doktorzy.push(this.pracownicyService.getPracownikById(id));
          });
        }
      )
  }

  ngOnDestroy() {
    if(this.subscriptions[0]){
      this.subscriptions[0].unsubscribe();
    }
  }

  onAddNew() {
    this.router.navigate(['/minimum-kadrowe', 'new']);
  }

  onEdit() {
    this.router.navigate(['edit'], {relativeTo: this.route})
  }

  onDelete() {

    bootbox.confirm({
      message: "Czy na pewno chcesz usunąć to minimum kadrowe ? <br>" +
        "Kierunek: " + this.minimumKadrowe.kierunek.bold() + "<br>" +
        "Stopień: " + this.minimumKadrowe.stopien.bold() + "<br>" +
        "Rok Akademicki: " + this.minimumKadrowe.rokAkademicki.bold(),
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
          this.minimumKadroweService.deleteMinimumKadrowe(this.minimumKadrowe)
            .subscribe((result) => {
              console.log(result);
              this.minimumKadroweService.getMinimaKadrowe().subscribe(
                () => {
                  let savedStrategy = this.router.routeReuseStrategy.shouldReuseRoute;
                  this.router.routeReuseStrategy.shouldReuseRoute = () => {
                    return false;
                  };
                  this.router.navigate(['/minimum-kadrowe']).then(() => {
                      this.router.routeReuseStrategy.shouldReuseRoute = savedStrategy;
                    }
                  )
                });
            });
        }
      }
    });
  }

}
