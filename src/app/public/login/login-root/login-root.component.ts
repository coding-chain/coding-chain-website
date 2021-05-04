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
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get fields() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if(this.form.valid){
          this.loading = true;
          // todo login happens
          const user = this.form.value;
          // this.Login(user);
        }

    }

}
