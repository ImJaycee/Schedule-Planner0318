import nodemailer from "nodemailer";

export const sendNotificationNewShift = async (email, shiftType, date) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const Redirect = `http://localhost:5173/`;

    const mailOptions = {
      from: `"Schedule App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "New Shift Assigned",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                    <h2 style="color: #333; text-align: center;">New Shift Assigned</h2>
                    <p style="font-size: 16px; color: #555; text-align: center;">
                        Hello, <br><br>
                        A new shift has been assigned to you. Please find the details below:
                    </p>

                    <p style="font-size: 16px; color: #555; text-align: center;">
                        <strong>Shift Type:</strong> ${shiftType} <br>
                        <strong>Date:</strong> ${date}
                    </p>

                    <p style="font-size: 16px; color: #555; text-align: center;">
                        Please check your schedule for more details.
                    </p>

                    <p style="text-align: center; margin-top: 20px;">
                        <a href="${Redirect}" style="display: inline-block; font-size: 16px; color: #fff; background-color: #3498db; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Open Scheduler App
                        </a>
                    </p>
                </div>
            `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending new shift email:", error.message);
  }
};

export const sendNotificationRemovedToShift = async (
  email,
  shiftType,
  date
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const Redirect = `http://localhost:5173/`;

    const mailOptions = {
      from: `"Schedule App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Shift Removed",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                    <h2 style="color: #333; text-align: center;">Shift Removed</h2>
                    <p style="font-size: 16px; color: #555; text-align: center;">
                        Hello, <br><br>
                        Your scheduled shift has been removed. Please find the details below:
                    </p>

                    <p style="font-size: 16px; color: #555; text-align: center;">
                        <strong>Shift Type:</strong> ${shiftType} <br>
                        <strong>Date:</strong> ${date}
                    </p>

                    <p style="text-align: center; margin-top: 20px;">
                        <a href="${Redirect}" style="display: inline-block; font-size: 16px; color: #fff; background-color:#3498db; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            View Schedule
                        </a>
                    </p>
                </div>
            `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending new shift email:", error.message);
  }
};

export const sendNotificationEmailAdmin = async (
  email,
  status,
  shiftType,
  date
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const Redirect = `http://localhost:5173/`;

    const mailOptions = {
      from: `"Schedule App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Shift Request Update",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                    <h2 style="color: #333; text-align: center;">Request ${status}</h2>
                    <p style="font-size: 16px; color: #555; text-align: center;">Your request for a ${shiftType} shift on ${date} was ${status}.</p>
                    <p style="text-align: center;">
                        <a href="${Redirect}" style="display: inline-block; font-size: 16px; color: #fff; background-color: #3498db; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Open Scheduler App</a>
                    </p>
                 </div>
            `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

export const sendNotificationSwapSender = async (
  email,
  status,
  recipientName,
  requesterST,
  recipientST,
  RequestshiftDate,
  OffershiftDate
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const Redirect = `http://localhost:5173/`;

    const mailOptions = {
      from: `"Schedule App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Shift Swap Request Update",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                    <h2 style="color: #333; text-align: center;">Shift Swap Request ${status}</h2>
                    
                    <p style="font-size: 16px; color: #555; text-align: center;">
                        Hello, your shift swap request has been <strong>${status}</strong>.
                    </p>

                    <p style="font-size: 16px; color: #555; text-align: center;">
                        <strong>Swap Details:</strong><br>
                        <strong>Recipient:</strong> ${recipientName}<br>

                        ${
                          status === "approved"
                            ? `
                            <strong>Your New Shift:</strong> ${recipientST} on ${RequestshiftDate}<br>
                            <strong>New Shift for ${recipientName}:</strong> ${requesterST} on ${OffershiftDate}
                        `
                            : `
                            <strong>Your Shift:</strong> ${requesterST} on ${OffershiftDate}<br>
                            <strong>Request Shift:</strong> ${recipientST} on ${RequestshiftDate}
                        `
                        }
                    </p>


                    <p style="text-align: center;">
                        <a href="${Redirect}" style="display: inline-block; font-size: 16px; color: #fff; background-color: #3498db; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Open Scheduler App</a>
                    </p>

                    <p style="font-size: 14px; color: #777; text-align: center;">
                        If you did not make this request, please ignore this email.
                    </p>
                </div>
            `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

export const sendNotificationSwapRecipient = async (
  email,
  status,
  requesterName,
  requesterST,
  recipientST,
  RequestshiftDate,
  OffershiftDate
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const Redirect = `http://localhost:5173/`;

    const mailOptions = {
      from: `"Schedule App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Shift Swap Request Update",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                    <h2 style="color: #333; text-align: center;">Shift Swap Request ${status}</h2>
                    
                    <p style="font-size: 16px; color: #555; text-align: center;">
                        Hello, your shift swap request has been <strong>${status}</strong>.
                    </p>

                    <p style="font-size: 16px; color: #555; text-align: center;">
                        <strong>Swap Details:</strong><br>
                        <strong>Request From:</strong> ${requesterName}<br>

                        ${
                          status === "approved"
                            ? `
                            <strong>Your New Shift:</strong> ${recipientST} on ${OffershiftDate}<br>
                            <strong>New Shift for ${requesterName}:</strong> ${requesterST} on ${RequestshiftDate}
                        `
                            : `
                            <strong>Offered Shift:</strong> ${requesterST} on ${OffershiftDate}<br>
                            <strong>Your Shift:</strong> ${recipientST} on ${RequestshiftDate}
                        `
                        }
                    </p>

                    <p style="text-align: center;">
                        <a href="${Redirect}" style="display: inline-block; font-size: 16px; color: #fff; background-color: #3498db; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Open Scheduler App</a>
                    </p>

                    <p style="font-size: 14px; color: #777; text-align: center;">
                        If you did not make this request, please ignore this email.
                    </p>
                </div>
            `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};
