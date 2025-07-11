import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Typewriter } from './typewriter';

describe('Typewriter', () => {
  let component: Typewriter;
  let fixture: ComponentFixture<Typewriter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Typewriter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Typewriter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
