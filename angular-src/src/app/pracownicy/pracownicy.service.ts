import { PracownikModel } from './pracownik.model';
import { Subject } from 'rxjs/Subject';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PracownicyService {

  constructor(private http: HttpClient) {
  }

  public pracownikActivated = new Subject();

  private pracownicyList: PracownikModel[] = [
      new PracownikModel(
        'Marcin',
        'Marciniak',
        'chor.',
        'mgr',
        'informatyka',
        'marcin.marciniak@wat.edu.pl',
        [
          'manager projektu \'LUL\'',
          'dyrektor do spraw marketingu'
        ]),
      new PracownikModel(
        'Piotr',
        'Piotrowski',
        'sierż.',
        'dr',
        'biochemia',
        'piotr.piotrowski@wat.edu.pl',
        ['funkcja 1', 'funkcja 2']),
      new PracownikModel(
        'Adam',
        'Abacki',
        'chor.',
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

  addPracownik(pracownik: PracownikModel) {
    console.log(pracownik);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<PracownikModel>('http://localhost:3000/pracownicy', pracownik, {headers: headers})
      .catch((error: Response) => Observable.throw(error));
  }
}
