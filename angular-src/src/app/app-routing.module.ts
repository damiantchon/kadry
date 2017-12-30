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

const appRoutes: Routes = [
    {path: '', component: HomeComponent, pathMatch: 'full'},
    {path: 'pracownicy', component: PracownicyComponent, children: [
        {path: '', component: PracownicyItemStartComponent},
        {path: 'new', component: PracownicyItemEditComponent},
        {path: ':id', component: PracownicyItemComponent},
        {path: ':id/edit', component: PracownicyItemEditComponent}
      ]},
    {path: 'publikacje', component: PublikacjeComponent, children: [
        {path: '', component: PublikacjeItemStartComponent},
        {path: 'new', component: PublikacjeItemEditComponent},
        {path: ':id', component: PublikacjeItemComponent},
        {path: ':id/edit', component: PublikacjeItemEditComponent}
      ]},
    {path: 'minimum-kadrowe', component: MinimumKadroweComponent},
    {path: '**', redirectTo: ''}

];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
