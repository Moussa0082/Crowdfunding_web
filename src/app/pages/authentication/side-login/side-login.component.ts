import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-side-login',
  // imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
   imports: [
      FormsModule,
      MaterialModule,
      RouterModule,
        ReactiveFormsModule,
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
              MatCardModule,
              MatIconModule,
              MatButtonModule,
        ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {

  constructor( private router: Router) {}

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    // console.log(this.form.value);
    this.router.navigate(['/dashboard']);
  }
}
