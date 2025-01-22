export class EntryOrExit {
    license_plate: string;
    parking_id: string;
    timestamp: string;
    type: string;

  constructor(//
    license_plate: string,
    parking_id: string,
    timestamp: string,
    type: string
  ) {
    this.license_plate = license_plate;
    this.parking_id = parking_id;
    this.timestamp = timestamp;
    this.type = type;
  }
  
}
