import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { UserService } from 'src/app/services/user.service';
import { Booking, Ride } from '../models/Models';

@Component({
  selector: 'app-book-ride',
  templateUrl: './book-ride.component.html',
  styleUrls: ['./book-ride.component.css'],
})
export class BookRideComponent {
  @ViewChild('firstModal') firstModal: any;
  @ViewChild('secondModal') secondModal: any; 
  rideData: any;
  matchRides!: Array<any>;
  userId: any;
  user: any;
  selectedRide: any;
  noMatchRidesMessage: string = '';
  seatsList: any;
  selectedSeats:number = 0;
  pricePerSeat: number=0;
  selectedRideId: any;

  constructor(
    private userService: UserService,
    private authServie: AuthGuardService,
    private modalService: NgbModal
  ) {}

  // Handle submission of the book ride form
  submitBookRideForm(event: any) {
    // Get the user's ID
    this.userId = this.authServie.extractUserData();
    const ride = event.value;

    // Create a Ride object from the form data
    this.rideData = new Ride(ride, this.userId);

    // Fetch and display matched rides
    this.getAllMatchRides(this.rideData);

    // Subscribe to updates in booked rides and refresh the list when changes occur
    this.userService.bookedRidesAdded$.subscribe(() => {
      this.getAllMatchRides(this.rideData);
    });
  }

  // Get all matched rides for a given ride
  getAllMatchRides(ride: Ride) {
    this.userService.getMatchRides(ride).subscribe(
      (res) => {
        this.matchRides = res;
        if (this.matchRides.length === 0) {
          this.noMatchRidesMessage = 'No Rides to Display!!!!';
        }
      },
      (error) => {
        this.userService.openSnackBar(error);
      }
    );
  }
  openSecondModal(){
    this.selectedSeats = 0;
    this.firstModal.dismiss('Close click'); 
    this.seatsList = this.generateSeatsList(this.selectedRide.availableSeats)
    this.modalService.open(this.secondModal);
  }
  // Open the modal with ride details
  openSm(content: any, ride: any) {
    this.selectedRide = ride;
    this.selectedRideId = ride.id;
     this.pricePerSeat = this.selectedRide.fare/this.selectedRide.availableSeats;
    this.firstModal = this.modalService.open(content, { size: 'sm' });
  }
  
  // Submit the ride booking
  submitRide() {
    // Get the user's ID
    this.userId = this.authServie.extractUserData();
    if (this.selectedRide && this.selectedSeats != 0) {
      // Create a Booking object from the selected ride and user
      const booking = new Booking(this.selectedRideId, this.rideData);
      booking.reservedSeats = this.selectedSeats
      booking.fare = booking.reservedSeats * this.pricePerSeat
      // Add the booked ride and notify observers of the change
      this.userService.addBookRide(booking).subscribe(
        (res) => {
          this.userService.notifyBookedRideAdded();
          this.userService.openSnackBar('Booked Ride Successfully!!!!!!!!!');
        },
        (error) => {
          this.userService.openSnackBar(error);
        }
      );
      // Reset the selected ride and close the modal
      this.selectedRide = null;
      this.selectedSeats = 0
      this.modalService.dismissAll();
    }else{
      this.userService.openSnackBar("Please select atleast one seat")
    }
  }
  generateSeatsList(n:number):Array<number>{
    if (n <= 0) {
      throw new Error('Input must be a positive integer');
    }
    const seatList = Array.from({ length: n }, (_, index) => index + 1);
    return seatList
  }
}
