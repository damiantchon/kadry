import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { PracownikModel } from '../../pracownik.model';
import { PracownicyService } from '../../pracownicy.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PublikacjeService } from '../../../publikacje/publikacje.service';

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
      // console.log(this.pracownik);
      // console.log(this.pracownik.funkcje);
  }

  onTest() {
      this.pracownik.funkcje = null;
  }

  ngOnDestroy() {
      this.subscriptions[0].unsubscribe();
  }

  ngOnChanges() {
      console.log(this.pracownik.funkcje);
  }

  onSubmit() { // remove this
      const pracownik: PracownikModel = this.pracownik;
      this.pracownicyService.addPracownik(pracownik)
        .subscribe(
          data => console.log(data),
          error => console.error(error)
        );
  }

  onEdit() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onAddNew() {
    this.router.navigate(['pracownicy', 'new']);
  }

  onDelete() {
      if(this.publikacjeService.isAnAuthor(this.pracownik)){
        alert('Nie można usunąc pracownika, który jest współautorem publikacji');
      } else {
        let confirmation: string;
        confirmation = prompt("Aby usunąć tego pracownika, wpisz w poniższym polu jego imię i nazwisko. ("
          + this.pracownik.imie + " " + this.pracownik.nazwisko + ")");

        if(confirmation != null){
          if(confirmation.trim().toLowerCase() === (this.pracownik.imie + " " + this.pracownik.nazwisko).toLowerCase()) {
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
          }
        }
      }
  }
}

