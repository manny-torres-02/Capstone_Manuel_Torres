import "dotenv/config";
import emailService from "./services/emailService.js";

async function testEmail() {
  console.log("🧪 Testing email service...");
  console.log("From email:", emailService.fromEmail);

  try {
    const result = await emailService.sendEmail({
      to: "manueljosetorres02@gmail.com", // Send to yourself first
      subject: "🎉 Test Email from Volunteer System",
      body: `
        Hello!
        
        This is a test email to verify that AWS SES integration is working correctly.
        
        If you receive this email, your system is ready to send emails to volunteers!
        
        Sent at: ${new Date().toLocaleString()}
        
        Best regards,
        Volunteer Management System
      `,
    });

    if (result.success) {
      console.log("✅ Email sent successfully!");
      console.log("📧 Message ID:", result.messageId);
      console.log("📮 Check your email inbox!");
    } else {
      console.log("❌ Email failed to send:");
      console.log("Error:", result.error);
    }
  } catch (error) {
    console.error("💥 Unexpected error:", error);
  }
}

// Run the test
testEmail();

