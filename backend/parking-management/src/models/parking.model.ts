export class Parking {
  name: string;
  address: string;
  barriers: number;
  tenant_id: string;
  capacity: number;
  floors: number;
  picture: string ;
  status: string;

  constructor(
    name: string,
    address: string,
    barriers: number,
    tenantId: string,
    capacity: number,
    floors: number,
    picture: string,
    status: string
  ) {
    this.name = name;
    this.address = address;
    this.barriers = barriers;
    this.tenant_id = tenantId;
    this.capacity = capacity;
    this.floors = floors;
    this.picture = picture;
    this.status = status;
  }
  toPlainObject() {
        return {
            name: this.name,
            address: this.address,
            barriers: this.barriers,
            tenant_id: this.tenant_id,
            capacity: this.capacity,
            floors: this.floors,
            picture: this.picture,
            status: this.status,
        };
    }
}
