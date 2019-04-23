import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsDialogComponent } from './clients-dialog.component';

describe('ClientsDialogComponent', () => {
  let component: ClientsDialogComponent;
  let fixture: ComponentFixture<ClientsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientsDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
