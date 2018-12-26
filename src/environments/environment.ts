// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  plateforms: [
    {
      url: 'https://zbo.zpush.io',
      name: 'Production',
    },
    {
      url: 'https://demo-1.zpush.io',
      name: 'Demonstration',
    },
    {
      url: 'http://hq.zpush.io:9080',
      name: 'Pre-Production',
    },
    {
      url: '<custom>',
      name: 'Custom',
    },
  ],
  version: '3.0.0',
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in psroduction mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
