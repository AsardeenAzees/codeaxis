const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: options.email,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    if (options.attachments) {
      mailOptions.attachments = options.attachments;
    }

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to CodeAxis - Account Created Successfully';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Welcome to CodeAxis!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Your account has been created successfully</p>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.firstName} ${user.lastName},</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Welcome to CodeAxis! Your account has been created successfully by the main administrator.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
          <h3 style="color: #333; margin: 0 0 15px 0;">Account Details:</h3>
          <p style="margin: 5px 0; color: #666;"><strong>Email:</strong> ${user.email}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Role:</strong> ${user.role === 'main_admin' ? 'Main Administrator' : 'Administrator'}</p>
        </div>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          <strong>Important:</strong> Since this is your first login, you will be required to:
        </p>
        
        <ul style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          <li>Reset your password</li>
          <li>Upload a profile image</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
            Login to Your Account
          </a>
        </div>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          If you have any questions or need assistance, please contact the main administrator.
        </p>
        
        <p style="color: #666; line-height: 1.6;">
          Best regards,<br>
          <strong>The CodeAxis Team</strong>
        </p>
      </div>
      
      <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} CodeAxis. All rights reserved.</p>
        <p style="margin: 5px 0 0 0;">This is an automated email, please do not reply.</p>
      </div>
    </div>
  `;

  return await sendEmail({
    email: user.email,
    subject,
    html
  });
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  const subject = 'Password Reset Request - CodeAxis';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">CodeAxis Account Security</p>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.firstName} ${user.lastName},</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          We received a request to reset your password for your CodeAxis account.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545; margin: 20px 0;">
          <h3 style="color: #333; margin: 0 0 15px 0;">Reset Your Password:</h3>
          <p style="margin: 5px 0; color: #666;">Click the button below to reset your password:</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}" 
               style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="margin: 5px 0; color: #666; font-size: 14px;">
            <strong>Reset Token:</strong> ${resetToken}
          </p>
        </div>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          <strong>Important:</strong> This link will expire in 1 hour for security reasons.
        </p>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
        </p>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; color: #856404; font-size: 14px;">
            <strong>Security Tip:</strong> Never share your password or this reset link with anyone.
          </p>
        </div>
        
        <p style="color: #666; line-height: 1.6;">
          Best regards,<br>
          <strong>The CodeAxis Team</strong>
        </p>
      </div>
      
      <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} CodeAxis. All rights reserved.</p>
        <p style="margin: 5px 0 0 0;">This is an automated email, please do not reply.</p>
      </div>
    </div>
  `;

  return await sendEmail({
    email: user.email,
    subject,
    html
  });
};

