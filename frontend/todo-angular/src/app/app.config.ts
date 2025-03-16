import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]), // Ajoute tes routes ici plus tard
    provideHttpClient(), // Fournit HttpClient pour les requêtes HTTP
    // Pas besoin de provideForms ici
  ],
};