import { UserModel } from './user.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  logowanieActivated = new Subject<any>();

  signup(user: UserModel) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<UserModel>('http://localhost:3000/user', user, {headers: headers})
      .catch((error: Response) => Observable.throw(error));
  }

  signin(user: UserModel) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<UserModel>('http://localhost:3000/user/login', user, {headers: headers})
      .catch((error: Response) => Observable.throw(error));
  }

  authenticate() {

    const data = {
      token: sessionStorage.getItem('token'),
      userId: sessionStorage.getItem('userId')
    };
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<{message: string, auth: boolean, admin: boolean}>('http://localhost:3000/user/check', data, {headers: headers});


  }

  logout() {
    sessionStorage.clear();
  }

  isLoggedIn() {
    return sessionStorage.getItem('token') !== null;
  }
}
