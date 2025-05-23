import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icons',
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
  templateUrl: './icons.component.html',
})
export class AppIconsComponent { }
