export interface Parking {
    _name: string;
    _address: string;
    _barriers: number;
    _tenant_id: string;
    _capacity: number;
    _floors: number;
    _picture: string ;
    _status: 'open' | 'closed';
  }