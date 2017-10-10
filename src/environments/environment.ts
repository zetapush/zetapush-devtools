// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  hmr: true,
  plateforms: [
    {
      url: 'http://zbo.zpush.io',
      name: 'Production',
    },
    {
      url: 'https://demo-2.zpush.io',
      name: 'Demonstration',
    },
    {
      url: 'http://vm-zbo:8080',
      name: 'Pre-Production',
    },
  ],
};