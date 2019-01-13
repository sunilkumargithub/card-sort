
import { InjectionToken } from '@angular/core';

// export * from './core/interfaces';

export const APP_CONFIG = new InjectionToken('app.config');
export const AppConfig = {
    apiEndpoint: 'http://localhost:15422/api',
    PASSWORD_MIN_LENGTH: 5,
    PASSWORD_MAX_LENGTH: 15,
    USER_SESSION_KEY: 'user',
};
