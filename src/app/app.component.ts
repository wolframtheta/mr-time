import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import * as Moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { extendMoment } from 'moment-range';
import { ToastrService } from 'ngx-toastr';
import { TimeoutError } from 'rxjs';
import { NbCalendarRange } from '@nebular/theme';

const moment = extendMoment(Moment);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  hoursRelatedType = {
    schedule8normal: {
      entryTime1: '09:00',
      leftTime1: '14:00',
      entryTime2: '15:00',
      leftTime2: '18:30'
    },
    schedule8intensive: {
      entryTime1: '09:00',
      leftTime1: '17:30'
    },
    schedule730normal: {
      entryTime1: '09:00',
      leftTime1: '14:00',
      entryTime2: '15:00',
      leftTime2: '18:00'
    },
    schedule730intensive: {
      entryTime1: '09:00',
      leftTime1: '17:00'
    },
    scheduleFridays: {
      entryTime1: '09:00',
      leftTime1: '14:00'
    }
  }
  title = 'checkin-bot';
  range: NbCalendarRange<Date>;
  constructor(
    private http: HttpClient,

    private formBuilder: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.val = this.formBuilder.group({
      hours: [false],
      type: [false],
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
    this.range = {
      start: moment().toDate(),
      end: moment().toDate(),
    };
    if (!this.val.value['type']) {
      this.val.patchValue({
        time1: {
          entryTime: this.hoursRelatedType.schedule8normal.entryTime1,
          leftTime: this.hoursRelatedType.schedule8normal.leftTime1,
        },
        time2: {
          entryTime: this.hoursRelatedType.schedule8normal.entryTime2,
          leftTime: this.hoursRelatedType.schedule8normal.leftTime2,
        }
      })
    }
  }

  ngOnInit() {
    const hours = localStorage.getItem('hours')
    if (this.val && hours) {
      this.val.patchValue({
        time1: {
          entryTime: JSON.parse(hours).time1.entryTime,
          leftTime: JSON.parse(hours).time1.leftTime
        },
        time2: {
          entryTime: JSON.parse(hours).time2.entryTime,
          leftTime: JSON.parse(hours).time2.leftTime
        },
      })
    }
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

  onSubmit(event) {
    if (event === true) {
      console.log(this.val.value, this.range)
      const startDay = moment(this.range.start, 'YYYY-MM-DD');
      const endDay = moment(this.range.end, 'YYYY-MM-DD');
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

  changeHours(event) {
    if (event) {
      if (!this.val.value['type']) {
        this.val.patchValue({
          time1: {
            entryTime: this.hoursRelatedType.schedule730normal.entryTime1,
            leftTime: this.hoursRelatedType.schedule730normal.leftTime1,
          },
          time2: {
            entryTime: this.hoursRelatedType.schedule730normal.entryTime2,
            leftTime: this.hoursRelatedType.schedule730normal.leftTime2,
          }
        })
      } else {
        this.val.patchValue({
          time1: {
            entryTime: this.hoursRelatedType.schedule730intensive.entryTime1,
            leftTime: this.hoursRelatedType.schedule730intensive.leftTime1,
          },
          time2: {
            entryTime: '',
            leftTime: '',
          }
        })
      }
    } else {
      if (!this.val.value['type']) {
        this.val.patchValue({
          time1: {
            entryTime: this.hoursRelatedType.schedule8normal.entryTime1,
            leftTime: this.hoursRelatedType.schedule8normal.leftTime1,
          },
          time2: {
            entryTime: this.hoursRelatedType.schedule8normal.entryTime2,
            leftTime: this.hoursRelatedType.schedule8normal.leftTime2,
          }
        })
      } else {
        this.val.patchValue({
          time1: {
            entryTime: this.hoursRelatedType.schedule8intensive.entryTime1,
            leftTime: this.hoursRelatedType.schedule8intensive.leftTime1,
          },
          time2: {
            entryTime: '',
            leftTime: '',
          }
        })
      }
    }

  }
  changeType(event) {
    if (!event) {
      if (this.val.value['hours']) {
        this.val.patchValue({
          time1: {
            entryTime: this.hoursRelatedType.schedule730normal.entryTime1,
            leftTime: this.hoursRelatedType.schedule730normal.leftTime1,
          },
          time2: {
            entryTime: this.hoursRelatedType.schedule730normal.entryTime2,
            leftTime: this.hoursRelatedType.schedule730normal.leftTime2,
          }
        })
      } else {
        this.val.patchValue({
          time1: {
            entryTime: this.hoursRelatedType.schedule8normal.entryTime1,
            leftTime: this.hoursRelatedType.schedule8normal.leftTime1,
          },
          time2: {
            entryTime: this.hoursRelatedType.schedule8normal.entryTime2,
            leftTime: this.hoursRelatedType.schedule8normal.leftTime2,
          }
        })
      }
    } else {
      if (this.val.value['hours']) {
        this.val.patchValue({
          time1: {
            entryTime: this.hoursRelatedType.schedule730intensive.entryTime1,
            leftTime: this.hoursRelatedType.schedule730intensive.leftTime1,
          },
          time2: {
            entryTime: '',
            leftTime: '',
          }
        })
      } else {
        this.val.patchValue({
          time1: {
            entryTime: this.hoursRelatedType.schedule8intensive.entryTime1,
            leftTime: this.hoursRelatedType.schedule8intensive.leftTime1,
          },
          time2: {
            entryTime: '',
            leftTime: '',
          }
        })
      }
    }
  }

  saveSettings() {
    const hours = {
      time1: this.val.value['time1'] ? this.val.value['time1'] : '',
      time2: this.val.value['time2'] ? this.val.value['time2'] : ''
    }
    localStorage.setItem('hours', JSON.stringify(hours));
    this.toastr.success('Els horaris s\'han guardat a la memoria cache del navegador correctament.', 'Horaris guardats!')
  }

  wholeWeek() {
    this.toastr.warning('Aquesta funcio encara no s\'ha acabat d\'implementar. Haureu d\'esperar una mica :)', 'No implementat!')
  }
}
