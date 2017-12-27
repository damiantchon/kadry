import { PublikacjaModel } from './publikacja.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { PracownikModel } from '../pracownicy/pracownik.model';

@Injectable()
export class PublikacjeService {
  constructor(private http: HttpClient) {
    this.getPublikacje()
      .subscribe(
        (publikacje: PublikacjaModel[]) => {
          console.log(publikacje);
          this.publiakcjeList = publikacje;
          this.publikacjeActivated.next(this.publiakcjeList);
        }
      )
  }


  public publiakcjeList: PublikacjaModel[] = [];

  publikacjeActivated = new Subject<PublikacjaModel[]>();

  isAnAuthor(pracownik: PracownikModel) {
    for (let publikacja of this.publiakcjeList){
      for (let id of publikacja.autorzyWewnetrzniId) {
        if(id === pracownik._id) {
          return true;
        }
      }
    }
    return false;
  }


  getPublikacje() {
    interface publikacjeResponse{
      lista: PublikacjaModel[];
    }

    return this.http.get<publikacjeResponse>('http://localhost:3000/publikacje/get')
      .map((publikacjeList) => {
        console.log(publikacjeList);

        const publikacje = publikacjeList.lista;
        let publikacjeTransformed: PublikacjaModel[] = [];

        for(let publikacja of publikacje) {
          publikacjeTransformed.push(new PublikacjaModel(
            publikacja._id,
            publikacja.autorzyWewnetrzniId,
            publikacja.autorzyZewnetrzni,
            publikacja.tytulPublikacji,
            publikacja.tytulCzasopisma,
            publikacja.wolumin,
            publikacja.wydanie,
            publikacja.rokPublikacji,
            publikacja.strony,
            publikacja.doi,
            publikacja.punkty
          ));
        }
          this.publiakcjeList = publikacjeTransformed;
          return publikacjeTransformed;
      })
      .catch((error: Response) => Observable.throw(error));
  }

  getPublikacjaById(id: string) {
    return this.publiakcjeList.find((publikacja) => {return publikacja._id === id});
  }

  addPublikacja(publikacja: PublikacjaModel) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<PublikacjaModel>('http://localhost:3000/publikacje', publikacja, {headers: headers})
      .catch((error: Response) => Observable.throw(error));
  }

  updatePublikacja(publikacja: PublikacjaModel) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put<PublikacjaModel>('http://localhost:3000/publikacje', publikacja, {headers: headers})
      .catch((error: Response) => Observable.throw(error));
  }
}
