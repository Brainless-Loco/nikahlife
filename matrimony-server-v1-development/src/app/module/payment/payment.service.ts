import Payment from "./payment.model";
import Subscription from "../subscription/subscription.model";
import User from "../user/user.model";
import { IPayment } from "./payment.interface";
import { transporter } from "../../../config/mailer";

const createPayment = async (data: IPayment, userId: string) => {
  const payment = new Payment({
    ...data,
    userId,
  });
  return await payment.save();
};



const approvePayment = async (paymentId: string) => {
  const payment = await Payment.findById(paymentId).populate("userId", "username email")
  if (!payment) throw new Error("Payment not found")

  payment.approvalStatus = "approved"
  await payment.save()

  const durationInMonths = payment.durationInMonths || 1

  // Subscription
  const profileViewLimit = payment.subscriptionType === "vip" ? 10000 : 100
  const startDate = new Date()
  const endDate = new Date(new Date().setMonth(startDate.getMonth() + durationInMonths))

  const subscription = await Subscription.create({
    userId: payment.userId,
    subscriptionType: payment.subscriptionType,
    durationInMonths,
    startDate,
    endDate,
    status: "active",
    profileViewLimit,
  })

  // Update user
  const userUpdate: any = {
    subscriptionType: payment.subscriptionType,
    subscriptionId: subscription._id,
  }
  await User.findByIdAndUpdate(payment.userId, userUpdate)

  // Send Email
  if (payment.userId && (payment.userId as any).email) {
    const email = (payment.userId as any).email
    const username = (payment.userId as any).username

    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription Approved</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                
                <!-- Header Section -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                      🎉 Congratulations!
                    </h1>
                    <p style="margin: 10px 0 0 0; color: #f0f0f0; font-size: 16px; font-weight: 400;">
                      Your subscription is now active
                    </p>
                  </td>
                </tr>

                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      Hello <strong style="color: #667eea;">${username || "Valued Member"}</strong>,
                    </p>
                    <p style="margin: 0 0 30px 0; color: #555555; font-size: 15px; line-height: 1.6;">
                      Great news! Your <strong style="color: #764ba2; text-transform: uppercase;">${payment.subscriptionType}</strong> subscription package has been successfully activated. You now have access to all premium features.
                    </p>

                    <!-- Subscription Details Card -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9ff; border-radius: 12px; overflow: hidden; margin-bottom: 30px;">
                      <tr>
                        <td style="padding: 25px;">
                          <h3 style="margin: 0 0 20px 0; color: #333333; font-size: 18px; font-weight: 600;">
                            📋 Subscription Details
                          </h3>
                          
                          <table role="presentation" style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 10px 0; color: #666666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">
                                <strong>Package Type:</strong>
                              </td>
                              <td style="padding: 10px 0; color: #333333; font-size: 14px; text-align: right; border-bottom: 1px solid #e0e0e0;">
                                <span style="background-color: #667eea; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-weight: 600; text-transform: uppercase; font-size: 12px;">
                                  ${payment.subscriptionType}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 0; color: #666666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">
                                <strong>Start Date:</strong>
                              </td>
                              <td style="padding: 10px 0; color: #333333; font-size: 14px; text-align: right; border-bottom: 1px solid #e0e0e0;">
                                ${startDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 0; color: #666666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">
                                <strong>Expiry Date:</strong>
                              </td>
                              <td style="padding: 10px 0; color: #333333; font-size: 14px; text-align: right; border-bottom: 1px solid #e0e0e0;">
                                ${endDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 0; color: #666666; font-size: 14px;">
                                <strong>Duration:</strong>
                              </td>
                              <td style="padding: 10px 0; color: #333333; font-size: 14px; text-align: right;">
                                ${durationInMonths} ${durationInMonths === 1 ? "Month" : "Months"}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 0; color: #666666; font-size: 14px; border-top: 1px solid #e0e0e0;">
                                <strong>Profile View Limit:</strong>
                              </td>
                              <td style="padding: 10px 0; color: #333333; font-size: 14px; text-align: right; border-top: 1px solid #e0e0e0;">
                                <span style="background-color: #10b981; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 12px;">
                                  ${profileViewLimit} Views
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Benefits Section -->
                    <div style="background-color: #fff8f0; border-left: 4px solid #ff9800; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                      <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6;">
                        <strong style="color: #ff9800;">✨ What's Next?</strong><br/>
                        Start exploring all the premium features available to you. Make the most of your subscription and enjoy an enhanced experience!
                      </p>
                    </div>

                    <!-- CTA Button -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                      <tr>
                        <td align="center">
                          <a href="${process.env.APP_URL || "https://nikahlife.com"}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                            Get Started Now →
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0; color: #888888; font-size: 13px; line-height: 1.6; text-align: center;">
                      If you have any questions, feel free to reach out to our support team.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0 0 10px 0; color: #333333; font-size: 16px; font-weight: 600;">
                      💚 Thank you for choosing Nikah Life
                    </p>
                    <p style="margin: 0 0 15px 0; color: #666666; font-size: 13px; line-height: 1.6;">
                      Wishing you a wonderful experience ahead!
                    </p>
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                      <p style="margin: 0; color: #999999; font-size: 12px;">
                        © ${new Date().getFullYear()} Nikah Life. All rights reserved.
                      </p>
                    </div>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `

    await transporter.sendMail({
      from: `"Nikah Life" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "🎉 Your Subscription is Approved!",
      html: htmlTemplate,
    })
  }

  return subscription
}



const getAllPayments = async () => {
  return await Payment.find().populate("userId", "username email role");
};

export const PaymentServices = {
  createPayment,
  approvePayment,
  getAllPayments,
};
