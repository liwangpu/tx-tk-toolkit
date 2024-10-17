
export interface IUserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface IAppPackage {
  id: string;
  name: string;
  icon?: string;
  applications: IApplication[];
}

export interface IApplication {
  name: string;
  path: string;
  icon?: string;
}

export interface IPaginationParams {
  page?: number;
  pageSize?: number;
}

export interface ISortParams {
  [key: string]: 'asc' | 'desc';
}

export interface IRequestResult {
  data: {
    count: number;
    content: any[];
  }
}