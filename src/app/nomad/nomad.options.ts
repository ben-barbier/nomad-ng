import { InjectionToken } from '@angular/core';

export const NOMAD_OPTIONS = new InjectionToken<NomadOptions>('nomad-options', {
    providedIn: 'root',
    factory: NOMAD_OPTIONS_FACTORY,
});

// 💡: Executed when something injects NOMAD_OPTIONS if NOMAD_OPTIONS is not defined in the app.module.ts
export function NOMAD_OPTIONS_FACTORY(): NomadOptions {
    return new NomadOptions();
}

export class NomadOptions {
    offlineIgnoredPaths: string[] = [];
}
