import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MinimumKadroweModel } from './minimum-kadrowe-list/minimum-kadrowe.model';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MinimumKadroweService {
  constructor(private http: HttpClient){
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

  // new MinimumKadroweModel('10',
  // 'informatyka',
  // '100',
  // [],
  // [],
  // false),
  // new MinimumKadroweModel('11',
  // 'zarządzanie',
  // '100',
  // [],
  // [],
  // false),

  minimaKadroweActivated = new Subject<MinimumKadroweModel[]>();

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
    return this.http.post<MinimumKadroweModel>('http://localhost:3000/minimum-kadrowe', minimumKadrowe, {headers: headers})
      .catch((error: Response) => Observable.throw(error));
  }

  updateMinimumKadrowe(minimumKadrowe: MinimumKadroweModel){
    const headers = this.headers;
    return this.http.put<MinimumKadroweModel>('http://localhost:3000/minimum-kadrowe', minimumKadrowe, {headers: headers})
      .catch((error: Response) => Observable.throw(error));
  }

  deleteMinimumKadrowe(minimumKadrowe: MinimumKadroweModel) {
    return this.http.delete<MinimumKadroweModel>('http://localhost:3000/minimum-kadrowe/' + minimumKadrowe._id)
      .catch((error: Response) => Observable.throw(error));
  }
}
