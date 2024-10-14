import { v4 as uuidv4 } from 'uuid'; 

export class Defect {
  private _object: string;
  private _location: string; 
  private _description: string;
  private _detailedDescription: string;
  private _reportingDate: Date;
  private _status: 'open' | 'inwork' | 'closed' | 'rejected';

  constructor(
    object: string, 
    location: string, 
    description: string, 
    detailedDescription: string, 
    reportingDate: Date,
    status: 'open' | 'inwork' | 'closed' | 'rejected' = 'open'
  ) {
    this._object = object;
    this._location = location;
    this._description = description;
    this._detailedDescription = detailedDescription;
    this._reportingDate = reportingDate;
    this._status = status;
  }


  public get object(): string {
    return this._object;
  }

  public set object(value: string) {
    this._object = value;
  }

  public get location(): string {
    return this._location;
  }

  public set location(value: string) {
    this._location = value;
  }

  public get description(): string {
    return this._description;
  }

  public set description(value: string) {
    this._description = value;
  }

  public get detailDescription(): string {
    return this._detailedDescription;
  }

  public set detailDescription(value: string) {
    this._detailedDescription = value;
  }

  public get reportingDate(): Date {
    return this._reportingDate;
  }

  public set reportingDate(value: Date) {
    this._reportingDate = value;
  }

  public get status(): 'open' | 'inwork' | 'closed' | 'rejected' {
    return this._status;
  }

  public set status(value: 'open' | 'inwork' | 'closed' | 'rejected') {
    this._status = value;
  }
}
