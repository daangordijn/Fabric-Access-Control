/*
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'fs';
import * as crypto from 'crypto';

const ALGORITHM = 'sha512';
const SIGNATURE_FORMAT = 'base64';

class CryptoManager {
    private publicKey: string | Buffer;
    private privateKey: string | Buffer;

    constructor(publicKey: string | Buffer, privateKey: string | Buffer) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }

    /**
     * Public Methods
     */
    public getPublicKey(): string | Buffer {
        if (!this.publicKey) {
            throw new Error('[Server Error] No public key has been initialized');
        }
        return this.publicKey;
    }

    public getPrivateKey(): string | Buffer {
        if (!this.privateKey) {
            throw new Error('[Server Error] No private key has been initialized');
        }
        return this.privateKey;
    }

    public getSignature(data: string | Buffer): string {
        const privateKey = this.getPrivateKey();

        const sign = crypto.createSign(ALGORITHM);
        sign.update(data);

        return sign.sign(privateKey, SIGNATURE_FORMAT);
    }

    public verifySignature(data: string | Buffer, signature: string): boolean {
        const publicKey = this.getPublicKey();

        const verify = crypto.createVerify(ALGORITHM);
        verify.update(data);

        return verify.verify(publicKey, signature, SIGNATURE_FORMAT);
    }

    public static fromFile(file: string): CryptoManager {
        const identity = JSON.parse(fs.readFileSync(file).toString());

        const publicKey = crypto.createPublicKey(identity.credentials.certificate).export({ type: 'spki', format: 'pem' });

        const privateKey = identity.credentials.privateKey;

        return new CryptoManager(publicKey, privateKey);
    }

    public static fromString(certificate: string, privateKey: string): CryptoManager {
        const publicKey = crypto.createPublicKey(certificate).export({ type: 'spki', format: 'pem' });

        return new CryptoManager(publicKey, privateKey);
    }
}

export { CryptoManager };
