/// <reference types="@types/googlemaps" />
import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { ProjectService } from '../project.service';
import { TestGroupService } from '../../test-group/test-group.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { LoginService } from '../../../core/services';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  projectAddForm: FormGroup;
  formInvalid: boolean;
  clients: any;
  alldecks: any;
  colors: any;
  companies: any;

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(private _service: ProjectService
    , private _testService: TestGroupService
    , private _messageService: MessageService
    , private _spinner: NgxSpinnerService
    , private _router: Router
    , private _fb: FormBuilder
    , private mapsAPILoader: MapsAPILoader
    , private ngZone: NgZone
    , private _loginService: LoginService) {
    this.formInvalid = true;
    this.projectAddForm = this._fb.group({
      title: new FormControl('', [Validators.required]),
      client: new FormControl('', [Validators.required]),
      testGroup: new FormControl('', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]),
      company: new FormControl('', [Validators.required]),
      roundConfiguration: this._fb.array([this.initRoundConfig()]),
      groups: this._fb.array([])
      // rounds: new FormControl('', [Validators.required]),
      // roundConfiguration: new FormControl('', [Validators.required]),
      // decks: new FormControl('', [Validators.required]),
      // decks: this._fb.array([this.initDecks()]),
      // segments: new FormControl('', [Validators.required]),
    });
  }

  // initDecks(): FormGroup {
  //   return this._fb.group({
  //     // list all your form controls here, which belongs to your form array
  //     name: ['', Validators.required]
  //     , color: ['', Validators.required]
  //     , isRequired: ['false', Validators.required]
  //   });
  // }

  // addNewDeckRow() {
  //   const control = <FormArray>this.projectAddForm.controls.decks;
  //   control.push(this.initDecks());
  // }

  // deleteDeckRow(i: number): void {
  //   const control = <FormArray>this.projectAddForm.controls.decks;
  //   control.removeAt(i);
  // }

  initRoundConfig(): FormGroup {
    return this._fb.group({
      // list all your form controls here, which belongs to your form array
      time: [0]
      , point: [0]
    });
  }

  addNewRoundConfigRow() {
    const control = <FormArray>this.projectAddForm.controls.roundConfiguration;
    control.push(this.initRoundConfig());
  }

  deleteRoundConfigRow(i: number): void {
    const control = <FormArray>this.projectAddForm.controls.roundConfiguration;
    control.removeAt(i);
  }

  initTestGroups(): FormGroup {
    return this._fb.group({
      // list all your form controls here, which belongs to your form array
      title: ['', [Validators.required]],
      users: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{2}$/)]],
      gender: ['male', [Validators.required]],
      location: ['', [Validators.required]]
    });
  }

  addNewTestgroupRow() {
    const control = <FormArray>this.projectAddForm.controls.groups;
    control.push(this.initTestGroups());
  }

  deleteTestgroupRow(i: number): void {
    const control = <FormArray>this.projectAddForm.controls.groups;
    control.removeAt(i);
  }

  changeTestGroup(value: any) {
    if (value !== '') {
      const control = <FormArray>this.projectAddForm.controls.groups;
      if (value > control.length) {
        const diff = (value - control.length);
        for (let index = 0; index < diff; index++) {
          this.addNewTestgroupRow();
          // this.changeLocation();
        }
      } else {
        const diff = (control.length - value);
        for (let index = control.length; index >= value; index--) {
          this.deleteTestgroupRow(index);
        }
      }
    }
  }

  changeLocation() {
    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['geocode']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          // this.groupAddForm.patchValue({ location: place.formatted_address });

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  ngOnInit() {

    // set google maps defaults
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    // create search FormControl
    this.searchControl = new FormControl();

    // set current position
    this.setCurrentPosition();


    this._spinner.show();
    this._service.getAllClient().then(clients => {
      this._service.getAllCompany().then(companies => {
        this._service.getAllDecks().then(decks => {
          this._service.getAllColors().then(colors => {
            this._loginService.filterCompany(clients, 'data', 'company').then(filteredClient => {
              this._loginService.filterCompany(companies, 'id').then(filteredCompany => {
                this.clients = filteredClient;
                this.companies = filteredCompany;
                this.alldecks = decks;
                this.colors = colors;
                this._spinner.hide();
              });
            });
          }).catch(error => {
            this._spinner.hide();
          });
        }).catch(error => {
          this._spinner.hide();
        });
      }).catch(err => {
        this._spinner.hide();
      }).catch(err => {
        this._spinner.hide();
      });
    });

  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  projectAddFormSubmit() {
    this._spinner.show();

    if (!this.projectAddForm.valid) {
      this._spinner.hide();
      Object.keys(this.projectAddForm.controls).forEach(key => {
        this.projectAddForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {

      let testGroups = [];
      for (let index = 0; index < this.projectAddForm.value.testGroup; index++) {
        const users: any[] = [];
        for (let i = 0; i < this.projectAddForm.value.groups[index].users; i++) {
          users.push({ code: this.getRandomInt(1000, 9999) });
        }
        this.projectAddForm.value.groups[index].users = users;
      }

      testGroups = this.projectAddForm.value.groups;
      delete this.projectAddForm.value.groups;

      this.formInvalid = false;
      this.projectAddForm.value['decks'] = [];
      // console.log(this.projectAddForm.value);

      this._service.save(this.projectAddForm.value).then(res => {
        // console.log(res.id);
        let index = 0;
        testGroups.forEach(element => {
          const d = { project: res.id, ...element };
          index++;
          this._testService.save(d).then(res1 => {
            // if (testGroups.length === index) {
            this._spinner.hide();
            this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Project added successfuly.' });
            setTimeout(() => {
              this._router.navigate(['/app/project']);
            }, 2000);
            // }
          }).catch(error => {
            this._spinner.hide();
            this._messageService.add({ severity: 'error', summary: 'Error', detail: error['message'] });
          });
        });
      }).catch(error => {
        this._spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: error['message'] });
      });
    }
  }
}
