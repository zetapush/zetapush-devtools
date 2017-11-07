export const environment = {
  production: true,
  hmr: false,
  plateforms: [
    {
      url: 'http://zbo.zpush.io',
      name: 'Production',
    },
    {
      url: 'https://demo-1.zpush.io',
      name: 'Demonstration',
    },
    {
      url: 'https://demo-2.zpush.io',
      name: 'Demonstration (Legacy)',
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
};
