import { transporter } from "../../../config/mailer";
import { Subscriber } from "./newslatterSubscriber.model";
import { thankYouTemplate } from "./thankYouTamplate";

export const subscribeUser = async (email: string) => {
  // 1. Check if already subscribed
  let subscriber = await Subscriber.findOne({ email });
  if (!subscriber) {
    subscriber = await Subscriber.create({ email });
  }

  // 2. Send thank you email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Thank You for Subscribing!",
    html: thankYouTemplate(email),
  };

  await transporter.sendMail(mailOptions);

  return subscriber;
};

export const getSubscribers = async () => {
  // Populate user name & phone
  return Subscriber.find().sort({ createdAt: -1 });
};
