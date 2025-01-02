class Payment {
  private parkingId: string;
  private amount: number;
  
  constructor(parkingId: string, amount: number) {
    this.parkingId = parkingId;
    this.amount = amount;
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
}

export default Payment;
