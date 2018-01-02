import { PracownikModel } from './pracownik.model';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PracownicyService {

  constructor(private http: HttpClient) {
    this.getPracownicy()
      .subscribe(
        (pracownicy: PracownikModel[]) => {
          this.pracownicyList = pracownicy;
          this.pracownikActivated.next(this.pracownicyList);
        }
      );
  }
  stopnieWojskowe: any = [
    {"nazwa": "brak",
      "skrot": ""},
    {"nazwa": "szeregowy",
      "skrot": "szer."},
    {"nazwa": "starszy szeregowy",
      "skrot": "st. szer."},
    {"nazwa": "kapral",
      "skrot": "kpr."},
    {"nazwa": "starszy kapral",
      "skrot": "st. kpr."},
    {"nazwa": "plutonowy",
      "skrot": "plut."},
    {"nazwa": "sierżant",
      "skrot": "sierż."},
    {"nazwa": "starszy sierżant",
      "skrot": "st. sierż."},
    {"nazwa": "młodszy chorąży",
      "skrot": "mł. chor."},
    {"nazwa": "chorąży",
      "skrot": "chor."},
    {"nazwa": "starszy chorąży",
      "skrot": "st. chor."},
    {"nazwa": "starszy chorąż sztabowy",
      "skrot": "st. chor. szt"},
    {"nazwa": "podporucznik",
      "skrot": "ppor."},
    {"nazwa": "porucznik",
      "skrot": "por."},
    {"nazwa": "kapitan",
      "skrot": "kpt."},
    {"nazwa": "major",
      "skrot": "mjr"},
    {"nazwa": "podpułkownik",
      "skrot": "ppłk"},
    {"nazwa": "pułkownik",
      "skrot": "płk"},
    {"nazwa": "generał brygady",
      "skrot": "gen. bryg."},
    {"nazwa": "generał dywizji",
      "skrot": "gen. dyw."},
    {"nazwa": "generał broni",
      "skrot": "gen. broni"},
    {"nazwa": "generał",
      "skrot": "gen"},

  ];

  tytuly: any = [
    {"nazwa": "magister",
      "skrot": "mgr"},
    {"nazwa": "magister inżynier",
      "skrot": "mgr inż."},
    {"nazwa": "doktor",
      "skrot": "dr"},
    {"nazwa": "doktor inżynier",
      "skrot": "dr inż."},
    {"nazwa": "doktor habilitowany",
      "skrot": "dr hab."},
    {"nazwa": "doktor habilitowany inżynier",
      "skrot": "dr hab. inż."},
    {"nazwa": "profesor nadzwyczajny doktor habilitowany",
      "skrot": "prof. nadzw. dr hab."},
    {"nazwa": "profesor nadzwyczajny doktor habilitowany inżynier",
      "skrot": "prof. nadzw. dr hab. inż."},
    {"nazwa": "profesor doktor habilitowany",
      "skrot": "prof. dr hab."},
    {"nazwa": "profesor doktor habilitowany inżynier",
      "skrot": "prof. dr hab. inż."},
  ];

  public pracownikActivated = new Subject<PracownikModel[]>();

  public pracownikUpdated = new Subject<PracownikModel>();

  public pracownicyList: PracownikModel[] = [];

  getPracownicy() {

    interface pracownicyResponse {
      lista: PracownikModel[];
    }

    return this.http.get<pracownicyResponse>('http://localhost:3000/pracownicy/get')
      .map((pracownicyList) => {
        console.log(pracownicyList);
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
             pracownik.funkcje
           ));
         }
         this.pracownicyList = pracownicyTransformed;
         return pracownicyTransformed;
      })
      .catch((error: Response) => Observable.throw(error));
  }

  getPracownikById(id: string) {
    return this.pracownicyList.find((pracownik) => {return pracownik._id === id});
  }

  addPracownik(pracownik: PracownikModel) {
    console.log(pracownik);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<PracownikModel>('http://localhost:3000/pracownicy', pracownik, {headers: headers})
      .catch((error: Response) => Observable.throw(error));
  }

  updatePracownik(pracownik: PracownikModel) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put<PracownikModel>('http://localhost:3000/pracownicy', pracownik, {headers: headers})
      .catch((error: Response) => Observable.throw(error));
  }

  deletePracownik(pracownik: PracownikModel) {
    return this.http.delete<PracownikModel>('http://localhost:3000/pracownicy/' + pracownik._id)
      .catch((error: Response) => Observable.throw(error));
  }
}
