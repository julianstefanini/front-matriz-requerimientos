import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

//Función para validar el dominio del correo capturado en los campos tipo email
export function agrarioDomainValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; // Si no hay valor, no validamos.

    const email = control.value as string;
    const isValid = email.endsWith('@bancoagrario.gov.co');

    return !isValid ? { 'invalidDomain': { value: control.value } } : null;
  };
}

//Validar check activo para mostrar error en
export function ultimoCheckActivo(): ValidatorFn {
  return (formArray: AbstractControl): ValidationErrors | null => {
    if (!(formArray instanceof FormArray)) return null;

    const total = formArray.length; // basta con contar los controles

    return total > 0 ? null : { required: true };
  };
}
