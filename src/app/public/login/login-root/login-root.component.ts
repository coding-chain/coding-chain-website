import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-root',
  templateUrl: './login-root.component.html',
  styles: [
  ]
})
export class LoginRootComponent implements OnInit {
    form: FormGroup;
    loading = false; // so no multiple clicks
    submitted = false; // know if submitted yet to display errors

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: [null, Validators.required],
            password: [null, Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        alert("submit")
        this.submitted = true;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        // todo login happens
    }

}
