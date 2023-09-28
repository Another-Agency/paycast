import { mnemonicToAccount } from "viem/accounts";
import {
    FC_ACCOUNT_MNEMONIC,
    FC_APP_FID,
    SIGNED_KEY_REQUEST_TYPE,
    SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
} from "./constants";

export async function generateSignatureEIP712(publicKey: string): Promise<{ deadline: number, signature: string }> {
    try {
        const account = mnemonicToAccount(FC_ACCOUNT_MNEMONIC);
        const deadline = Math.floor(Date.now() / 1000) + 86400;

        console.log("Inside generateSignatureEIP712, calculated deadline:", deadline);

        if (!publicKey) {
            throw new Error('Invalid public key');
        }

        const signature = await account.signTypedData({
            domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
            types: {
                SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
            },
            primaryType: "SignedKeyRequest",
            message: {
                requestFid: BigInt(FC_APP_FID),
                key: publicKey,
                deadline: BigInt(deadline),
            },
        });

        console.log("Inside generateSignatureEIP712, generated signature:", signature);

        return { deadline, signature };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error generating signature: ${error.message}`);
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
}