import { PublikacjaModel } from './publikacja.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

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


  public publiakcjeList: PublikacjaModel[] = [
    new PublikacjaModel(
      'abcd1234',
      ['5a2eb40eeea5ee2b5871359c', '5a2eb411eea5ee2b5871359d'],
      ['Sławek', 'Juzio'],
      'Przykładowy Tytuł Publikacji',
      'FAKT',
      '10',
      '4',
      '2017',
      '20-23',
      'doi:10.2105/AJPH.2009.160184',
      50)
  ];

  publikacjeActivated = new Subject<PublikacjaModel[]>();

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
}
