import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { MemoService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
  form!: FormGroup;
  id?: string;
  title!: string;
  loading = false;
  submitting = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private memoService: MemoService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    // form with validation rules
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      note: ['', Validators.required],
    });

    this.title = 'Add Memo';
    if (this.id) {
      // edit mode
      this.title = 'Edit Memo';
      this.loading = true;
      this.memoService
        .getById(this.id)
        .pipe(first())
        .subscribe((x) => {
          this.form.patchValue(x);
          this.loading = false;
        });
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;
    this.saveMemo()
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Memo saved succsesfully');
          this.router.navigateByUrl('/memos');
        },
        error: (error) => {
          this.alertService.error(error);
          this.submitting = false;
        },
      });
  }

  private saveMemo() {
    // create or update user based on id param
    return this.id
      ? this.memoService.update(this.id!, this.form.value)
      : this.memoService.create(this.form.value);
  }
}
