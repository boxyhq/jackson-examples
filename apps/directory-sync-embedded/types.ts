export interface Tenant {
  id: string;
  domain: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  active: boolean;
  raw: any;
}

export interface Group {
  id: string;
  name: string;
  raw: any;
}
