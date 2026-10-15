import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { UserService } from '../../providers/user.service';
import { LoginPage } from './login';

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  let router: Router;
  let userService: jasmine.SpyObj<UserService>;

  const getInputs = (): HTMLElement[] =>
    Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('ion-input'));

  beforeEach(async () => {
    userService = jasmine.createSpyObj<UserService>('UserService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.resolveTo(true);

    fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('marks the empty fields as touched when the form is submitted', () => {
    const submit: HTMLElement = fixture.nativeElement.querySelector(
      'ion-button[type="submit"]',
    );

    expect(getInputs().length).toBe(2);
    expect(getInputs().some(input => input.classList.contains('ng-touched'))).toBeFalse();

    submit.click();
    fixture.detectChanges();

    for (const input of getInputs()) {
      expect(input.classList).toContain('ng-touched');
      expect(input.classList).toContain('ng-invalid');
    }
    expect(userService.login).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
