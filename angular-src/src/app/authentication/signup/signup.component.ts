import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { UserModel } from '../user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;

  constructor(private authenticationService: AuthenticationService) {}

  onSubmit() {
    console.log(this.signupForm.value);
    const user = new UserModel(
      this.signupForm.value.email,
      this.signupForm.value.password,
      this.signupForm.value.admin
    );
    this.authenticationService.signup(user)
      .subscribe(
        data => {
          console.log(this.signupForm);
          this.signupForm.reset();
          console.log(data)
        },
            error => {
          console.error(error)
        }
      );
  }

  ngOnInit() {
    this.signupForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required),
      'admin': new FormControl(false, Validators.required)
    })
  }

}
