/// <reference types="@types/googlemaps" />
import { Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { TestGroupService } from '../test-group.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  groupEditForm: FormGroup;
  formInvalid: boolean;
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  prevUsersData: any[];
  editedID: any;
  allProjects: any = [];

  @ViewChild('search')
  public searchElementRef: ElementRef;


  constructor(
    private mapsAPILoader: MapsAPILoader
    , private ngZone: NgZone
    , private _service: TestGroupService
    , private _messageService: MessageService
    , private _spinner: NgxSpinnerService
    , private _router: Router
    , private route: ActivatedRoute
  ) {
    this.formInvalid = true;
    this.groupEditForm = new FormGroup({
      project: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      users: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required, Validators.pattern(/^\d{2}-\d{2}$/)]),
      location: new FormControl('', [Validators.required]),
      gender: new FormControl('male', [Validators.required]),
    });
  }

  ngOnInit() {

    this._spinner.show();
    this.route.params.subscribe(params => {
      this.editedID = params['id'];

      // populate projects
      this._service.getAllProject().then(res => {
        this.allProjects = res;
        this._service.getById(this.editedID).then(response => {
          this.prevUsersData = response.data.users;
          response.data.users = response.data.users;
          this.groupEditForm.patchValue(response.data);
          this._spinner.hide();
        }).catch(error => {
          this._spinner.hide();
        });
      }).catch(error => {
        this._spinner.show();
      });
    });

    // populate projects
    this._service.getAllProject().then(res => {
      // console.log(res);
      this.allProjects = res;
      this._spinner.hide();
    }).catch(err => {
      this._spinner.hide();
    });


    // set google maps defaults
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    // create search FormControl
    this.searchControl = new FormControl();

    // set current position
    this.setCurrentPosition();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['geocode']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.groupEditForm.patchValue({ location: place.formatted_address });
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

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  groupEditFormSubmit() {
    // console.log( this.groupEditForm );
    this._spinner.show();

    // for (let index = 0; index < this.groupEditForm.value.users; index++) {
    //   this.prevUsersData.push({ code: this.getRandomInt(1000, 9999), isUsed: false });
    // }
    // this.groupEditForm.value.users = this.prevUsersData;
    if (!this.groupEditForm.valid) {
      Object.keys(this.groupEditForm.controls).forEach(key => {
        this.groupEditForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.formInvalid = false;
      delete this.groupEditForm.value.users;
      this.groupEditForm.value['id'] = this.editedID;
      this._service.save(this.groupEditForm.value).then(res => {
        this._spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'test group updated successfuly.' });
        setTimeout(() => {
          this._router.navigate(['/app/test-group']);
        }, 2000);
      }).catch(error => {
        this._spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: error['message'] });
      });
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
