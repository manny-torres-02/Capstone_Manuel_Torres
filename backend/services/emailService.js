import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// START SES
//Credentials loaded from AWS File
//This is the region currently used by default
const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
});

class EmailService {
  constructor() {
    //Verified Email/REgistered Email.
    this.fromEmail =
      process.env.SES_FROM_EMAIL || "manueljosetorres02@gmail.com";
  }

  async sendEmail({ to, subject, body, isHtml = false }) {
    const params = {
      Source: this.fromEmail,
      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: isHtml
          ? {
              Html: {
                Data: body,
                Charset: "UTF-8",
              },
            }
          : {
              Text: {
                Data: body,
                Charset: "UTF-8",
              },
            },
      },
    };

    try {
      const command = new SendEmailCommand(params);
      const result = await sesClient.send(command);
      console.log("Email sent successfully:", result.MessageId);
      return { success: true, messageId: result.MessageId };
    } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, error: error.message };
    }
  }

  async sendBulkEmail({ recipients, subject, body, isHtml = false }) {
    const results = [];

    for (const recipient of recipients) {
      const result = await this.sendEmail({
        to: recipient,
        subject,
        body,
        isHtml,
      });
      results.push({ recipient, ...result });

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return results;
  }
}

export default new EmailService();
