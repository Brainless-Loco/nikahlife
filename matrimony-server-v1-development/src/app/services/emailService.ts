
import { transporter } from "../../config/mailer";


export const sendOtpEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: "Complete Your Nikah Registration - OTP Verification",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nikah OTP Verification</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            margin-top: 30px;
            margin-bottom: 30px;
        }
        
        .header {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 50%, #d63384 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="80" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>');
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #ffffff;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            position: relative;
            z-index: 1;
        }
        
        .logo::before {
            content: '💕';
            margin-right: 10px;
        }
        
        .header-subtitle {
            color: rgba(255,255,255,0.9);
            font-size: 16px;
            position: relative;
            z-index: 1;
        }
        
        .content {
            padding: 50px 30px;
            text-align: center;
        }
        
        .welcome-text {
            font-size: 28px;
            color: #333;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .subtitle {
            font-size: 16px;
            color: #666;
            margin-bottom: 35px;
            line-height: 1.6;
        }
        
        .otp-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }
        
        .otp-label {
            color: #ffffff;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #ffffff;
            letter-spacing: 8px;
            margin-bottom: 15px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        
        .otp-validity {
            color: rgba(255,255,255,0.9);
            font-size: 14px;
        }
        
        .instructions {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            border-left: 4px solid #ff6b6b;
        }
        
        .instructions h3 {
            color: #333;
            font-size: 16px;
            margin-bottom: 10px;
        }
        
        .instructions p {
            color: #666;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .security-note {
            background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            border: 1px solid #fdcb6e;
        }
        
        .security-note p {
            color: #2d3436;
            font-size: 14px;
            margin: 0;
        }
        
        .footer {
            background: #2c3e50;
            padding: 30px;
            text-align: center;
            color: #ecf0f1;
        }
        
        .footer-logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .footer-text {
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #ff6b6b, transparent);
            margin: 30px 0;
        }
        
        /* Mobile Responsive */
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 12px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .logo {
                font-size: 28px;
            }
            
            .content {
                padding: 40px 20px;
            }
            
            .welcome-text {
                font-size: 24px;
            }
            
            .otp-container {
                padding: 25px 15px;
            }
            
            .otp-code {
                font-size: 30px;
                letter-spacing: 6px;
            }
            
            .footer {
                padding: 25px 20px;
            }
        }
        
        @media only screen and (max-width: 480px) {
            .otp-code {
                font-size: 26px;
                letter-spacing: 4px;
            }
            
            .welcome-text {
                font-size: 22px;
            }
            
            .logo {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">Nikah</div>
            <div class="header-subtitle">Your Journey to Forever Begins Here</div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <h1 class="welcome-text">Welcome to Nikah! 🌟</h1>
            <p class="subtitle">
                Thank you for choosing Nikah to find your perfect life partner. 
                To complete your registration, please use the verification code below.
            </p>
            
            <div class="otp-container">
                <div class="otp-label">Your Verification Code</div>
                <div class="otp-code">${otp}</div>
                <div class="otp-validity">Valid for 5 minutes</div>
            </div>
            
            <div class="instructions">
                <h3>🔐 How to use this code:</h3>
                <p>
                    Enter this 6-digit code on the verification page to activate your account 
                    and start your journey to find your soulmate.
                </p>
            </div>
            
            <div class="security-note">
                <p>
                    <strong>🛡️ Security Note:</strong> This code is confidential and should not be shared with anyone. 
                    If you didn't request this verification, please ignore this email.
                </p>
            </div>
            
            <div class="divider"></div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Need help? Contact our support team at 
                <a href="mailto:support@nikah.com" style="color: #ff6b6b; text-decoration: none;">support@nikah.com</a>
            </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-logo">💕 Nikah</div>
            <div class="footer-text">
                Connecting hearts, creating families.<br>
                Your trusted platform for meaningful relationships.
            </div>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #34495e;">
                <p style="font-size: 12px; color: #95a5a6;">
                    &copy; ${new Date().getFullYear()} Nikah. All rights reserved.<br>
                    This email was sent to you as part of your registration process.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log("OTP sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};