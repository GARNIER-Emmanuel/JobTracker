import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jobs } from './jobs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Jobs', () => {
  let component: Jobs;
  let fixture: ComponentFixture<Jobs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jobs],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Jobs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
