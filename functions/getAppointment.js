import Appointment from "@/models/Appointment";

export async function getAppointment( success, error){
    try {
        const appointment = await Appointment.find({});
   
        if (appointment) {
          // Convert the Mongoose document to a plain JavaScript object
          const appointmentObject = JSON.parse(JSON.stringify(appointment));
          if (typeof(success)=='function') {
            success(appointmentObject);
         }
         else{
            console.log('Appointments got successfully');
         }
        }
      } catch (error) {
        if (typeof(err)=='function') {
            err(error);
         }
         else{
            console.log('Appointment finding failed');
         }
       
      }
}