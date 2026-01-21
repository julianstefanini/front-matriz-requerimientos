import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from "@angular/material/icon";
import { AuthService } from '../../services/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-matriz',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIcon],
  templateUrl: './login-matriz.html',
  styleUrl: './login-matriz.scss',
})
export class LoginMatriz {
  hide = true;

  loginForm = new FormGroup({
    usuarioFormControl : new FormControl<string>('', {validators: Validators.required, nonNullable: true}),
    contraseniaFormControl : new FormControl<string>('', {validators: Validators.required, nonNullable: true})
  });

  constructor(private authService: AuthService, private rout: Router){}

  login(){

    this.authService.login(this.loginForm.controls.usuarioFormControl.value, this.loginForm.controls.contraseniaFormControl.value)
    .subscribe({
      next : () =>{
        console.log('Acceso permitido');
        this.rout.navigate(['/formulario'])
      },
      error: (err) => {
        console.log('Acceso incorrecto');

      }
    })
  }
}
