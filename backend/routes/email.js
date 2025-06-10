import express from "express";
import emailService from "../services/emailService.js";
import initKnex from "knex";
import knexConfig from "../knexfile.js";
import configuration from "../knexfile.js";

const router = express.Router();
const knex = initKnex(configuration);

// route to send emails
router.post("/send", async (req, res) => {
  try {
    const { subject, message, recipientIds, recipientEmails } = req.body;

    // Check if there is no subject or message
    if (!subject || !message) {
      return res
        .status(400)
        .json({ error: "Subject and message are required" });
    }

    let emails = [];

    //check if emails exist
    if (recipientIds && recipientIds.length > 0) {
      const volunteers = await knex("volunteers")
        .whereIn("id", recipientIds)
        .select("email", "name");

      emails = emails.concat(volunteers.map((v) => v.email).filter(Boolean));
    }
    //If there are emails, then add them in
    if (recipientEmails && recipientEmails.length > 0) {
      emails = emails.concat(recipientEmails);
    }

    emails = [...new Set(emails)];

    if (emails.length === 0) {
      return res.status(400).json({ error: "No valid email addresses found" });
    }

    console.log(`Sending email to ${emails.length} recipients`);

    const results = await emailService.sendBulkEmail({
      recipients: emails,
      subject,
      body: message,
      isHtml: false,
    });

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    res.json({
      message: `Email sent to ${successful} recipients. ${failed} failed.`,
      successful,
      failed,
      results,
    });
  } catch (error) {
    console.error("Error in email route:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

router.get("/volunteers", async (req, res) => {
  try {
    const volunteers = await knex("volunteers")
      .select("id", "name", "email", "phoneNumber")
      .where("email", "!=", "")
      .whereNotNull("email");

    res.json(volunteers);
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    res.status(500).json({ error: "Failed to fetch volunteers" });
  }
});

export default router;
