import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoUserComponent } from './historico-user.component';

describe('HistoricoUserComponent', () => {
  let component: HistoricoUserComponent;
  let fixture: ComponentFixture<HistoricoUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
