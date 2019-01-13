import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeckService } from '../deck.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  deckEditForm: FormGroup;
  formInvalid: boolean;
  updatedId: any;
  projects: any = [];
  colors: any = [];
  projectTitle: string;
  constructor(
    private deckService: DeckService,
    private ac: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _messageService: MessageService,
    private _fb: FormBuilder
  ) {
    this.formInvalid = true;
    this.deckEditForm = this._fb.group({
      decks: this._fb.array([]),
    });
  }

  ngOnInit() {
    this.spinner.show();
    this.ac.params.subscribe(params => {
      this.deckService.getAllProject().then(res => {
        this.projects = res;
        this.deckService.getAllColors().then(colors => {
          this.colors = colors;
          // console.log(this.colors);
          this.deckService.getById(params.id).then(resp => {
            // console.log(resp);
            if (resp.data.decks.length > 0) {
              resp.data.decks.forEach(item => {
                this.addNewDeckRow();
              });
            } else {
              this.addNewDeckRow();
            }

            this.updatedId = params.id;

            // console.log(this.updatedId);
            this.projectTitle = resp.data.title;
            this.deckEditForm.patchValue(resp.data);
            this.spinner.hide();
          }).catch(err => {
            console.log(err);
            this.spinner.hide();
          });
        }).catch(err => {
          console.log(err);
          this.spinner.hide();
        });
      }).catch(err => {
        this.spinner.hide();
      });
    });
  }

  // getdeckes

  initDecks(): FormGroup {
    return this._fb.group({
      // list all your form controls here, which belongs to your form array
      name: ['', Validators.required]
      , color: ['', Validators.required]
      , isRequired: ['false', Validators.required]
    });
  }

  addNewDeckRow() {
    const control = <FormArray>this.deckEditForm.controls.decks;
    control.push(this.initDecks());
  }

  deleteDeckRow(i: number): void {
    const control = <FormArray>this.deckEditForm.controls.decks;
    control.removeAt(i);
  }

  save(data) {
    this.spinner.show();
    if (!this.deckEditForm.valid) {
      Object.keys(this.deckEditForm.controls).forEach(key => {
        this.deckEditForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.formInvalid = false;
      data['id'] = this.updatedId;
      // console.log(data);
      this.deckService.save(data).then(res => {
        this.spinner.hide();
        this.router.navigate(['app/deck/list']);
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data updated successfully' });
      }).catch(err => {
        console.log(err);
        this.spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
      });
    }
  }

}
