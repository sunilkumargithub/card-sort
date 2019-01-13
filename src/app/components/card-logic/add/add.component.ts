import { Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { CardLogicService } from '../card-logic.service';
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
  cardLogicForm: FormGroup;
  formInvalid: boolean;
  conditionSlug: any;
  projects: any;
  alldecks: any;
  conditions: any;
  cards: any;
  to_cards: any;
  from_cards: any;

  constructor(private _service: CardLogicService
    , private _messageService: MessageService
    , private _spinner: NgxSpinnerService
    , private _router: Router
    , private _loginService: LoginService) {
    this.formInvalid = true;
    this.cardLogicForm = new FormGroup({
      project: new FormControl('', [Validators.required]),
      condition: new FormControl('', [Validators.required]),
      deck: new FormControl(''),
      card: new FormControl(''),
      from_deck: new FormControl(''),
      from_card: new FormControl(''),
      to_deck: new FormControl(''),
      to_card: new FormControl('')
    });
  }

  ngOnInit() {
    this._spinner.show();
    this._service.getAllProject().then(projects => {
      this._service.getAllCondition().then(conditions => {
        this._loginService.filterCompany(projects, 'data', 'company').then(filtered => {
          this.projects = filtered;
          this.conditions = conditions;
          this._spinner.hide();
        });
      }).catch(error => {
        this._spinner.hide();
      });
    }).catch(err => {
      this._spinner.hide();
    });
  }

  changeProject(value) {
    this.cardLogicForm.patchValue({ deck: '', card: '', from_deck: '', from_card: '', to_deck: '', to_card: '' });
    const filter_data = this.projects.filter(item => item.id === value);
    this.alldecks = filter_data[0].data.decks;
    this.cards = [];
    this.to_cards = [];
    this.from_cards = [];
  }

  changeCondition(value) {
    if (value !== '') {
      this._spinner.show();
      const conditionData = this.conditions.filter(item => item.id === value);
      this.conditionSlug = conditionData[0].data.slug;

      const deckControl = this.cardLogicForm.get('deck');
      const cardControl = this.cardLogicForm.get('card');
      const from_deckControl = this.cardLogicForm.get('from_deck');
      const from_cardControl = this.cardLogicForm.get('from_card');
      const to_deckControl = this.cardLogicForm.get('to_deck');
      const to_cardControl = this.cardLogicForm.get('to_card');

      deckControl.reset('');
      cardControl.reset('');
      from_deckControl.reset('');
      from_cardControl.reset('');
      to_deckControl.reset('');
      to_cardControl.reset('');

      if (this.conditionSlug === 'select_from_list') {
        deckControl.setValidators([Validators.required]);
        deckControl.updateValueAndValidity();
        cardControl.setValidators([Validators.required]);
        cardControl.updateValueAndValidity();

        from_deckControl.clearValidators();
        from_deckControl.updateValueAndValidity();
        from_cardControl.clearValidators();
        from_cardControl.updateValueAndValidity();
        to_deckControl.clearValidators();
        to_deckControl.updateValueAndValidity();
        to_cardControl.clearValidators();
        to_cardControl.updateValueAndValidity();
      } else {
        deckControl.clearValidators();
        deckControl.updateValueAndValidity();
        cardControl.clearValidators();
        cardControl.updateValueAndValidity();

        from_deckControl.setValidators([Validators.required]);
        from_deckControl.updateValueAndValidity();
        from_cardControl.setValidators([Validators.required]);
        from_cardControl.updateValueAndValidity();
        to_deckControl.setValidators([Validators.required]);
        to_deckControl.updateValueAndValidity();
        to_cardControl.setValidators([Validators.required]);
        to_cardControl.updateValueAndValidity();
      }
      this._spinner.hide();
      // this._service.getAllDecks().then(decks => {
      //   this.alldecks = decks;
      //   this._spinner.hide();
      // }).catch(error => {
      //   this._spinner.hide();
      // });
    } else {
      this.conditionSlug = '';
    }
  }

  deckChange(value: any, item: any) {
    this._spinner.show();
    this._service.getCardByProjectAndDeck(value, this.cardLogicForm.get('project').value)
      .then(response => {
        this[item] = response;
        this._spinner.hide();
      })
      .catch(error => {
        console.log(error);
        this._spinner.hide();
      });
  }

  cardLogicFormSubmit() {
    this._spinner.show();
    if (!this.cardLogicForm.valid) {
      this._spinner.hide();
      Object.keys(this.cardLogicForm.controls).forEach(key => {
        this.cardLogicForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      // console.log(this.cardLogicForm.value);
      this.formInvalid = false;
      this._service.save(this.cardLogicForm.value).then(res => {
        this._spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Logic added successfuly.' });
        setTimeout(() => {
          this._router.navigate(['/app/card_logic']);
        }, 2000);
      }).catch(error => {
        this._spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: error['message'] });
      });
    }
  }

}
