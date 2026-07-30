import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPostCommentComponent } from './edit-post-comment.component';

describe('EditPostCommentComponent', () => {
  let component: EditPostCommentComponent;
  let fixture: ComponentFixture<EditPostCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPostCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPostCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
