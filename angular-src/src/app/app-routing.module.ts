import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { PracownicyComponent } from './pracownicy/pracownicy.component';
import { PublikacjeComponent } from './publikacje/publikacje.component';
import { MinimumKadroweComponent } from './minimum-kadrowe/minimum-kadrowe.component';
import { PracownicyItemComponent } from './pracownicy/pracownicy-list/pracownicy-item/pracownicy-item.component';
import { PracownicyItemStartComponent } from './pracownicy/pracownicy-list/pracownicy-item-start/pracownicy-item-start.component';
import { PracownicyItemEditComponent } from './pracownicy/pracownicy-list/pracownicy-item-edit/pracownicy-item-edit.component';
import { PublikacjeItemComponent } from './publikacje/publikacje-list/publikacje-item/publikacje-item.component';
import { PublikacjeItemEditComponent } from './publikacje/publikacje-list/publikacje-item-edit/publikacje-item-edit.component';
import { PublikacjeItemStartComponent } from './publikacje/publikacje-list/publikacje-item-start/publikacje-item-start.component';
import { MinimumKadroweItemStartComponent } from './minimum-kadrowe/minimum-kadrowe-list/minimum-kadrowe-item-start/minimum-kadrowe-item-start.component';
import { MinimumKadroweItemEditComponent } from './minimum-kadrowe/minimum-kadrowe-list/minimum-kadrowe-item-edit/minimum-kadrowe-item-edit.component';
import { MinimumKadroweItemComponent } from './minimum-kadrowe/minimum-kadrowe-list/minimum-kadrowe-item/minimum-kadrowe-item.component';
import { SigninComponent } from './authentication/signin/signin.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { AuthenticationGuard } from './authentication-guard.service';
import { AdminGuard } from './admin-guard.service';

const appRoutes: Routes = [
    {path: '', component: HomeComponent, pathMatch: 'full'},
    {path: 'pracownicy', canActivate: [AuthenticationGuard], component: PracownicyComponent, children: [
        {path: '', component: PracownicyItemStartComponent},
        {path: 'new', component: PracownicyItemEditComponent},
        {path: ':id', component: PracownicyItemComponent},
        {path: ':id/edit', component: PracownicyItemEditComponent}
      ]},
    {path: 'publikacje', canActivate: [AuthenticationGuard], component: PublikacjeComponent, children: [
        {path: '', component: PublikacjeItemStartComponent},
        {path: 'new', component: PublikacjeItemEditComponent},
        {path: ':id', component: PublikacjeItemComponent},
        {path: ':id/edit', component: PublikacjeItemEditComponent}
      ]},
    {path: 'minimum-kadrowe', canActivate: [AuthenticationGuard], component: MinimumKadroweComponent, children: [
        {path: '', component: MinimumKadroweItemStartComponent},
        {path: 'new', component: MinimumKadroweItemEditComponent},
        {path: ':id', component: MinimumKadroweItemComponent},
        {path: ':id/edit', component: MinimumKadroweItemEditComponent}
      ]},
    {path: 'logowanie', component: SigninComponent},
    {path: 'nowy', canActivate: [AdminGuard], component: SignupComponent},
    {path: '**', redirectTo: ''}

];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
