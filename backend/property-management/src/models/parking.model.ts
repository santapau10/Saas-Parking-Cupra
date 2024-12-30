export class Parking {
  name: string;
  location: string;
  barriers: number;
  tenant_id: string;
  capacity: number;
  floors: number;
  picture: string ;
  status: string;

  constructor(
    name: string,
    location: string,
    barriers: number,
    tenantId: string,
    capacity: number,
    floors: number,
    picture: string,
    status: string
  ) {
    this.name = name;
    this.location = location;
    this.barriers = barriers;
    this.tenant_id = tenantId;
    this.capacity = capacity;
    this.floors = floors;
    this.picture = picture;
    this.status = status;
  }
}
