export interface ITKAccount {
  id?: string;
  account: string;
  email: string;
  password: string;
  language?: {
    id: string;
    name: string;
    language: string;
  };
}
