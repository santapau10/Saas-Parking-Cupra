export class User {
  private _username: string;
  private _email: string; 
  private _password: string;
  private _tenant_id: string;


  constructor(
    username: string, 
    password: string, 
    tenant_id: string,
    email: string,
  ) {
    this._username = username;
    this._password = password;
    this._tenant_id = tenant_id;
    this._email = email;
  }
 

  public get username(): string {
    return this._username;
  }

  public set username(value: string) {
    this._username = value;
  }

  public get password(): string {
    return this._password;
  }

  public set password(value: string) {
    this._password = value;
  }
  public get tenant_id(): string {
    return this._tenant_id;
  }

  public set tenant_id(value: string) {
    this._tenant_id = value;
  }
  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    this._email = value;
  }
}
