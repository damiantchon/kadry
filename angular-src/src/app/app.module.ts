import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from "./app.component";
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { PracownicyComponent } from './pracownicy/pracownicy.component';
import { PublikacjeComponent } from './publikacje/publikacje.component';
import { MinimumKadroweComponent } from './minimum-kadrowe/minimum-kadrowe.component';
import { PracownicyItemComponent } from './pracownicy/pracownicy-list/pracownicy-item/pracownicy-item.component';
import { PracownicyListComponent } from './pracownicy/pracownicy-list/pracownicy-list.component';
import { PracownicyService } from './pracownicy/pracownicy.service';
import { HighlightDirective } from './shared/highlight.directive';
import { PracownicyItemStartComponent } from './pracownicy/pracownicy-list/pracownicy-item-start/pracownicy-item-start.component';
import { PracownicyItemEditComponent } from './pracownicy/pracownicy-list/pracownicy-item-edit/pracownicy-item-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PublikacjeListComponent } from './publikacje/publikacje-list/publikacje-list.component';
import { PublikacjeItemComponent } from './publikacje/publikacje-list/publikacje-item/publikacje-item.component';
import { PublikacjeItemEditComponent } from './publikacje/publikacje-list/publikacje-item-edit/publikacje-item-edit.component';
import { PublikacjeItemStartComponent } from './publikacje/publikacje-list/publikacje-item-start/publikacje-item-start.component';


@NgModule({
    declarations: [
      AppComponent,
      HeaderComponent,
      HomeComponent,
      PracownicyComponent,
      PublikacjeComponent,
      MinimumKadroweComponent,
      PracownicyItemComponent,
      PracownicyListComponent,
      HighlightDirective,
      PracownicyItemStartComponent,
      PracownicyItemEditComponent,
      PublikacjeListComponent,
      PublikacjeItemComponent,
      PublikacjeItemEditComponent,
      PublikacjeItemStartComponent],
imports: [
        AppRoutingModule,
        BrowserModule,
        DataTablesModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule
],
    providers: [PracownicyService],
    bootstrap: [AppComponent]
})
export class AppModule {

}
