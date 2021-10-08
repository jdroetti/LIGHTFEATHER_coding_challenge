import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { debounceTime } from 'rxjs/internal/operators/debounceTime'
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged'

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
  supervisor: number = 0;

  supervisorList: any;


  formsubscription: any;
  form : FormGroup = this.fb.group({
    firstName: [this.firstName, Validators.required],
    lastName: [this.lastName, Validators.required],
    email: [this.email],
    phoneNumber: [this.phoneNumber],
    supervisor: [this.supervisor, Validators.required]
  });


  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }


  ngOnInit() {
    this.subscribeForm();
    this.getSupervisors();
  }

  ngOnDestroy(){
    this.formsubscription.unsubscribe();
  }

  submitForm(){
    if(this.form.invalid){
      this.openSnackBar('Missing elements of the form');
    }else{
      console.log('succesfully submitted form');
      this.form.reset();
    }
  }

  private subscribeForm(){
    this.formsubscription = this.form.valueChanges
      .pipe(
          debounceTime(400),
          distinctUntilChanged((a,b) => this.jsonEqual(a,b)),
      ).subscribe(value => {
        console.log("Notification Fomr: ", value);
      });
  }

  private jsonEqual(a: any, b: any): boolean{
    return JSON.stringify(a) === JSON.stringify(b);
  }

  private getSupervisors(){
    console.log("getSupervisors");
    this.supervisorList = {
      'supervisors':[
        {'name': 'test'},
        {'name' : 'test2'}
      ]
    };
  }

  private openSnackBar(message: string){
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      verticalPosition: 'top'
    }).onAction()
      .subscribe(() => {});
  }
}
