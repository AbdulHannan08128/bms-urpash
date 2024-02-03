import Appointment from "@/models/Appointment";

export async function addAppointment(data,success, err){
    try {
        const newAppointment = new Appointment(data);
        await newAppointment.save();
         if (typeof(success)=='function') {
            success();
         }
         else{
            console.log('Appointment booked successfully');
         }
        
      } catch (error) {
        if (typeof(err)=='function') {
            err(error);
         }
         else{
            console.log('Appointment booking failed');
         }
      }
}