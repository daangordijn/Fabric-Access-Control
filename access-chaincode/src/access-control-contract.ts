/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';

import { CertificateHash } from './access-control';
import { CertificateManager } from './utils/certificate-manager';
import { CryptoManager } from './utils/crypto-manager';
import { AccessPolicy, PolicyManager } from './utils/policy-manager';

@Info({ title: 'AccessControlContract', description: 'Smart Contract for Access Control' })
export class AccessControlContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async ValidateCertificate(ctx: Context, policy: string): Promise<boolean> {
        const x509ClientManager = CertificateManager.fromStub(ctx.stub);

        // Step 1. Determine the access policy
        const parsedPolicy: AccessPolicy = JSON.parse(policy) as AccessPolicy;

        if (!PolicyManager.isValid(parsedPolicy)) {
            throw new Error(`[Invalid Request] The policy could not be parsed; invalid policy syntax`);
        }

        // Step 2. Check if client identity satisfies policy
        if (PolicyManager.isAuthorized(parsedPolicy, x509ClientManager)) {
            return true;
        }

        // Step 3. Check if parent identity satisfies policy
        const x509ParentHash = x509ClientManager.getAttributeValue('hfa.ParentHash');
        const x509ParentSignature = x509ClientManager.getAttributeValue('hfa.ParentSignature');

        if (x509ParentHash) {
            // Check for signature
            if (!x509ParentSignature) {
                throw new Error(`[Access Denied] No signature has been provided; please set 'hfa.ParentSignature'`)
            }

            // Retrieve ledger entry
            const data: Uint8Array = await ctx.stub.getState(x509ParentHash);

            if (!data || data.length <= 0) {
                throw new Error(`[Access Denied] The parent certificate cannot be retrieved from the ledger`)
            }

            const ledgerEntry: CertificateHash = JSON.parse(data.toString()) as CertificateHash;

            // Verify the signature
            const cryptoManager = CryptoManager.fromString(ledgerEntry.x509, null);

            if (!cryptoManager.verifySignature(x509ParentHash, x509ParentSignature)) {
                throw new Error(`[Access Denied] The parent signature does not correspond with the parent hash`)
            }

            // Check parent identity
            const idBytes = new TextEncoder().encode(ledgerEntry.x509);
            const mspId = ledgerEntry.mspId;

            const x509ParentManager = CertificateManager.fromBytes(idBytes, mspId);

            if (PolicyManager.isAuthorized(parsedPolicy, x509ParentManager)) {
                return true;
            }
        }

        throw new Error(`[Access Denied] The provided certificate is insufficient to satisfy this access policy`);
    };

    @Transaction()
    @Returns('Partial<CertificateHash>')
    public async RegisterCertificate(ctx: Context): Promise<Partial<CertificateHash>> {
        // Get the x509 and hash
        const x509Manager = CertificateManager.fromStub(ctx.stub);
        const hash = x509Manager.getCertificateHash();
        const x509 = x509Manager.getIDBytes();
        const mspId = x509Manager.getMSPID();

        // Create a ledger entry
        const ledgerEntry: CertificateHash = new CertificateHash();
        ledgerEntry.hash = hash;
        ledgerEntry.x509 = new TextDecoder().decode(x509);
        ledgerEntry.mspId = mspId;

        // Submit ledger entry
        const buffer: Buffer = Buffer.from(JSON.stringify(ledgerEntry));

        await ctx.stub.putState(hash, buffer);

        return { hash };
    }

}
