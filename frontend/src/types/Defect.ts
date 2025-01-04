export interface Defect {
    _object: string;
    _parking: string;
    _description: string;
    _detailedDescription: string;
    _reportingDate: Date;
    _status: 'open' | 'inwork' | 'closed' | 'rejected';
    _image: string;
    _username: string;
  }