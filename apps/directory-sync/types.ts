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
  active: boolean;
  groupName: string[];
}

export interface Group {
  id: string;
  name: string;
  directoryGroupId: string;
  tenant: Tenant;
}

export interface Log {
  id: string;
  action: string;
  payload: any;
  createdAt: Date;
  tenant: Tenant;
}
