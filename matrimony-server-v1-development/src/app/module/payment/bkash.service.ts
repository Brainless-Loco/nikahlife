// const axios = require('axios');
// const { v4: uuidv4 } = require('uuid');
// import Bkash from "./bkashToken.model";

// class BkashService {
//     static async createPayment(bkashConfig, paymentDetails) {
//         try {
//             const { amount, callbackURL, orderID, reference } = paymentDetails;
            
//             if (!amount) {
//                 return {
//                     statusCode: 2065,
//                     statusMessage: 'amount required'
//                 };
//             }
            
//             if (amount < 1) {
//                 return {
//                     statusCode: 2065,
//                     statusMessage: 'minimum amount 1'
//                 };
//             }

//             if (!callbackURL) {
//                 return {
//                     statusCode: 2065,
//                     statusMessage: 'callbackURL required'
//                 };
//             }

//             const response = await axios.post(
//                 `${bkashConfig.base_url}/tokenized/checkout/create`,
//                 {
//                     mode: "0011",
//                     currency: "BDT",
//                     intent: "sale",
//                     amount,
//                     callbackURL,
//                     payerReference: reference || "1",
//                     merchantInvoiceNumber: orderID || "Inv_" + uuidv4().substring(0, 6)
//                 },
//                 {
//                     headers: await this.authHeaders(bkashConfig),
//                 }
//             );

//             return response.data;
//         } catch (error) {
//             console.error("Create Bkash Payment Error:", error);
//             return {
//                 statusCode: 'ERROR',
//                 statusMessage: error.message
//             };
//         }
//     }

//     static async executePayment(bkashConfig, paymentID) {
//         try {
//             const response = await axios.post(
//                 `${bkashConfig.base_url}/tokenized/checkout/execute`,
//                 { paymentID },
//                 {
//                     headers: await this.authHeaders(bkashConfig),
//                 }
//             );

//             return response.data;
//         } catch (error) {
//             console.error("Error from bkash executePayment: ", error);
//             return {
//                 statusCode: 'ERROR',
//                 statusMessage: error.message
//             };
//         }
//     }

//     static async authHeaders(bkashConfig) {
//         return {
//             "Content-Type": "application/json",
//             "Accept": "application/json",
//             "authorization": await this.grantToken(bkashConfig),
//             "x-app-key": bkashConfig.app_key,
//         };
//     }

//     static async grantToken(bkashConfig) {
//         try {
//             const findToken = await Bkash.findOne({});

//             if (!findToken || findToken.updatedAt < new Date(Date.now() - 3600000)) { // 1 hour
//                 return await this.setToken(bkashConfig);
//             }

//             return findToken.auth_token;
//         } catch (error) {
//             console.error("Grant token error:", error);
//             return null;
//         }
//     }

//     static async setToken(bkashConfig) {
//         try {
//             const response = await axios.post(
//                 `${bkashConfig.base_url}/tokenized/checkout/token/grant`,
//                 this.tokenParameters(bkashConfig),
//                 {
//                     headers: this.tokenHeaders(bkashConfig),
//                 }
//             );

//             if (response.data?.id_token) {
//                 const findToken = await Bkash.findOne({});
//                 if (findToken) {
//                     findToken.auth_token = response.data.id_token;
//                     await findToken.save();
//                 } else {
//                     await Bkash.create({
//                         auth_token: response.data.id_token
//                     });
//                 }
//             }

//             return response.data?.id_token;
//         } catch (error) {
//             console.error("Set token error:", error);
//             return null;
//         }
//     }

//     static tokenParameters(bkashConfig) {
//         return {
//             app_key: bkashConfig.app_key,
//             app_secret: bkashConfig.app_secret,
//         };
//     }

//     static tokenHeaders(bkashConfig) {
//         return {
//             "Content-Type": "application/json",
//             "Accept": "application/json",
//             "username": bkashConfig.username,
//             "password": bkashConfig.password,
//         };
//     }
// }

// export = BkashService;



import axios, { AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Bkash from "./bkashToken.model";
import { BkashConfig, BkashResponse, PaymentDetails } from './bkash.interface';

class BkashService {
    static async createPayment(bkashConfig: BkashConfig, paymentDetails: PaymentDetails): Promise<BkashResponse> {
        try {
            const { amount, callbackURL, orderID, reference } = paymentDetails;
            
            if (!amount) {
                return {
                    statusCode: 2065,
                    statusMessage: 'amount required'
                };
            }
            
            if (amount < 1) {
                return {
                    statusCode: 2065,
                    statusMessage: 'minimum amount 1'
                };
            }

            if (!callbackURL) {
                return {
                    statusCode: 2065,
                    statusMessage: 'callbackURL required'
                };
            }

            const response: AxiosResponse = await axios.post(
                `${bkashConfig.base_url}/tokenized/checkout/create`,
                {
                    mode: "0011",
                    currency: "BDT",
                    intent: "sale",
                    amount,
                    callbackURL,
                    payerReference: reference || "1",
                    merchantInvoiceNumber: orderID || "Inv_" + uuidv4().substring(0, 6)
                },
                {
                    headers: await this.authHeaders(bkashConfig),
                }
            );

            return response.data;
        } catch (error: any) {
            console.error("Create Bkash Payment Error:", error);
            return {
                statusCode: 'ERROR',
                statusMessage: error.message
            };
        }
    }

    static async executePayment(bkashConfig: BkashConfig, paymentID: string): Promise<BkashResponse> {
        try {
            const response: AxiosResponse = await axios.post(
                `${bkashConfig.base_url}/tokenized/checkout/execute`,
                { paymentID },
                {
                    headers: await this.authHeaders(bkashConfig),
                }
            );

            return response.data;
        } catch (error: any) {
            console.error("Error from bkash executePayment: ", error);
            return {
                statusCode: 'ERROR',
                statusMessage: error.message
            };
        }
    }

    static async authHeaders(bkashConfig: BkashConfig): Promise<Record<string, string>> {
        return {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "authorization": await this.grantToken(bkashConfig) || '',
            "x-app-key": bkashConfig.app_key,
        };
    }

    static async grantToken(bkashConfig: BkashConfig): Promise<string | null> {
        try {
            const findToken = await Bkash.findOne({});

            if (!findToken || findToken.updatedAt < new Date(Date.now() - 3600000)) { // 1 hour
                return await this.setToken(bkashConfig);
            }

            return findToken.auth_token;
        } catch (error: any) {
            console.error("Grant token error:", error);
            return null;
        }
    }

    static async setToken(bkashConfig: BkashConfig): Promise<string | null> {
        try {
            const response: AxiosResponse = await axios.post(
                `${bkashConfig.base_url}/tokenized/checkout/token/grant`,
                this.tokenParameters(bkashConfig),
                {
                    headers: this.tokenHeaders(bkashConfig),
                }
            );

            if (response.data?.id_token) {
                const findToken = await Bkash.findOne({});
                if (findToken) {
                    findToken.auth_token = response.data.id_token;
                    await findToken.save();
                } else {
                    await Bkash.create({
                        auth_token: response.data.id_token
                    });
                }
            }

            return response.data?.id_token || null;
        } catch (error: any) {
            console.error("Set token error:", error);
            return null;
        }
    }

    static tokenParameters(bkashConfig: BkashConfig): { app_key: string; app_secret: string } {
        return {
            app_key: bkashConfig.app_key,
            app_secret: bkashConfig.app_secret,
        };
    }

    static tokenHeaders(bkashConfig: BkashConfig): Record<string, string> {
        return {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "username": bkashConfig.username,
            "password": bkashConfig.password,
        };
    }
}

export default BkashService;