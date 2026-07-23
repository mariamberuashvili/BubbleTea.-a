import { Component } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ ReactiveFormsModule, Navbar],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {

  private fb = new FormBuilder();

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  submitted = false;

  send() {
    this.submitted = true;

    if (this.contactForm.invalid) return;

    this.contactForm.reset();
    this.submitted = false;
  }
}