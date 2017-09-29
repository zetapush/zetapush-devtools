export interface Platform {
  name: string;
  url: string;
}

export interface Environement {
  production: boolean;
  plateforms: Platform[];
}
