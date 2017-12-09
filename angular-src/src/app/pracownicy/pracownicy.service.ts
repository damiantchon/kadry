import { PracownikModel } from './pracownik.model';
import { Subject } from 'rxjs/Subject';
import { OnInit } from '@angular/core';

export class PracownicyService {

  public pracownikActivated = new Subject();

  private pracownicyList: PracownikModel[] = [
      new PracownikModel(
        'Marcin',
        'Marciniak',
        'Pchor',
        'mgr',
        'informatyka',
        'marcin.marciniak@wat.edu.pl'),
      new PracownikModel(
        'Piotr',
        'Piotrowski',
        'sierż.',
        'dr',
        'biochemia',
        'piotr.piotrowski@wat.edu.pl'),
      new PracownikModel(
        'Adam',
        'Abacki',
        'pchor.',
        'inż.',
        'informatyka',
        'adam.abacki@wat.edu.pl'),
      new PracownikModel(
        'Bartosz',
        'Babacki',
        'krp.',
        'dr inż.',
        'informatyka',
        'bartosz.babacki@wat.edu.pl'),
      new PracownikModel(
        'Damian',
        'Dadacki',
        'plut.',
        'mgr inż.',
        'chemia',
        'damian.dadacki@wat.edu.pl'),
      new PracownikModel(
        'Emil',
        'Ebacki',
        'mł. chor.',
        'inż.',
        'inżynieria chemiczna',
        'emil.ebacki@wat.edu.pl'
      )
    ];

  getPracownicy() {
    return this.pracownicyList.slice();
  }
}
