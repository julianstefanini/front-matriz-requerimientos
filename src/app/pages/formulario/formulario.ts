import { ChangeDetectionStrategy, Component, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatInput } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { merge, Observable } from 'rxjs';
import { agrarioDomainValidator, ultimoCheckActivo } from '../../components/shared/validators/validators';
import { propiedadesGrilla } from '../../interfaces/secciones-propiedades-formularios';
import { propiedadesChecksBox } from '../../interfaces/propiedades-check-box';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TW } from '../../components/shared/tailwindcss/tailwind-breakpoints';
import { Navbar } from '../../components/shared/navbar/navbar';

@Component({
  selector: 'app-formulario',
  imports: [
    RouterOutlet,
    MatGridListModule,
    FormsModule,
    MatDividerModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatInput,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    Navbar
  ],
  templateUrl: './formulario.html',
  styleUrl: './formulario.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Formulario {

  //Mensajes de error
  listaMensajeError: String[] = [
    'Campo obligatorio.',
    'La estructura ingresada no pertenece a un correo electrónico.',
    'Dominio de correo inválido: ',
  ];

  isMobile$!: Observable<boolean>;
  col1! : number;
  col2! : number;
  col3! : number;
  col4! : number;
  colChecksPlan! : number;
  colComoApoya! : number;
  //variables de captura de datos
  formulario!: FormGroup;

  cantidadAplicacionesLista: string[] = ['Aplicación', 'Aplicaciones', 'Más de tres aplicaciones'];

  constructor(private fb: FormBuilder, private responsive: BreakpointObserver, private cdr: ChangeDetectorRef) {

    this.responsive.observe([TW.mobile, TW.sm, TW.md]).subscribe((result) => {
      if (result.breakpoints[TW.md]) {
        // ≥768px → MD
        this.col1 = 1;
        this.col2 = 2;
        this.col3 = 3;
        this.col4 = 4;
        this.colChecksPlan = 2;
        this.colComoApoya = 2;
        console.log('MD detected (≥768px)');
      } else if (result.breakpoints[TW.sm]) {
        // ≥640px → SM
        this.col1 = 1;
        this.col2 = 2;
        this.col3 = 3;
        this.col4 = 4;
        this.colChecksPlan = 4;
        this.colComoApoya = 4;
        console.log('SM detected (≥640px)');
      } else if (result.breakpoints[TW.mobile]) {
        // <640px → Mobile
        this.col1 = 4;
        this.col2 = 4;
        this.col3 = 4;
        this.col4 = 4;
        this.colChecksPlan = 4;
        this.colComoApoya = 4;
        console.log('Mobile detected (<640px)');
      }
      this.cdr.markForCheck();
    });


    this.formulario = this.fb.group({
      fechaSolicitud: [new Date()],
      nombresApellidos: ['', Validators.required],
      cargo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email, agrarioDomainValidator()]],
      vicepresidencia: ['', Validators.required],
      proceso: ['', Validators.required],
      personaDelegada: ['', Validators.required],
      cargoPersonaDelegada: ['', Validators.required],
      correoPersonaDelegada: [
        '',
        [Validators.required, Validators.email, agrarioDomainValidator()],
      ],
      gestorProceso: ['', Validators.required],
      gestorCorreo: ['', [Validators.required, Validators.email, agrarioDomainValidator()]],
      origen: ['', Validators.required],
      norma: ['', Validators.required],
      entidad: ['', Validators.required],
      proyecto: ['', Validators.required],
      fechaImplementacion: ['', Validators.required],
      necesidad: ['', Validators.required],
      planEstrategicoChecks: this.fb.array([], [ultimoCheckActivo()]),
      colocacion: [0],
      captacion: [0],
      comisionables: [0],
      otrosIngresos: [0],
      aclaracionOtrosIngresos: ['', Validators.required],
      eficienciaOperativa: [0],
      costosOperativos: [0],
      ahorrosPorMultasPosibles: [0],
      otroAhorros: [0],
      aclaracionOtrosAhorro: ['', Validators.required],
      comoApoyaElObjetivo: ['', Validators.required],
      queQuiero: ['', Validators.required],
      paraQue: ['', Validators.required],
      alineacion: ['', Validators.required],
      cantidadAplicaciones: [[], Validators.required],
      mejoraExperiencia: ['', Validators.required],
      comoMejoraExperiencia: ['', Validators.required],
      areasInvolucradas: this.fb.array([], Validators.required),
    }) as FormGroup;

    this.formulario.get('otrosIngresos')?.valueChanges.subscribe(value => {
      let aclaracionOtrosIngresosValue = this.formulario.get('aclaracionOtrosIngresos');

      if(value && value > 0){
        aclaracionOtrosIngresosValue?.enable();
        aclaracionOtrosIngresosValue?.markAsTouched();
      }
      else{
        aclaracionOtrosIngresosValue?.disable();
        aclaracionOtrosIngresosValue?.markAsUntouched();
      }
    })

    this.formulario.get('otroAhorros')?.valueChanges.subscribe(value => {
      let aclaracionOtrosAhorroValue = this.formulario.get('aclaracionOtrosAhorro');

      if(value && value > 0){
        aclaracionOtrosAhorroValue?.enable();
        aclaracionOtrosAhorroValue?.markAsTouched();
      }
      else{
        aclaracionOtrosAhorroValue?.disable();
        aclaracionOtrosAhorroValue?.markAsUntouched();
      }
    })

    merge([
      this.formulario.get('nombresApellidos')?.statusChanges,
      this.formulario.get('nombresApellidos')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorNombresApellidos());

    merge([this.formulario.get('cargo')?.statusChanges, this.formulario.get('cargo')?.valueChanges])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorCargo());

    merge([
      this.formulario.get('correo')?.statusChanges,
      this.formulario.get('correo')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorCorreo());

    merge([
      this.formulario.get('vicepresidencia')?.statusChanges,
      this.formulario.get('vicepresidencia')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorVicepresidencia());

    merge([
      this.formulario.get('proceso')?.statusChanges,
      this.formulario.get('proceso')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorProceso());

    merge([
      this.formulario.get('personaDelegada')?.statusChanges,
      this.formulario.get('personaDelegada')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorPersonaDelegada());

    merge([
      this.formulario.get('cargoPersonaDelegada')?.statusChanges,
      this.formulario.get('cargoPersonaDelegada')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorCargoPersonaDelegada());

    merge([
      this.formulario.get('correoPersonaDelegada')?.statusChanges,
      this.formulario.get('correoPersonaDelegada')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorCorreoPersonDelegada());

    merge([
      this.formulario.get('gestorProceso')?.statusChanges,
      this.formulario.get('gestorProceso')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorGestorProcesos());

    merge([
      this.formulario.get('gestorCorreo')?.statusChanges,
      this.formulario.get('gestorCorreo')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorCorreoGestor());

    merge([
      this.formulario.get('origen')?.statusChanges,
      this.formulario.get('origen')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorOrigen());

    merge([this.formulario.get('norma')?.statusChanges, this.formulario.get('norma')?.valueChanges])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorNorma());

    merge([
      this.formulario.get('entidad')?.statusChanges,
      this.formulario.get('entidad')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorEntidad());

    merge([
      this.formulario.get('proyecto')?.statusChanges,
      this.formulario.get('proyecto')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorProyecto());

    merge([
      this.formulario.get('fechaImplementacion')?.statusChanges,
      this.formulario.get('fechaImplementacion')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorFechaImplementacion());

    merge([
      this.formulario.get('necesidad')?.statusChanges,
      this.formulario.get('necesidad')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorNecesidad());


    merge([
      this.formulario.get('planEstrategicoChecks')?.statusChanges,
      this.formulario.get('planEstrategicoChecks')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorPlanEstrategicoChecks());

    merge([
      this.formulario.get('comoApoyaElObjetivo')?.statusChanges,
      this.formulario.get('comoApoyaElObjetivo')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorComoApoyaElObjetivo());

    merge([this.formulario.get('queQuiero')?.statusChanges, this.formulario.get('queQuiero')?.valueChanges])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorQue());

    merge([
      this.formulario.get('paraQue')?.statusChanges,
      this.formulario.get('paraQue')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorParaQue());

    merge([
      this.formulario.get('alineacion')?.statusChanges,
      this.formulario.get('alineacion')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorAlineacion());

      merge([
      this.formulario.get('cantidadAplicaciones')?.statusChanges,
      this.formulario.get('cantidadAplicaciones')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorCantidadAplicaciones());

    merge([
      this.formulario.get('mejoraExperiencia')?.statusChanges,
      this.formulario.get('mejoraExperiencia')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMejoraExperiencia());

    merge([
      this.formulario.get('comoMejoraExperiencia')?.statusChanges,
      this.formulario.get('comoMejoraExperiencia')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorComoExperiencia());

    merge([
      this.formulario.get('areasInvolucradas')?.statusChanges,
      this.formulario.get('areasInvolucradas')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorAreasInvolucradas());

    merge([
      this.formulario.get('aclaracionOtrosIngresos')?.statusChanges,
      this.formulario.get('aclaracionOtrosIngresos')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorAclaracionOtrosIngresos());

    merge([
      this.formulario.get('aclaracionOtrosAhorro')?.statusChanges,
      this.formulario.get('aclaracionOtrosAhorro')?.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorAclaracionOtrosAhorro());
  }

  ngOnInit(): void {
    this.formulario.get('fechaImplementacion')?.disable();
    this.formulario.get('norma')?.disable();
    this.formulario.get('entidad')?.disable();
    this.formulario.get('proyecto')?.disable();
    this.formulario.get('comoAlineacion')?.disable();
    this.formulario.get('comoMejoraExperiencia')?.disable();
    this.formulario.get('ahorrosPorMultasPosibles')?.disable();
    this.formulario.get('aclaracionOtrosIngresos')?.disable();
    this.formulario.get('aclaracionOtrosAhorro')?.disable();
  }

  //signals para cambiar el estado de un valor de las cajas de texto
  valorNombres = signal('');
  valorCargo = signal('');
  valorCorreo = signal('');
  valorVicepresidencia = signal('');
  valorProceso = signal('');
  valorPersonaDelegada = signal('');
  valorCargoPersonaDelegada = signal('');
  valorCorreoPersonaDelegada = signal('');
  valorGestorProcesos = signal('');
  valorGestorCorreo = signal('');
  valorNorma = signal('');
  valorNecesidadResolver = signal('');
  valorTextoObjetivo = signal('');
  valorQueQuieroTexto = signal('');
  valorParaQueTexto = signal('');
  valorComoMejora = signal('');
  valorAclaracionOtrosIngresos = signal('');
  valorAclaracionOtrosAhorro = signal('');

  //signals, para errores:
  nombresApellidosError = signal('');
  cargoError = signal('');
  correoError = signal('');
  vicepresidenciaError = signal('');
  procesoError = signal('');
  personaDelegadaError = signal('');
  cargoPersonaDelegadaError = signal('');
  correoPersonaDelegadaError = signal('');
  gestorProcesosError = signal('');
  correoGestorError = signal('');
  origenError = signal('');
  normaError = signal('');
  entidadError = signal('');
  proyectoError = signal('');
  fechaImplementacionError = signal('');
  necesidadError = signal('');
  planEstrategicoChecksError = signal('');
  comoApoyaElObjetivoError = signal('');
  queError = signal('');
  paraQueError = signal('');
  alineacionError = signal('');
  cantidadAplicacionesError = signal('');
  mejoraExperienciaError = signal('');
  comoExperienciaError = signal('');
  areasInvolucradasError = signal('');
  aclaracionOtrosIngresosError = signal('');
  aclaracionOtrosAhorroError = signal('');

  //funciones errores para actualizar las señales
  updateErrorNombresApellidos() {
    if (this.formulario.get('nombresApellidos')?.hasError('required')) {
      this.nombresApellidosError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorCargo() {
    if (this.formulario.get('cargo')?.hasError('required')) {
      this.cargoError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorCorreo() {
    if (this.formulario.get('correo')?.hasError('required')) {
      this.correoError.set(this.listaMensajeError[0].toString());
    } else if (this.formulario.get('correo')?.hasError('email')) {
      this.correoError.set(this.listaMensajeError[1].toString());
    } else if (this.formulario.get('correo')?.hasError('invalidDomain')) {
      const badDomain = this.emailDomain;

      this.correoError.set(`${this.listaMensajeError[2].toString()}@${badDomain}`);
    }
  }

  updateErrorVicepresidencia() {
    if (this.formulario.get('vicepresidencia')?.hasError('required')) {
      this.vicepresidenciaError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorProceso() {
    if (this.formulario.get('proceso')?.hasError('required')) {
      this.procesoError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorPersonaDelegada() {
    if (this.formulario.get('personaDelegada')?.hasError('required')) {
      this.personaDelegadaError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorCargoPersonaDelegada() {
    if (this.formulario.get('cargoPersonaDelegada')?.hasError('required')) {
      this.cargoPersonaDelegadaError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorCorreoPersonDelegada() {
    if (this.formulario.get('correoPersonaDelegada')?.hasError('required')) {
      this.correoPersonaDelegadaError.set(this.listaMensajeError[0].toString());
    } else if (this.formulario.get('correoPersonaDelegada')?.hasError('email')) {
      this.correoPersonaDelegadaError.set(this.listaMensajeError[1].toString());
    } else if (this.formulario.get('correoPersonaDelegada')?.hasError('invalidDomain')) {
      const badDomain = this.emailDomainPersonaDelegada;
      this.correoPersonaDelegadaError.set(`${this.listaMensajeError[2].toString()}@${badDomain}`);
    }
  }

  updateErrorGestorProcesos() {
    if (this.formulario.get('gestorProceso')?.hasError('required')) {
      this.gestorProcesosError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorCorreoGestor() {
    if (this.formulario.get('gestorCorreo')?.hasError('required')) {
      this.correoGestorError.set(this.listaMensajeError[0].toString());
    } else if (this.formulario.get('gestorCorreo')?.hasError('email')) {
      this.correoGestorError.set(this.listaMensajeError[1].toString());
    } else if (this.formulario.get('gestorCorreo')?.hasError('invalidDomain')) {
      const badDomain = this.emailDomainGestor;
      this.correoGestorError.set(`${this.listaMensajeError[2].toString()}@${badDomain}`);
    }
  }

  updateErrorOrigen() {
    if (this.formulario.get('origen')?.hasError('required')) {
      this.origenError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorNorma() {
    if (this.formulario.get('norma')?.hasError('required')) {
      this.normaError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorEntidad() {
    if (this.formulario.get('entidad')?.hasError('required')) {
      this.entidadError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorProyecto() {
    if (this.formulario.get('proyecto')?.hasError('required')) {
      this.proyectoError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorFechaImplementacion() {
    if (this.formulario.get('fechaImplementacion')?.hasError('required')) {
      this.fechaImplementacionError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorNecesidad() {
    if (this.formulario.get('necesidad')?.hasError('required')) {
      this.necesidadError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorPlanEstrategicoChecks(){
    if(this.formulario.get('planEstrategicoChecks')?.hasError('required')){
      this.planEstrategicoChecksError.set(this.listaMensajeError[0].toString());
    }
    else{
      this.planEstrategicoChecksError.set('');
    }
  }

  updateErrorComoApoyaElObjetivo() {
    if (this.formulario.get('comoApoyaElObjetivo')?.hasError('required')) {
      this.comoApoyaElObjetivoError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorQue() {
    if (this.formulario.get('queQuiero')?.hasError('required')) {
      this.queError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorParaQue() {
    if (this.formulario.get('paraQue')?.hasError('required')) {
      this.paraQueError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorAlineacion() {
    if (this.formulario.get('alineacion')?.hasError('required')) {
      this.alineacionError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorCantidadAplicaciones() {
    if (this.formulario.get('cantidadAplicaciones')?.hasError('required')) {
      this.cantidadAplicacionesError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorMejoraExperiencia() {
    if (this.formulario.get('mejoraExperiencia')?.hasError('required')) {
      this.mejoraExperienciaError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorComoExperiencia() {
    if (this.formulario.get('comoMejoraExperiencia')?.hasError('required')) {
      this.comoExperienciaError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorAreasInvolucradas() {
    if (this.formulario.get('areasInvolucradas')?.hasError('required')) {
      this.areasInvolucradasError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorAclaracionOtrosIngresos() {
    if (this.formulario.get('aclaracionOtrosIngresos')?.hasError('required')) {
      this.aclaracionOtrosIngresosError.set(this.listaMensajeError[0].toString());
    }
  }

  updateErrorAclaracionOtrosAhorro() {
    if (this.formulario.get('aclaracionOtrosAhorro')?.hasError('required')) {
      this.aclaracionOtrosAhorroError.set(this.listaMensajeError[0].toString());
    }
  }

  //Obtener la cantidad objetos que hay en la lista
  get areasInvolucradas(): FormArray {
    return this.formulario.get('areasInvolucradas') as FormArray;
  }

  //Obtener el @dominio.com => correo electrónico
  get emailDomain(): string {
    const emailValue = this.formulario.get('correo')?.value;
    const indexDomain = emailValue.indexOf('@');
    return indexDomain !== -1 ? emailValue.substring(indexDomain + 1) : '';
  }

  get totalIngresos(): number{
    let colocacionValue = this.formulario.get('colocacion')?.value ?? 0;
    let captacionValue = this.formulario.get('captacion')?.value ?? 0;
    let comisionablesValue = this.formulario.get('comisionables')?.value ?? 0;
    let otrosIngresosValue = this.formulario.get('otrosIngresos')?.value ?? 0;

    return colocacionValue + captacionValue + comisionablesValue + otrosIngresosValue;
  }

  get totalAhorros():number{
    let eficienciaOperativaValue = this.formulario.get('eficienciaOperativa')?.value ?? 0;
    let costosOperativosValue = this.formulario.get('costosOperativos')?.value ?? 0;
    let otrosAhorrosValue = this.formulario.get('otroAhorros')?.value ?? 0;

    return eficienciaOperativaValue + costosOperativosValue + otrosAhorrosValue;
  }

  get totalBeneficios():number{
    let totalIngresosValue = this.totalIngresos;
    let totalAhorrosValue = this.totalAhorros;
    let ahorrosPorMultasPosiblesValue = this.formulario.get('ahorrosPorMultasPosibles')?.value ?? 0;

    return totalIngresosValue + totalAhorrosValue + ahorrosPorMultasPosiblesValue
  }

  get emailDomainPersonaDelegada(): string {
    const emailValue = this.formulario.get('correoPersonaDelegada')?.value;
    const indexDomain = emailValue.indexOf('@');
    return indexDomain !== -1 ? emailValue.substring(indexDomain + 1) : '';
  }

  get emailDomainGestor(): string {
    const emailValue = this.formulario.get('gestorCorreo')?.value;
    const indexDomain = emailValue.indexOf('@');
    return indexDomain !== -1 ? emailValue.substring(indexDomain + 1) : '';
  }

  habilitarCamposOrigen(valorSeleccionado: string): void {
    if (valorSeleccionado === 'proyectos') {

      this.formulario.get('proyecto')?.enable();
      this.formulario.get('proyecto')?.markAsTouched();

      this.formulario.get('entidad')?.markAsUntouched();
      this.formulario.get('entidad')?.disable();

      this.formulario.get('norma')?.markAsUntouched();
      this.formulario.get('norma')?.disable();

      this.formulario.get('fechaImplementacion')?.markAsUntouched();
      this.formulario.get('fechaImplementacion')?.disable();

      this.formulario.get('ahorrosPorMultasPosibles')?.markAsUntouched();
      this.formulario.get('ahorrosPorMultasPosibles')?.disable();

    } else if (valorSeleccionado === 'regulatorios') {
      this.formulario.get('proyecto')?.markAsUntouched();
      this.formulario.get('proyecto')?.disable();

      this.formulario.get('entidad')?.enable();
      this.formulario.get('entidad')?.markAsTouched();

      this.formulario.get('norma')?.enable();
      this.formulario.get('norma')?.markAsTouched();

      this.formulario.get('fechaImplementacion')?.enable();
      this.formulario.get('fechaImplementacion')?.markAsTouched();

      this.formulario.get('ahorrosPorMultasPosibles')?.enable();
      this.formulario.get('ahorrosPorMultasPosibles')?.markAsTouched();

    } else {
      this.formulario.get('proyecto')?.disable();
      this.formulario.get('proyecto')?.markAsUntouched();

      this.formulario.get('entidad')?.disable();
      this.formulario.get('entidad')?.markAsUntouched();

      this.formulario.get('norma')?.disable();
      this.formulario.get('norma')?.markAsUntouched();

      this.formulario.get('fechaImplementacion')?.disable();
      this.formulario.get('fechaImplementacion')?.markAsUntouched();

      this.formulario.get('ahorrosPorMultasPosibles')?.disable();
      this.formulario.get('ahorrosPorMultasPosibles')?.markAsUntouched();
    }
  }

  habilitarCampoComo(valorSeleccionado: string): void {
    if (valorSeleccionado === 'si') {
      this.formulario.get('comoMejoraExperiencia')?.enable();
      this.formulario.get('comoMejoraExperiencia')?.markAsTouched();
    } else {
      this.formulario.get('comoMejoraExperiencia')?.disable();
      this.formulario.get('comoMejoraExperiencia')?.markAsUntouched();
    }
  }

  //Propiedades para enviar a la grilla con el texto, cantidad de filas, columnas y estilos que deben tener en la grilla
  propiedades: propiedadesGrilla[] = [
    {
      texto: 'MATRIZ DE SOLICITUDES DE REQUERIMIENTOS DE SOFTWARE',
      columnas: 4,
      filas: 1,
      color: '#8497B0',
    },
    { texto: 'DATOS DEL SOLICITANTE', columnas: 4, filas: 1, color: '#A6C9EC' },
  ];

  propiedadadSeptimaFila: propiedadesGrilla[] = [
    { texto: 'DETALLE DE LA NECESIDAD', columnas: 4, filas: 1, color: '#A6C9EC' },
  ];

  propiedadDecimaFila: propiedadesGrilla[] = [
    { texto: 'PLAN ESTRATÉGICO', columnas: 4, filas: 1, color: '#A6C9EC' },
  ];

  propiedadesCatorceavaFila: propiedadesGrilla[] = [
    { texto: 'BENEFICIOS PARA LA ORGANIZACIÓN', columnas: 4, filas: 1, color: '#A6C9EC' },
  ];

  propiedadesAnalisisBeneficio: propiedadesGrilla[] = [
    { texto: 'ANÁLISIS DEL BENEFICIO', columnas: 4, filas: 1, color: '#A6C9EC' },
  ];


  propiedadesIngresoBeneficio: propiedadesGrilla[] = [
    { texto: 'INGRESOS', columnas: 3, filas: 1, color: '#718EA6' },
  ];

  propiedadesAhorroBeneficio: propiedadesGrilla[] = [
    { texto: 'AHORROS', columnas: 3, filas: 1, color: '#718EA6' },
  ];

  totalBeneficio: propiedadesGrilla[] = [
    { texto: 'TOTAL BENEFICIO', columnas: 3, filas: 1, color: '#718EA6' },
  ];

  propiedadesDieciSeisavaFila: propiedadesGrilla[] = [
    { texto: 'ÁREAS INVOLUCRADAS O IMPACTADAS', columnas: 4, filas: 1, color: '#A6C9EC' },
  ];


  //Propiedades checkBox
  propiedadesCheckBox: propiedadesChecksBox[] = [
    { nombre: 'Expansión del Crédito Agropecuario', activo: false },
    { nombre: 'Experiencia y servicio', activo: false },
    { nombre: 'Transformación Digital', activo: false },
    { nombre: 'No Tiene Relación', activo: false },
  ];

  opcionSeleccionada: string = '';

  //Nos muestra la cantidad de caracteres ingresados
  protected onInputNombres(event: Event) {
    this.valorNombres.set((event.target as HTMLInputElement).value);
  }

  protected onInputCargo(event: Event) {
    this.valorCargo.set((event.target as HTMLInputElement).value);
  }

  protected onInputCorreo(event: Event) {
    this.valorCorreo.set((event.target as HTMLInputElement).value);
  }

  protected onInputVicepresidencia(event: Event) {
    this.valorVicepresidencia.set((event.target as HTMLInputElement).value);
  }

  protected onInputProceso(event: Event) {
    this.valorProceso.set((event.target as HTMLInputElement).value);
  }

  protected onInputPersonaDelegada(event: Event) {
    this.valorPersonaDelegada.set((event.target as HTMLInputElement).value);
  }

  protected onInputCargoPersonaDelegada(event: Event) {
    this.valorCargoPersonaDelegada.set((event.target as HTMLInputElement).value);
  }

  protected onInputCorreoPersonaDelegada(event: Event) {
    this.valorCorreoPersonaDelegada.set((event.target as HTMLInputElement).value);
  }

  protected onInputValorGestorProcesos(event: Event) {
    this.valorGestorProcesos.set((event.target as HTMLInputElement).value);
  }

  protected onInputValorGestorCorreo(event: Event) {
    this.valorGestorCorreo.set((event.target as HTMLInputElement).value);
  }

  protected onInputNecesidadResolver(event: Event) {
    this.valorNecesidadResolver.set((event.target as HTMLInputElement).value);
  }

  protected onInputTextoObejtivo(event: Event) {
    this.valorTextoObjetivo.set((event.target as HTMLInputElement).value);
  }

  protected onInputQueQuieroTexto(event: Event) {
    this.valorQueQuieroTexto.set((event.target as HTMLInputElement).value);
  }

  protected onInputParaQueTexto(event: Event) {
    this.valorParaQueTexto.set((event.target as HTMLInputElement).value);
  }

  protected onInputComoMejora(event: Event) {
    this.valorComoMejora.set((event.target as HTMLInputElement).value);
  }

  protected onInputNorma(event: Event) {
    this.valorNorma.set((event.target as HTMLInputElement).value);
  }

  protected onInputAclaracionOtrosIngresos(event: Event) {
    this.valorAclaracionOtrosIngresos.set((event.target as HTMLInputElement).value);
  }

  protected onInputaclaracionOtrosAhorro(event: Event) {
    this.valorAclaracionOtrosAhorro.set((event.target as HTMLInputElement).value);
  }

  protected addInput() {
    const newControl = this.fb.control('', Validators.required);
    this.areasInvolucradas.push(newControl);
  }
  protected removeInput() {
    if (this.areasInvolucradas.length > 0) {
      this.areasInvolucradas.removeAt(this.areasInvolucradas.length - 1);
    }
  }

  protected trackByIndex(index: number): number {
    return index;
  }

  //Captura datos
  protected capturaDatos() {

    /* console.log(`nombresApellidos: ${this.formulario.get('nombresApellidos')?.valid}`);
    console.log(`cargo: ${this.formulario.get('cargo')?.valid}`);
    console.log(`correo: ${this.formulario.get('correo')?.valid}`);
    console.log(`vicepresidencia: ${this.formulario.get('vicepresidencia')?.valid}`);
    console.log(`nombreProceso: ${this.formulario.get('nombreProceso')?.valid}`);
    console.log(`personaDelegada: ${this.formulario.get('personaDelegada')?.valid}`);
    console.log(`cargoPersonaDelegada: ${this.formulario.get('cargoPersonaDelegada')?.valid}`);
    console.log(`correoPersonaDelegada: ${this.formulario.get('correoPersonaDelegada')?.valid}`);
    console.log(`gestorProcesos: ${this.formulario.get('gestorProcesos')?.valid}`);
    console.log(`correoGestor: ${this.formulario.get('correoGestor')?.valid}`);
    console.log(`origen: ${this.formulario.get('origen')?.valid}`);
    console.log(`norma: ${this.formulario.get('norma')?.valid}`);
    console.log(`entidad: ${this.formulario.get('entidad')?.valid}`);
    console.log(`proyecto: ${this.formulario.get('proyecto')?.valid}`);
    console.log(`fechaImplementacion: ${this.formulario.get('fechaImplementacion')?.valid}`);
    console.log(`necesidad: ${this.formulario.get('necesidad')?.valid}`); */
    //console.log(`planEstrategicoChecks: ${this.formulario.get('planEstrategicoChecks')?.valid}`);
    /* console.log(`comoApoyaElObjetivo: ${this.formulario.get('comoApoyaElObjetivo')?.valid}`);
    console.log(`que: ${this.formulario.get('que')?.valid}`);
    console.log(`paraQue: ${this.formulario.get('paraQue')?.valid}`);
    console.log(`descripcionBeneficio: ${this.formulario.get('descripcionBeneficio')?.valid}`);
    console.log(`alineacion: ${this.formulario.get('alineacion')?.valid}`);
    console.log(`cantidadAplicaciones: ${this.formulario.get('cantidadAplicaciones')?.valid}`);
    console.log(`mejoraExperiencia: ${this.formulario.get('mejoraExperiencia')?.valid}`);
    console.log(`comoExperiencia: ${this.formulario.get('comoExperiencia')?.valid}`);
    console.log(`areasInvolucradas: ${this.formulario.get('areasInvolucradas')?.valid}`); */

     this.formulario.markAllAsTouched();

    if (this.areasInvolucradas.length == 0) {
      this.addInput();
    }

    if (this.formulario.valid) {
      let totalUmbral = 0;

      //lógica para back-end y sea paramtrizable
      //origen puntaje
      if (this.formulario.get('origen')?.value === 'regulatorios') {
        totalUmbral += 10;
      } else if (this.formulario.get('origen')?.value === 'proyectos') {
        totalUmbral += 7;
      } else if (this.formulario.get('origen')?.value === 'operación normal') {
        totalUmbral += 3;
      }

      //Alineado a innovación puntaje
      if (this.formulario.get('alineacion')?.value === 'si') {
        totalUmbral += 15;
      } else if (this.formulario.get('alineacion')?.value === 'no') {
        totalUmbral += 5;
      }

      //mejora experiencia
      if (this.formulario.get('mejoraExperiencia')?.value === 'si') {
        totalUmbral += 15;
      } else if (this.formulario.get('mejoraExperiencia')?.value === 'no') {
        totalUmbral += 5;
      }

      //Complejidad
      if (this.formulario.get('cantidadAplicaciones')?.value === 'aplicación') {
        totalUmbral += 12;
      } else if (this.formulario.get('cantidadAplicaciones')?.value === 'aplicaciones') {
        totalUmbral += 6;
      } else if (
        this.formulario.get('cantidadAplicaciones')?.value === 'más de tres aplicaciones'
      ) {
        totalUmbral += 2;
      }

      localStorage.setItem('usuario', JSON.stringify(this.formulario.value));
      console.log(`El total del umbral es: ${totalUmbral}`);
    }
    else{
      console.log('no ingresa');
    }
  }

   protected checksPlanEstrategico(event: MatCheckboxChange) {
    const value = event.source.value; //Nombre de la opción que cambio
    const isChecked = event.checked; //validar si es true o false
    const formArray = this.formulario.get('planEstrategicoChecks') as FormArray; //agregar al array

    if (value === 'No Tiene Relación' && isChecked) {
      formArray.clear(); // limpia los 3 checks seleccionados
      formArray.push(new FormControl('No Tiene Relación')); //agrega al nuevo array 'No tiene relación'

      this.propiedadesCheckBox.forEach((p) => {
        p.activo = p.nombre === 'No Tiene Relación'; // Solo activa 'No tiene relación'
      });
    } else if (value !== 'No Tiene Relación' && isChecked) {
      // Si 'No Tiene Relación' está en el array, obtiene el indice actual
      const indexSinPrueba = formArray.controls.findIndex(
        (ctrl) => ctrl.value === 'No Tiene Relación'
      );
      if (indexSinPrueba !== -1) {
        //en caso de estar seleccionado 'No Tiene Relación'
        formArray.removeAt(indexSinPrueba); //remueve 'No Tiene Relación'
      }

      // Desactivar "sin prueba" en la UI
      const sinRelacion = this.propiedadesCheckBox.find((p) => p.nombre === 'No Tiene Relación');
      if (sinRelacion) sinRelacion.activo = false;

      // Agregar la opción actual si no está, agrega las otras tres opciones
      const alreadyExists = formArray.controls.some((ctrl) => ctrl.value === value);
      if (!alreadyExists) {
        formArray.push(new FormControl(value));
      }

      // Activar la opción actual
      const actual = this.propiedadesCheckBox.find((p) => p.nombre === value);
      if (actual) actual.activo = true;
    } else if (!isChecked) {
      // Desmarcó una opción — quitarla del form array
      const index = formArray.controls.findIndex((ctrl) => ctrl.value === value);
      if (index !== -1) {
        formArray.removeAt(index);
      }

      // Desactivar en UI
      const desactivar = this.propiedadesCheckBox.find((p) => p.nombre === value);
      if (desactivar) desactivar.activo = false;
    }
    formArray.updateValueAndValidity({ onlySelf: true, emitEvent: true });
  }

}
