import { Routes } from '@angular/router';
import { Formulario } from './pages/formulario/formulario';
import { LoginMatriz } from './pages/login-matriz/login-matriz';

export const routes: Routes = [
  {
    path: 'formulario',
    component: Formulario
  },
  {
    path: '',
    component: LoginMatriz
  }
];
