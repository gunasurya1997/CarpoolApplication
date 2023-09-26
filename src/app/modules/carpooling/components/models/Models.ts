import { v4 as uuidv4 } from 'uuid';

export class City {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
export class Booking {
  public rideId: any;
  public passengerId: number;
  public pickupLocationId: number;
  public dropLocationId: number;
  public reservedSeats: number;
  public date: string;
  public timeSlot: string;
  public fare: number;
  public id: any;

  constructor(rideId: number,data:any) {
    this.rideId = rideId;
    this.passengerId = data.userId;
    this.id = uuidv4();
    this.pickupLocationId = data.startPoint;
    this.dropLocationId = data.endPoint;
    this.reservedSeats = 0;
    this.date = data.date;
    this.timeSlot = data.timeSlot;
    this.fare = 0;
  }
}
export class Ride {
  public userId: number;
  public startPoint: number;
  public endPoint: number;
  public date: string;
  public timeSlot: string;

  constructor(data: any, userId: number) {
    this.userId = userId;
    this.startPoint = data.startPoint;
    this.endPoint = data.endPoint;
    this.date = data.date;
    this.timeSlot = data.timeslot;
  }
}

