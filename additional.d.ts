
type KYCStatus = 'Pending' | 'Verified' | 'Failed';
type KYBStatus = 'Pending' | 'Verified' | 'Failed' | null;

export declare module "iron-session" {
    interface IronSessionData {
        user?: {
            walletAddress: string;
            admin?: boolean | null;
        };
    }
}

//     interface IronSessionData {
//         walletAddress: string;
//         signedMessage: string;

//         isAuthenticated: boolean;
//         passkey: string | null;

//         kycStatus: KYCStatus;
//         kybStatus: KYBStatus;

//         hasSavedCard: boolean;
//         hasShippingAddress: boolean;

//         nftOwned: string[];
//         hasBusinessCard: boolean;
//     }
// }