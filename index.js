const nodemailer = require("nodemailer");
const program = require("commander");

program
  .option("--email <email>", "Sender's email address")
  .option("--password <password>", "Sender's email password or App Password")
  .option("--message <message>", "Email message")
  .option("--subject <subject> (optional, default: 'Dzień dobry')")
  .option("--receiver_email_core <receiver_email_core>", "Receiver's core email address, for example Master{generate}@wp.pl")
  .option("--min_value <min_value>", "Mininmum value to generate receiver email")
  .option("--max_value <max_value>", "Maximum value to generate receiver email")
  .parse(process.argv);

const { client_email, client_password, message, subject, receiver_email_core, min_value, max_value } = program;

if (!client_email || !client_password || !message || !receiver_email_core) {
  console.error("Usage: node app.js --email <your-email> --password <your-password> --message <your-message> --subject <subject> --receiver_email_core <receiver_email_core> [--min_value <min_value>] [--max_value <max_value>]");
  process.exit(1);
}   

if(!subject){
    subject = "Dzień dobry";
}

if(!min_value){
    min_value = 0;
}

if(!max_value){
    max_value = 600;
}


function generateMailOptions(email_client, email_core, subject, current_number, message){
    const regex = /{generate}/i;
    email_core = email_core.replace(regex, current_number);
    return {
        from: email_client,                   
        to: email_core,    
        subject: subject,   
        text: message,                
    };
}

function sendMail(email, password, mailOptions, number, max_number){
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: email,
          pass: password,
        },
      });
      
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error: " + error);
        } else {
          console.log(`(${number}) Email sent: ` + info.response);
          const percent = Math.floor(number / max_number);
          console.log(`****** ${number} / ${max_number} (${percent}%) completed ******`)
        }
      });
}

function MainActivity(min, max, subject, message, email, password, email_core){
    for(let i=min; i<=max; i++){
        sendMail(email, password, generateMailOptions(email, email_core, subject, i, message), i, max)
    }
}

MainActivity(min_value, max_value, subject, message, client_email, client_password, receiver_email_core);