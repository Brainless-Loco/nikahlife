export interface MailData {
  recipients: "all" | "single";
  email: string;
  subject: string;
  message: string;
}

export interface Notification {
  type: "success" | "error";
  message: string;
}

export interface ApiResponse {
  message?: string;
  success?: boolean;
}

export interface DraftData extends MailData {
  timestamp: string;
}