// Send new lead notification email
const sendNewLeadNotification = async (lead, adminEmails) => {
  const subject = 'New Project Request - CodeAxis';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">New Project Request</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">CodeAxis Lead Management</p>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333; margin-bottom: 20px;">New Lead Received!</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          A new project request has been submitted through the CodeAxis website.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
          <h3 style="color: #333; margin: 0 0 15px 0;">Lead Details:</h3>
          <p style="margin: 5px 0; color: #666;"><strong>Name:</strong> ${lead.name}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Email:</strong> ${lead.email}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Phone:</strong> ${lead.phone}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Organization:</strong> ${lead.organization || 'Not specified'}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Project Type:</strong> ${lead.projectType}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Budget Range:</strong> ${lead.budgetRangeDisplay}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Timeline:</strong> ${lead.timelineDisplay}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Urgency:</strong> ${lead.urgencyDisplay}</p>
        </div>
        
        <div style="background: #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #333; margin: 0 0 15px 0;">Project Brief:</h4>
          <p style="color: #666; line-height: 1.6; margin: 0;">${lead.projectBrief}</p>
        </div>
        
        ${lead.techStack && lead.techStack.length > 0 ? `
          <div style="background: #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #333; margin: 0 0 15px 0;">Preferred Tech Stack:</h4>
            <p style="color: #666; line-height: 1.6; margin: 0;">${lead.techStack.join(', ')}</p>
          </div>
        ` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/leads/${lead._id}" 
             style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
            View Lead Details
          </a>
        </div>
        
        <p style="color: #666; line-height: 1.6;">
          Please review this lead and take appropriate action. You can assign it to a team member or contact the client directly.
        </p>
        
        <p style="color: #666; line-height: 1.6;">
          Best regards,<br>
          <strong>The CodeAxis System</strong>
        </p>
      </div>
      
      <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} CodeAxis. All rights reserved.</p>
        <p style="margin: 5px 0 0 0;">This is an automated email, please do not reply.</p>
      </div>
    </div>
  `;

  // Send to all admin emails
  const emailPromises = adminEmails.map(email => 
    sendEmail({
      email,
      subject,
      html
    })
  );

  return await Promise.all(emailPromises);
};

// Send payment confirmation email
const sendPaymentConfirmationEmail = async (payment, client, project) => {
  const subject = `Payment Confirmation - ${payment.invoiceNumber} - CodeAxis`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Payment Confirmed</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">CodeAxis Payment Management</p>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333; margin-bottom: 20px;">Hello ${client.contactPerson},</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          We have received and confirmed your payment for the project "${project.title}".
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #17a2b8; margin: 20px 0;">
          <h3 style="color: #333; margin: 0 0 15px 0;">Payment Details:</h3>
          <p style="margin: 5px 0; color: #666;"><strong>Invoice Number:</strong> ${payment.invoiceNumber}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Amount:</strong> ${payment.currency} ${payment.amount.toLocaleString()}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Payment Type:</strong> ${payment.typeDisplay}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Payment Method:</strong> ${payment.methodDisplay}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Date:</strong> ${new Date(payment.paidDate).toLocaleDateString()}</p>
          ${payment.reference ? `<p style="margin: 5px 0; color: #666;"><strong>Reference:</strong> ${payment.reference}</p>` : ''}
        </div>
        
        <div style="background: #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #333; margin: 0 0 15px 0;">Project Information:</h4>
          <p style="margin: 5px 0; color: #666;"><strong>Project:</strong> ${project.title}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> ${project.statusDisplay}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Progress:</strong> ${project.progress}%</p>
        </div>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Thank you for your payment. We will continue to work on your project and keep you updated on the progress.
        </p>
        
        <p style="color: #666; line-height: 1.6;">
          If you have any questions about this payment or your project, please don't hesitate to contact us.
        </p>
        
        <p style="color: #666; line-height: 1.6;">
          Best regards,<br>
          <strong>The CodeAxis Team</strong>
        </p>
      </div>
      
      <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} CodeAxis. All rights reserved.</p>
        <p style="margin: 5px 0 0 0;">This is an automated email, please do not reply.</p>
      </div>
    </div>
  `;

  return await sendEmail({
    email: client.email,
    subject,
    html
  });
};

// Send weekly summary email to main admin
const sendWeeklySummaryEmail = async (admin, summaryData) => {
  const subject = 'Weekly Summary Report - CodeAxis';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #6f42c1 0%, #5a2d91 100%); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Weekly Summary Report</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">CodeAxis System Overview</p>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333; margin-bottom: 20px;">Hello ${admin.firstName} ${admin.lastName},</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Here's your weekly summary report for CodeAxis:
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #6f42c1; margin: 20px 0;">
          <h3 style="color: #333; margin: 0 0 15px 0;">Projects Overview:</h3>
          <p style="margin: 5px 0; color: #666;"><strong>Total Projects:</strong> ${summaryData.totalProjects}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Active Projects:</strong> ${summaryData.activeProjects}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Completed This Week:</strong> ${summaryData.completedThisWeek}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Overdue Projects:</strong> ${summaryData.overdueProjects}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
          <h3 style="color: #333; margin: 0 0 15px 0;">Financial Overview:</h3>
          <p style="margin: 5px 0; color: #666;"><strong>Total Revenue:</strong> LKR ${summaryData.totalRevenue.toLocaleString()}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Pending Payments:</strong> LKR ${summaryData.pendingPayments.toLocaleString()}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Payments This Week:</strong> LKR ${summaryData.paymentsThisWeek.toLocaleString()}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
          <h3 style="color: #333; margin: 0 0 15px 0;">Leads & Clients:</h3>
          <p style="margin: 5px 0; color: #666;"><strong>New Leads:</strong> ${summaryData.newLeads}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Total Clients:</strong> ${summaryData.totalClients}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Leads Converted:</strong> ${summaryData.leadsConverted}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/dashboard" 
             style="background: linear-gradient(135deg, #6f42c1 0%, #5a2d91 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
            View Full Dashboard
          </a>
        </div>
        
        <p style="color: #666; line-height: 1.6;">
          Best regards,<br>
          <strong>The CodeAxis System</strong>
        </p>
      </div>
      
      <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} CodeAxis. All rights reserved.</p>
        <p style="margin: 5px 0 0 0;">This is an automated email, please do not reply.</p>
      </div>
    </div>
  `;

  return await sendEmail({
    email: admin.email,
    subject,
    html
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendNewLeadNotification,
  sendPaymentConfirmationEmail,
  sendWeeklySummaryEmail
};
