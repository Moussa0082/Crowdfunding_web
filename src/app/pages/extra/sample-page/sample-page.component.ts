import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sample-page',
  // imports: [MaterialModule],
  imports: [
      ReactiveFormsModule,
      CommonModule,
      MatDialogModule,
      MatFormFieldModule,
            MatCardModule,
            MatIconModule,
            MatButtonModule,
      ],
  templateUrl: './sample-page.component.html',
})

export class AppSamplePageComponent { }
