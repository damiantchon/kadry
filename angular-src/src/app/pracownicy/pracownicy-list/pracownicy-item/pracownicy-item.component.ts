import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { PracownikModel } from '../../pracownik.model';
import { PracownicyService } from '../../pracownicy.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PublikacjeService } from '../../../publikacje/publikacje.service';
import 'bootbox';

@Component({
  selector: 'app-pracownicy-item',
  templateUrl: './pracownicy-item.component.html',
  styleUrls: ['./pracownicy-item.component.css']
})
export class PracownicyItemComponent implements OnInit, OnDestroy, OnChanges{

  subscriptions: Subscription[] = [];

  id: string;
  pracownik: PracownikModel;

    constructor(private pracownicyService: PracownicyService,
                private publikacjeService: PublikacjeService,
                private route: ActivatedRoute,
                private router: Router) { }

  ngOnInit() {
      this.subscriptions[0] = this.route.params
        .subscribe(
          (params: Params) => {
            this.id = params['id'];
            this.pracownik = this.pracownicyService.getPracownikById(this.id);
            console.log(this.pracownik);
          }
        );
  }

  ngOnDestroy() {
      this.subscriptions[0].unsubscribe();
  }

  ngOnChanges() {
      console.log(this.pracownik.funkcje);
  }

  onEdit() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onAddNew() {
    this.router.navigate(['pracownicy', 'new']);
  }

  onDelete() {
      if(this.publikacjeService.isAnAuthor(this.pracownik)){
        bootbox.alert({message: 'Nie można usunąc pracownika, który jest współautorem publikacji', backdrop: true});
      } else {
        bootbox.prompt({
          title: "Potwierdź usunięcie pracownika wpusjąc jego imię i nazwisko ("
          + this.pracownik.imie + " " + this.pracownik.nazwisko + ")",
          callback: (result) => {
          if(result != null){
            if(result.trim().toLowerCase() === (this.pracownik.imie + " " + this.pracownik.nazwisko).toLowerCase()) {
              this.pracownicyService.deletePracownik(this.pracownik)
                .subscribe((result) => {
                  console.log(result);
                  this.pracownicyService.getPracownicy().subscribe(
                    () => {
                      let savedStrategy = this.router.routeReuseStrategy.shouldReuseRoute;
                      this.router.routeReuseStrategy.shouldReuseRoute = () => {
                        return false;
                      };
                      this.router.navigate(['/pracownicy']).then(() => {
                          this.router.routeReuseStrategy.shouldReuseRoute = savedStrategy;
                        }
                      )
                    });
                });
            } else {
              bootbox.alert({message: 'Wprowadzono niepoprawne dane', backdrop: true});
            }
          }
        }
        });
      }
  }
}

