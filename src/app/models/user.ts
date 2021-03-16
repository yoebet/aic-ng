import {Model} from './model';

export class User extends Model {
  accountName: string;
  realName: string;

  phoneNumber?: string;
  email?: string;
  roleCode?: string; // N: Normal; A: Admin
}
