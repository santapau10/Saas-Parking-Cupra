import { v4 as uuidv4 } from 'uuid'; 

export class Defect {
  private _parking: string; 
  private _description: string;
  private _detailedDescription: string;
  private _reportingDate: Date;
  private _status: 'open' | 'inwork' | 'closed' | 'rejected';
  private _image : string;
  private _username: string;

  constructor(
    parking: string, 
    description: string, 
    detailedDescription: string, 
    reportingDate: Date,
    status: 'open' | 'inwork' | 'closed' | 'rejected' = 'open',
    image: string,
    username: string
  ) {
    this._parking = parking;
    this._description = description;
    this._detailedDescription = detailedDescription;
    this._reportingDate = reportingDate;
    this._status = status;
    this._image=image; 
    this._username=username;
  }

  public get parking(): string {
    return this._parking;
  }
  public set parking(value: string) {
    this._parking = value;
  }

  public get description(): string {
    return this._description;
  }
  public set description(value: string) {
    this._description = value;
  }

  public get detailedDescription(): string {
    return this._detailedDescription;
  }
  public set detailedDescription(value: string) {
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

  public get image(): string {
    return this._image;
  }
  public set image(value: string) {
    this._image = value;
  }

  public get username(): string {
    return this._username;
  }
  public set username(value: string) {
    this._username = value;
  }
}
