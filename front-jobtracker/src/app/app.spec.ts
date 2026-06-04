import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: MessageService,
          useValue: {
            add: vi.fn(),
            messageObserver: new Subject(),
            clearObserver: new Subject()
          }
        }]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('JobTracker');
  });
});
