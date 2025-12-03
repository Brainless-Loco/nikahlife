export interface BkashConfig {
  base_url: string;
  app_key: string;
  app_secret: string;
  username: string;
  password: string;
}

export interface PaymentDetails {
  amount: number;
  callbackURL: string;
  orderID?: string;
  reference?: string;
}

export interface BkashResponse {
  statusCode: string | number;
  statusMessage: string;
  [key: string]: any;
}

// export interface BaseURL {
//   base_url: string | undefined;
//   username: string | undefined;
//   password: string | undefined;
//   app_key: string | undefined;
//   app_secret: string | undefined;
// }

export interface PaymentRequestBody {
    email: string;
    name: string;
    phone: string;
    amount: number;
}

export interface PaymentDetailss {
    amount: number;
    callbackURL: string;
    orderID: string;
    reference: string;
    name?: string;
    email?: string;
    phone?: string;
}

