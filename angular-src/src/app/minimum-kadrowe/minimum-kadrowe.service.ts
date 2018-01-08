import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MinimumKadroweModel } from './minimum-kadrowe.model';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { PracownikModel } from '../pracownicy/pracownik.model';

import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { PracownicyService } from '../pracownicy/pracownicy.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class MinimumKadroweService {
  constructor(private http: HttpClient,
              private pracownicyService: PracownicyService){
    this.getMinimaKadrowe()
      .subscribe(
        (minimaKadrowe: MinimumKadroweModel[]) => {
          console.log(minimaKadrowe);
          this.minimaKadroweList = minimaKadrowe;
          this.minimaKadroweActivated.next(this.minimaKadroweList);
        }
      )
  }

  headers = new HttpHeaders({'Content-Type': 'application/json'});

  public minimaKadroweList: MinimumKadroweModel[] = [];


  minimaKadroweActivated = new Subject<MinimumKadroweModel[]>();

  isPartOfMinimumKadrowe(pracownik: PracownikModel) {
    for (let minimumKadrowe of this.minimaKadroweList){
      for(let id of minimumKadrowe.doktorzyHabilitowani)
      {
        if(id === pracownik._id) return true;
      }

      for(let id of minimumKadrowe.doktorzy)
      {
        if(id === pracownik._id) return true;
      }
    }
    return false;
  }

  getMinimaKadrowe(){
    interface minimaKadroweResponse{
      lista: MinimumKadroweModel[];
    }

    return this.http.get<minimaKadroweResponse>('http://localhost:3000/minimum-kadrowe/get')
      .map((minimaKadroweList) => {
        console.log(minimaKadroweList);

        const minimaKadrowe = minimaKadroweList.lista;

        let minimaKadroweTransformed: MinimumKadroweModel[] = [];

        for(let minimumKadrowe of minimaKadrowe) {
          minimaKadroweTransformed.push(new MinimumKadroweModel(
            minimumKadrowe._id,
            minimumKadrowe.kierunek,
            minimumKadrowe.stopien,
            minimumKadrowe.rokAkademicki,
            minimumKadrowe.doktorzyHabilitowani,
            minimumKadrowe.doktorzy,
            minimumKadrowe.poprawne
          ));
        }
        this.minimaKadroweList = minimaKadroweTransformed;
        return minimaKadroweTransformed;
      })
      .catch((error: Response) => Observable.throw(error));
  }

  getMinimumKadroweById(id: string) {
    return this.minimaKadroweList.find((minimumKadrowe) => {return minimumKadrowe._id === id});
  }

  addMinimumKadrowe(minimumKadrowe: MinimumKadroweModel){
    const headers = this.headers;
    const token = sessionStorage.getItem('token')
      ? '?token=' + sessionStorage.getItem('token')
      : '';
    return this.http.post<MinimumKadroweModel>('http://localhost:3000/minimum-kadrowe' + token, minimumKadrowe, {headers: headers})
      .catch((error: Response) => {
        bootbox.alert('Dane minimum kadrowe już istnieje!');
        return Observable.throw(error);
      });
  }

  updateMinimumKadrowe(minimumKadrowe: MinimumKadroweModel){
    const headers = this.headers;
    const token = sessionStorage.getItem('token')
      ? '?token=' + sessionStorage.getItem('token')
      : '';
    return this.http.put<MinimumKadroweModel>('http://localhost:3000/minimum-kadrowe' + token, minimumKadrowe, {headers: headers})
      .catch((error: Response) => {
        bootbox.alert('Dane minimum kadrowe już istnieje!');
        return Observable.throw(error);
      });
  }

  deleteMinimumKadrowe(minimumKadrowe: MinimumKadroweModel) {
    const token = sessionStorage.getItem('token')
      ? '?token=' + sessionStorage.getItem('token')
      : '';
    return this.http.delete<MinimumKadroweModel>('http://localhost:3000/minimum-kadrowe/' + minimumKadrowe._id + token)
      .catch((error: Response) => Observable.throw(error));
  }

  checkValidity(minimumKadrowe: any, pracownikId: string) {

    interface ValidityResponse {
      message: string,
      valid: boolean,
      minima: string
    }

    let body = minimumKadrowe;
    body.pracownikId = pracownikId;

    const headers = this.headers;
    const token = sessionStorage.getItem('token')
      ? '?token=' + sessionStorage.getItem('token')
      : '';
    console.log(body);
    return this.http.post<ValidityResponse>('http://localhost:3000/minimum-kadrowe/checkValidity' + token, body, {headers: headers})
      .catch((error: Response) => Observable.throw(error));
  }

  createPdf(mk: MinimumKadroweModel, action: string) {
    console.log(mk);

    let date = getCurrentDate();

    let SPN:string = '';

    mk.doktorzyHabilitowani.forEach((id) => {
      let pracownik = this.pracownicyService.getPracownikById(id);
      if(pracownik.stopien !== ''){
        SPN += '- ' + pracownik.stopien + ' ' + pracownik.tytul + ' ' + pracownik.imie + ' ' + pracownik.nazwisko + '\n';
      } else {
        SPN += '- ' + pracownik.tytul + ' ' + pracownik.imie + ' ' + pracownik.nazwisko + '\n';
      }
    });

    let doktorzy: string = '';

    mk.doktorzy.forEach((id) => {
      let pracownik = this.pracownicyService.getPracownikById(id);
      if(pracownik.stopien !== ''){
        doktorzy += '- ' + pracownik.stopien + ' ' + pracownik.tytul + ' ' + pracownik.imie + ' ' + pracownik.nazwisko + '\n';
      } else {
        doktorzy += '- ' + pracownik.tytul + ' ' + pracownik.imie + ' ' + pracownik.nazwisko + '\n';
      }
    });

    let docDefinition = {
      info: {
        title: 'awesome Document',
      },
      header: function(currentPage, pageCount) {
        return { text: 'Warszawa, ' + date, alignment: 'right'};
      },
      content: [
        {text: '\nWydział Cybernetyki WAT - minimum kadrowe', style: 'header'},
        {text: '\n\nKierunek:   ' + mk.kierunek, style: 'normalBold'},
        {text: 'Stopień:     ' + mk.stopien, style: 'normalBold'},
        {text: 'Rok:            ' + mk.rokAkademicki, style: 'normalBold'},
        {text: '\n\nSamodzielni pracownicy nauki:', style: 'normalBold'},
        {text: SPN, style: 'normalMargin'},
        {text: '\n\nDoktorzy:', style: 'normalBold'},
        {text: doktorzy, style: 'normalMargin'}
      ],
      styles: {
        header: {
          fontSize: 24,
          fontFamily: 'arial',
          bold: true,
          alignment: 'center'
        },
        normal: {
          fontSize: 16,
          fontFamily: 'arial',
          bold: false,
        },
        normalBold: {
          fontSize: 16,
          fontFamily: 'arial',
          bold: true,
        },
        normalMargin: {
          fontSize: 16,
          fontFamily: 'arial',
          bold: false,
          marginTop: 5,
          marginBottom: 5
        },
        top: {
          fontSize: 14,
          fontFamily: 'arial',
          alignment: 'right',
          bold: false
        }
      }
    };

    let rokChanged = replaceAt(mk.rokAkademicki,4,'_');

    let fileName: string = 'mk_' + mk.kierunek + '_' + mk.stopien + '_' + rokChanged+'.pdf';

    if(action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else if (action === 'download') {
      pdfMake.createPdf(docDefinition).download(fileName);
    }

    function replaceAt(string, index, replacement) {
      return string.substr(0, index) + replacement+ string.substr(index + replacement.length);
    }

    function getCurrentDate() {
      let today = new Date();
      let dd:string = today.getDate().toString();
      let mm:string = (today.getMonth()+1).toString(); //January is 0!

      let yyyy = today.getFullYear();
      if(today.getDate()<10){
        dd='0'+dd;
      }
      if((today.getMonth()+1)<10){
        mm='0'+mm;
      }
      return dd+'.'+mm+'.'+yyyy;
    }
  }
}
