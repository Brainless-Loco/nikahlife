export type OTPArray = [string, string, string, string, string, string];

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
}