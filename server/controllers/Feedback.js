const mailSender = require("../utils/mailSender"); 
const feedbackTemplate = require("../mail/templates/feedback"); 

const sendFeedback = async (req, res) => {
	try {
		const { subject, feedbackType, subType, description, studentName, email} = req.body;

		// Validate required fields
		if (!subject || !feedbackType || !subType || !description || !studentName) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Generate the email body using the feedback template
		const emailBody = feedbackTemplate(subject, feedbackType, subType, description, studentName, email);

		// Send email to the admin
		const emailResponse = await mailSender(process.env.MAIL_USER, "New Student Feedback", emailBody);

		// Check if the email was sent successfully
		if (emailResponse && emailResponse.accepted) {
			return res.status(200).json({ message: "Feedback sent successfully" });
		} else {
			return res.status(500).json({ message: "Failed to send feedback" });
		}
	} catch (error) {
		console.error("Error sending feedback:", error.message);
		return res.status(500).json({ message: "An error occurred while sending feedback" });
	}
};

module.exports = { sendFeedback };
