import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from '../component/form/form.component';


const routes: Routes = [
  {path: '', component: FormComponent},
  {path: 'form', component: FormComponent},
  {path: '**', component: FormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
