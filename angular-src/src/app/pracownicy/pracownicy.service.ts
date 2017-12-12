import { PracownikModel } from './pracownik.model';
import { Subject } from 'rxjs/Subject';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PracownicyService implements OnInit{

  constructor(private http: HttpClient) {
  }

  public pracownikActivated = new Subject();

  private pracownicyList: PracownikModel[] = [];
      // new PracownikModel(
      //   'Marcin',
      //   'Marciniak',
      //   'chor.',
      //   'mgr',
      //   'informatyka',
      //   'marcin.marciniak@wat.edu.pl',
      //   [
      //     'manager projektu \'LUL\'',
      //     'dyrektor do spraw marketingu'
      //   ]),
      // new PracownikModel(
      //   'Piotr',
      //   'Piotrowski',
      //   'sierż.',
      //   'dr',
      //   'biochemia',
      //   'piotr.piotrowski@wat.edu.pl',
      //   ['funkcja 1', 'funkcja 2']),
      // new PracownikModel(
      //   'Adam',
      //   'Abacki',
      //   'chor.',
      //   'inż.',
      //   'informatyka',
      //   'adam.abacki@wat.edu.pl'),
      // new PracownikModel(
      //   'Bartosz',
      //   'Babacki',
      //   'krp.',
      //   'dr inż.',
      //   'informatyka',
      //   'bartosz.babacki@wat.edu.pl'),
      // new PracownikModel(
      //   'Damian',
      //   'Dadacki',
      //   'plut.',
      //   'mgr inż.',
      //   'chemia',
      //   'damian.dadacki@wat.edu.pl'),
      // new PracownikModel(
      //   'Emil',
      //   'Ebacki',
      //   'mł. chor.',
      //   'inż.',
      //   'inżynieria chemiczna',
      //   'emil.ebacki@wat.edu.pl'
      // )

  getPracownicy() {

    interface pracownicyResponse {
      lista: PracownikModel[];
    }

    return this.http.get<pracownicyResponse>('http://localhost:3000/pracownicy/get')
      .map((pracownicyList) => {
         const pracownicy = pracownicyList.lista;
         let pracownicyTransformed: PracownikModel[] = [];

         for (let pracownik of pracownicy) {
           pracownicyTransformed.push(new PracownikModel(
             pracownik._id,
             pracownik.imie,
             pracownik.nazwisko,
             pracownik.stopien,
             pracownik.tytul,
             pracownik.specjalnosc,
             pracownik.email,
             pracownik.funkcje));
         }
         this.pracownicyList = pracownicyTransformed;
         return pracownicyTransformed;
      })
      .catch((error: Response) => Observable.throw(error));
  }

  getPracownikById(id: number) {
    return this.pracownicyList.find((pracownik) => {return pracownik._id === id.toString()});
  }

  addPracownik(pracownik: PracownikModel) {
    console.log(pracownik);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<PracownikModel>('http://localhost:3000/pracownicy', pracownik, {headers: headers})
      .catch((error: Response) => Observable.throw(error));
  }

  ngOnInit() {

    this.getPracownicy()
      .subscribe(
        (pracownicy: PracownikModel[]) => {
          this.pracownicyList = pracownicy;
        }
      );
  }
}
