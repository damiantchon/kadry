import { Component, OnDestroy, OnInit } from '@angular/core';
import { PracownikModel } from '../pracownik.model';
import { PracownicyService } from '../pracownicy.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-pracownicy-item',
  templateUrl: './pracownicy-item.component.html',
  styleUrls: ['./pracownicy-item.component.css']
})
export class PracownicyItemComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  pracownik: PracownikModel = new PracownikModel(
    'Marcin',
    'Marciniak',
    'chor.',
    'mgr',
    'informatyka',
    'marcin.marciniak@wat.edu.pl',
    [
      'manager projektu \'LUL\'',
      'dyrektor do spraw marketingu'
    ]);

    constructor(private pracownicyService: PracownicyService) { }

  ngOnInit() {
      this.subscription = this.pracownicyService.pracownikActivated.subscribe(
        (pracownik: PracownikModel) => {
          this.pracownik = pracownik;
        }
      )
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }

  onSubmit() {
      const pracownik: PracownikModel = this.pracownik;
      this.pracownicyService.addPracownik(pracownik)
        .subscribe(
          data => console.log(data),
          error => console.error(error)
        );
  }

}
