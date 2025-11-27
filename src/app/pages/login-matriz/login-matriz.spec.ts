import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginMatriz } from './login-matriz';

describe('LoginMatriz', () => {
  let component: LoginMatriz;
  let fixture: ComponentFixture<LoginMatriz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginMatriz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginMatriz);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
