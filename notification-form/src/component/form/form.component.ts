import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { debounceTime } from 'rxjs/internal/operators/debounceTime'
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged'
import { AppService } from 'src/app/app.service';
import * as $ from 'jquery';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})

export class FormComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  supervisor: string = '';

  emailPreference: boolean = false;
  phoneNumberPreference: boolean = false;

  supervisorList: any;

  postSubscription: Subscription;
  getSubscription: Subscription;
  formsubscription: Subscription;

  form : FormGroup = this.fb.group({
    firstName: [this.firstName, [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
    lastName: [this.lastName, [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
    email: [{value: this.email, disabled:true}, Validators.email],
    phoneNumber: [{value:this.phoneNumber, disabled:true}, Validators.pattern('^(\\+)?([ 0-9]){10,16}$')],
    supervisor: [this.supervisor, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private appService: AppService
  ) { }


  ngOnInit() {
    this.subscribeForm();
    this.getSupervisors();
  }

  ngOnDestroy(){
    this.formsubscription.unsubscribe();
    this.postSubscription.unsubscribe();
    this.getSubscription.unsubscribe();
  }

  submitForm(){
    if(this.form.invalid){
      this.openSnackBar('Missing elements of the form');
    }else{
      this.postSubscription = this.appService.postNotification(this.form.value)
        .subscribe(data =>{
          this.openSnackBar(`succesfully submitted form: ${data}`);
          this.form.reset();
        },(error) =>{
          console.log("Error when posting notification ", error);
        });    
    }
  }

  updateEmailPreference(){
    this.emailPreference = $('#emailPreference').prop('checked');

    let email = this.form.get('email');

    if(this.emailPreference){
      email.enable();
      this.removePhoneNumberPreference();
    }else{
      email.disable();
    }

    if(this.emailPreference){
      email.setValidators([Validators.email, Validators.required]);
    }else{
      email.setValidators(Validators.email);
    }
    
    email.updateValueAndValidity();
  }

  updatePhoneNumberPreference(){
    this.phoneNumberPreference = $('#phoneNumberPreference').prop('checked');

    let phoneNumber = this.form.get('phoneNumber');

    if(this.phoneNumberPreference){
      phoneNumber.enable();
      this.removeEmailPreference();
    }else{
      phoneNumber.disable();
    }

    if(this.phoneNumberPreference){
      phoneNumber.setValidators([Validators.pattern('^(\\+)?([ 0-9]){10,16}$'), Validators.required]);
    }else{
      phoneNumber.setValidators(Validators.pattern('^(\\+)?([ 0-9]){10,16}$'));
    }

    phoneNumber.updateValueAndValidity();
  }

  private removePhoneNumberPreference(){
    $('#phoneNumberPreference').prop('checked', false);
    this.updatePhoneNumberPreference();
  }

  private removeEmailPreference(){
    $('#emailPreference').prop('checked', false);
    this.updateEmailPreference();
  }

  private subscribeForm(){
    this.formsubscription = this.form.valueChanges
      .pipe(
          debounceTime(400),
          distinctUntilChanged((a,b) => this.jsonEqual(a,b)),
      ).subscribe();
  }

  private jsonEqual(a: any, b: any): boolean{
    return JSON.stringify(a) === JSON.stringify(b);
  }

  private getSupervisors(){
    this.getSubscription = this.appService
      .getSupervisors()
      .subscribe((supervisors: any) =>{
        this.supervisorList = supervisors;
      });
  }

  private openSnackBar(message: string){
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      verticalPosition: 'top'
    }).onAction()
      .subscribe(() => {});
  }
}
