import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsljVre6iFAfKyzKiLEtRkMN1ukkwi3wc",
  authDomain: "modulo-c1980.firebaseapp.com",
  projectId: "modulo-c1980",
  storageBucket: "modulo-c1980.firebasestorage.app",
  messagingSenderId: "936365011803",
  appId: "1:936365011803:web:ea27eb6a378d40c259207e",
  measurementId: "G-FQJMBEPFPM"
};

const firebaseApp = initializeApp(firebaseConfig);
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(firebaseApp);
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};