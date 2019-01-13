import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ProjectService } from '../project.service';
import { TestGroupService } from '../../test-group/test-group.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../../../core/services';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  projectEditForm: FormGroup;
  formInvalid: boolean;
  clients: any;
  companies: any;
  editedID: any;
  alldecks: any;
  colors: any;

  constructor(private _service: ProjectService
    , private _testService: TestGroupService
    , private _messageService: MessageService
    , private _spinner: NgxSpinnerService
    , private _router: Router
    , private route: ActivatedRoute
    , private _fb: FormBuilder
    , private _loginService: LoginService) {
    this.formInvalid = true;
    this.projectEditForm = this._fb.group({
      title: new FormControl('', [Validators.required]),
      client: new FormControl('', [Validators.required]),
      testGroup: new FormControl('', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]),
      company: new FormControl('', [Validators.required]),
      roundConfiguration: this._fb.array([]),
      groups: this._fb.array([])
      // rounds: new FormControl('', [Validators.required]),
      // roundConfiguration: new FormControl('', [Validators.required]),
      // decks: new FormControl('', [Validators.required]),
    });
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  changeTestGroup(value: any) {
    if (value !== '') {
      const control = <FormArray>this.projectEditForm.controls.groups;
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

  // initDecks(): FormGroup {
  //   return this._fb.group({
  //     // list all your form controls here, which belongs to your form array
  //     name: ['', Validators.required]
  //     , color: ['', Validators.required]
  //     , isRequired: ['false', Validators.required]
  //   });
  // }

  // addNewDeckRow() {
  //   const control = <FormArray>this.projectEditForm.controls.decks;
  //   control.push(this.initDecks());
  // }

  // deleteDeckRow(i: number): void {
  //   const control = <FormArray>this.projectEditForm.controls.decks;
  //   control.removeAt(i);
  // }

  initTestGroups(): FormGroup {
    return this._fb.group({
      // list all your form controls here, which belongs to your form array
      id: ['']
      , users_ids: ['']
      , title: ['', [Validators.required]]
      , users: ['', [Validators.required]]
      , age: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{2}$/)]]
      , gender: ['male', [Validators.required]]
      , location: ['', [Validators.required]]
    });
  }

  addNewTestgroupRow() {
    const control = <FormArray>this.projectEditForm.controls.groups;
    control.push(this.initTestGroups());
  }

  deleteTestgroupRow(i: number): void {
    const control = <FormArray>this.projectEditForm.controls.groups;
    control.removeAt(i);
  }

  initRoundConfig(): FormGroup {
    return this._fb.group({
      // list all your form controls here, which belongs to your form array
      time: [0]
      , point: [0]
    });
  }

  addNewRoundConfigRow() {
    const control = <FormArray>this.projectEditForm.controls.roundConfiguration;
    control.push(this.initRoundConfig());
  }

  deleteRoundConfigRow(i: number): void {
    const control = <FormArray>this.projectEditForm.controls.roundConfiguration;
    control.removeAt(i);
  }

  ngOnInit() {
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
                this.route.params.subscribe(params => {
                  this.editedID = params['id'];
                  this._service.getById(this.editedID).then(response => {
                    setTimeout(() => {
                      // console.log(response);
                      response.data.roundConfiguration.forEach(element => {
                        this.addNewRoundConfigRow();
                      });
                      response.data.groups.forEach(element => {
                        this.addNewTestgroupRow();
                      });
                      this.projectEditForm.patchValue(response.data);
                      this._spinner.hide();
                    }, 3000);
                  }).catch(error => {
                    this._spinner.hide();
                  });
                });
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

  projectEditFormSubmit() {
    this._spinner.show();
    if (!this.projectEditForm.valid) {
      this._spinner.hide();
      Object.keys(this.projectEditForm.controls).forEach(key => {
        this.projectEditForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {

      // console.log(this.projectEditForm.value);
      let testGroups = [];
      for (let index = 0; index < this.projectEditForm.value.testGroup; index++) {
        const users: any[] = [];
        for (let i = 0; i < this.projectEditForm.value.groups[index].users; i++) {
          users.push({ code: this.getRandomInt(1000, 9999) });
        }
        this.projectEditForm.value.groups[index].users = users;
      }

      testGroups = this.projectEditForm.value.groups;
      delete this.projectEditForm.value.groups;

      this.formInvalid = false;
      // this.projectEditForm.value['decks'] = [];

      // console.log(testGroups);

      this.formInvalid = false;
      this.projectEditForm.value['id'] = this.editedID;
      this._service.save(this.projectEditForm.value).then(res => {

        let index = 0;
        // console.log(testGroups.length);
        testGroups.forEach(element => {
          const d = { project: this.editedID, ...element };
          index++;
          // console.log('index ' + index);
          // console.log('total ' + testGroups.length);
          // console.log(d);
          this._testService.save(d).then(res1 => {
            // if (testGroups.length === index) {
            this._spinner.hide();
            this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Project updated successfuly.' });
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
