class Payment {
  private parkingId: string;
  private amount: number;
  private licensePlate: string;
  
  constructor(parkingId: string, amount: number, licensePlate: string) {
    this.parkingId = parkingId;
    this.amount = amount;
    this.licensePlate = licensePlate;
  }

  /**
   * Get the Parking ID
   * @returns Parking ID as a string
   */
  public getParkingId(): string {
    return this.parkingId;
  }

  /**
   * Set a new Parking ID
   * @param parkingId - The new Parking ID
   */
  public setParkingId(parkingId: string): void {
    this.parkingId = parkingId;
  }

  /**
   * Get the amount to be paid
   * @returns Amount as a number
   */
  public getAmount(): number {
    return this.amount;
  }

  /**
   * Set a new amount
   * @param amount - The new amount to be paid
   */
  public setAmount(amount: number): void {
    this.amount = amount;
  }

  /**
   * Get the license plate
   * @returns License plate as a string
   */
  public getLicensePlate(): string {
    return this.licensePlate;
  }
}

export default Payment;
