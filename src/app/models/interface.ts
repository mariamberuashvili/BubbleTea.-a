export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  isAdmin: boolean;

}

export interface Tea {
  id: number;
  name: string;
  temperatura?: number;
  precio?: number;
  active: boolean;
  
}