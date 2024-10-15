export interface Defect {
    object: string;
    location: string;
    description: string;
    detailedDescription: string;
    reportingDate: Date;
    status: 'open' | 'inwork' | 'closed' | 'rejected';
  }