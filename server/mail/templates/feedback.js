const feedbackTemplate = (subject, feedbackType, subType, description, studentName , email) => {

    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Feedback Notification</title>
        <style>
            body {
                background-color: #f4f4f4;
                font-family: Arial, sans-serif;
                color: #333333;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
            }
            .header {
                background-color: #e0e0e0;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
                color: #333333;
            }
            .header img {
                max-width: 120px;
                margin-bottom: 10px;
            }
            .header h2 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 20px;
                font-size: 16px;
                line-height: 1.6;
                color: #333333;
            }
            .content .label {
                font-weight: bold;
                color: #555555;
            }
            .content .value {
                margin-bottom: 10px;
                font-size: 16px;
                color: #333333;
            }
            .table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            .table th, .table td {
                padding: 10px;
                border: 1px solid #dddddd;
                text-align: left;
                font-size: 16px;
            }
            .footer {
                text-align: center;
                font-size: 14px;
                color: #777777;
                padding: 20px;
                border-top: 1px solid #eaeaea;
            }
            .footer a {
                color: #0073e6;
                text-decoration: none;
            }
            .btn {
                display: inline-block;
                padding: 10px 20px;
                margin: 20px 0;
                background-color: #0073e6;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                text-align: center;
            }
            @media (max-width: 600px) {
                .container {
                    padding: 15px;
                }
                .header, .content, .footer {
                    padding: 15px;
                }
                .table th, .table td {
                    font-size: 14px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://lnmiit.ac.in/wp-content/uploads/2023/07/cropped-LNMIIT-Logo-Transperant-Background-e1699342125845.png" alt="LNMIIT Logo">
                <h2>New Feedback Submission</h2>
            </div>
            <div class="content">
                <p>Dear Faculty/Staff,</p>
                <p>A new feedback has been submitted in the LNMIIT SRMS by <strong>${studentName}</strong>. Details are as follows:</p>
                <table class="table">
                    <tr>
                        <th>Student Name</th>
                        <td>${studentName} (${email})</td>
                    </tr>
                    <tr>
                        <th>Subject</th>
                        <td>${subject}</td>
                    </tr>
                    <tr>
                        <th>Feedback Type</th>
                        <td>${feedbackType}</td>
                    </tr>
                    <tr>
                        <th>Sub-Type</th>
                        <td>${subType}</td>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <td>${description}</td>
                    </tr>
                </table>
            </div>
        </div>
    </body>
    </html>`;
};

module.exports = feedbackTemplate;
