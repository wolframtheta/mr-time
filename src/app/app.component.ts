import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import * as Moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { extendMoment } from 'moment-range';
import { ToastrService } from 'ngx-toastr';
import { TimeoutError } from 'rxjs';

const moment = extendMoment(Moment);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'checkin-bot';
  constructor(
    private http: HttpClient,

    private formBuilder: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.val = this.formBuilder.group({
      startDay: ['', Validators.required],
      endDay: ['', Validators.required],
      time1: this.formBuilder.group({
        entryTime: ['', Validators.required],
        leftTime: ['', Validators.required]
      }),
      time2: this.formBuilder.group({
        entryTime: [''],
        leftTime: ['']
      }),
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  val: FormGroup;
  hours = [];
  checkIn() {
    let date;
    // console.log(date)

    // this.http.post('https://app2u.upcnet.es/marcatges/api/marcatges', {
    //   username,
    //   password,
    //   date,
    //   state
    // }).subscribe(res => {
    //   console.log(res)
    // })
    for (let i = 0; i < 7; i++) {
        for (const hour of this.hours) {
            date = moment('2020/07/20').add(i, 'day').format(`yyyy-MM-DDT${hour}:00.0000`);
            console.log(date)
            // try {
            //     axios.post('https://app2u.upcnet.es/marcatges/api/marcatge', {
            //         username: 'x.marques',
            //         password: 'Aobcd8663',
            //         date: date,
            //         state: hours.indexOf(hour) % 2 != 0
            //     })
            // } catch (error) {
            //     console.log(error)
            // }
        }
    }
  }

  onSubmit() {
    console.log(this.val.value)
    const startDay = moment(this.val.value.startDay, 'YYYY-MM-DD');
    const endDay = moment(this.val.value.endDay, 'YYYY-MM-DD');
    const range = moment.range(startDay, endDay);
    console.log(range.diff('days'))
    const hours = [
      this.val.value.time1.entryTime, 
      this.val.value.time1.leftTime, 
    ]
    if (this.val.value.time2.entryTime !== '' && this.val.value.time2.leftTime !== '') {
      hours.push(this.val.value.time2.entryTime);
      hours.push(this.val.value.time2.leftTime);
    } 
    let diff = range.diff('days')
    for (let i = 0; i <= diff; i++) {
      for (let hour of hours) {
        const date = moment(startDay).add(i, 'days').format(`yyyy-MM-DDT${hour}:00.0000`);
        const dateToastr = moment(startDay).add(i, 'days').format(`DD/MM/yyyy`);
        this.http.post('https://app2u.upcnet.es/marcatges/api/marcatge', {
          username: this.val.value.username,
          password: this.val.value.password,
          date,
          state: hours.indexOf(hour) % 2 != 0
        }).subscribe(res => {
          console.log(res)
          if (res['status'] === 'ok') {
            this.toastr.success(`Marcatge ${hours.indexOf(hour) % 2 == 0 ? 'd\'entrada' : 'de sortida'} fet el ${dateToastr} a les ${hour}h`, 'Success!', {timeOut: 5000});
          } else {
            this.toastr.error(`Error en el marcatge ${hours.indexOf(hour) % 2 == 0 ? 'd\'entrada' : 'de sortida'} el ${dateToastr} a les ${hour}h`, `Error! (${res['error']})`, {timeOut: 5000});
          }
        })
      }
    }
  }
}
