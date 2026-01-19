import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-login-matriz',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIcon],
  templateUrl: './login-matriz.html',
  styleUrl: './login-matriz.scss',
})
export class LoginMatriz {
  usuarioFormControl = new FormControl('', Validators.required);
  contraseniaFormControl = new FormControl('', Validators.required);
  hide = true;
}
