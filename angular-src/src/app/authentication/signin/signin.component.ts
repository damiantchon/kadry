import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  signinForm: FormGroup;
  constructor(private authenticationService: AuthenticationService,
              private router: Router) { }

  onSubmit() {
    const user = new UserModel(
      this.signinForm.value.email,
      this.signinForm.value.password
    );
    this.authenticationService.signin(user)
      .subscribe(
        data => {
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('userId', data.userId);
          this.router.navigateByUrl('/');
          setTimeout(() => {
            this.authenticationService.logowanieActivated.next();
          }, 200);
        },
        err => {
          console.error(err);
          bootbox.alert('Błędny login lub hasło!');
        }
      )
  }

  ngOnInit() {
    this.signinForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required)
    })
  }

}
