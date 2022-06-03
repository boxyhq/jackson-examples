export interface Tenant {
  id: string;
  domain: string;
}

export interface User {
  id: string;
  directoryUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  tenant: Tenant;
}

export interface Group {
  id: string;
  name: string;
  directoryGroupId: string;
  tenant: Tenant;
}
