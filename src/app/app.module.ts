import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { ToastrModule } from 'ngx-toastr';
import { NbCalendarRangeModule, NbLayoutDirectionService, NbThemeModule, NbCardModule, NbLayoutModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import locale from '@angular/common/locales/es'
import { registerLocaleData } from '@angular/common';
registerLocaleData(locale);
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ToastrModule.forRoot(),
    NbThemeModule.forRoot({name:'custom-theme'}),
    NbCalendarRangeModule,
    NbCardModule,
    //NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
  ],
  providers: [
    {
      provide: LOCALE_ID, 
      useValue: 'es',
    }, 
    NbLayoutDirectionService, 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
