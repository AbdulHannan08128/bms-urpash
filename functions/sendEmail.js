
import sendMail from './sendMail';

export async function sendEmail(props, success, error) {

    const sendEmailFunction = async () => {
      const emailOptions = {
        to: props.to,
        subject: props.subject, 
        text: props.text,
        html: props.html,
      };

      try {
        const suc = await sendMail(emailOptions);
        if (typeof(success)=='function') {
          success(suc);
        }else{
          console.log('Email Sent Successfully');
        }
      } catch (err) {
        if (typeof(error)=='function') {
          error(err)
        }else{
          console.log('Error Sending Email');
        }
      }
    };

    sendEmailFunction();
};


