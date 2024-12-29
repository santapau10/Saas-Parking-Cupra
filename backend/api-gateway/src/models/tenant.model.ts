export class Tenant {
  private _name: string;
  private _tenant_id: string;
  private _plan: string;
  private _theme: string;

  constructor(
    name: string, 
    tenant_id: string, 
    plan: string,
    theme: string
  ) {
    this._name = name;
    this._tenant_id = tenant_id;
    this._plan = plan;
    this._theme = theme;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get tenant_id(): string {
    return this._tenant_id;
  }

  public set tenant_id(value: string) {
    this._tenant_id = value;
  }
  public get plan(): string {
    return this._plan;
  }

  public set plan(value: string) {
    this._plan = value;
  }
  public get theme(): string {
    return this._theme;
  }
  public set theme(value: string) {
    this._theme = value;
  }
}
