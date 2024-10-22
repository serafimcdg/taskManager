export interface IUserAttributes {
    id?: number;
    name: string;
    email: string;
    password: string;
  }
  
  export interface IUserCreationAttributes extends Omit<IUserAttributes, 'id'> {}
  