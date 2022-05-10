/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';

import { IPFSStorage } from './ipfs-storage';
import { AccessPolicy, PolicyManager } from './utils/policy-manager';

@Info({ title: 'IPFSStorageContract', description: 'Smart Contract for IPFS Block Storage' })
export class IPFSStorageContract extends Contract {

    private async FileExists(ctx: Context, id: string): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(id);
        return (!!data && data.length > 0);
    }

    @Transaction(false)
    @Returns('Partial<IPFSStorage[]>')
    public async ListFiles(ctx: Context): Promise<Partial<IPFSStorage[]>> {
        const results: IPFSStorage[] = [];

        const iterator = await ctx.stub.getStateByRange('', '');

        let result = await iterator.next();

        while (!result.done) {
            // Retrieve ledger entry
            const value = Buffer.from(result.value.value.toString()).toString('utf-8');
            const record = JSON.parse(value) as IPFSStorage;

            // Perform access control
            const authorized = (await ctx.stub.invokeChaincode('access-control', ['ValidateCertificate', record.policies.read], 'mychannel')).payload.toString();

            if (authorized === "true") {
                delete record.policies;
                results.push(record);
            }

            result = await iterator.next();
        }

        return results;
    }

    @Transaction()
    @Returns('Partial<IPFSStorage>')
    public async CreateFile(ctx: Context, id: string, cid: string): Promise<Partial<IPFSStorage>> {
        // Does the file exist?
        const exists: boolean = await this.FileExists(ctx, id);
        if (exists) {
            throw new Error(`[Server Error] Cannot create more than one entry with the same ID`);

        }

        // Create a ledger entry
        const ledgerEntry: IPFSStorage = new IPFSStorage();
        ledgerEntry.id = id;
        ledgerEntry.cid = cid;
        ledgerEntry.name = id;
        ledgerEntry.policies = {
            read: `{"type":"EQUALS","name":"hf.EnrollmentID","value":"${ctx.clientIdentity.getAttributeValue('hf.EnrollmentID')}"}`,
            update: `{"type":"EQUALS","name":"hf.EnrollmentID","value":"${ctx.clientIdentity.getAttributeValue('hf.EnrollmentID')}"}`,
            delete: `{"type":"EQUALS","name":"hf.EnrollmentID","value":"${ctx.clientIdentity.getAttributeValue('hf.EnrollmentID')}"}`,
            policy: `{"type":"EQUALS","name":"hf.EnrollmentID","value":"${ctx.clientIdentity.getAttributeValue('hf.EnrollmentID')}"}`,
        };

        // Submit ledger entry
        const buffer: Buffer = Buffer.from(JSON.stringify(ledgerEntry));

        await ctx.stub.putState(id, buffer);

        delete ledgerEntry.policies;
        return ledgerEntry;
    }

    @Transaction(false)
    @Returns('Partial<IPFSStorage>')
    public async ReadFile(ctx: Context, id: string): Promise<Partial<IPFSStorage>> {
        // Does the file exist?
        const exists: boolean = await this.FileExists(ctx, id);
        if (!exists) {
            throw new Error(`[Access Denied] The file does not exist or you are not allowed to access it`);
        }

        // Retrieve ledger entry
        const data: Uint8Array = await ctx.stub.getState(id);

        const ledgerEntry: IPFSStorage = JSON.parse(data.toString()) as IPFSStorage;

        // Perform access control
        const authorized = (await ctx.stub.invokeChaincode('access-control', ['ValidateCertificate', ledgerEntry.policies.read], 'mychannel')).payload.toString();

        if (authorized !== "true") {
            throw new Error(`[Access Denied] The file does not exist or you are not allowed to access it`);
        }

        delete ledgerEntry.policies;
        return ledgerEntry;
    }

    @Transaction()
    @Returns('Partial<IPFSStorage>')
    public async UpdateFile(ctx: Context, id: string, cid: string): Promise<Partial<IPFSStorage>> {
        // Does the file exist?
        const exists: boolean = await this.FileExists(ctx, id);
        if (!exists) {
            throw new Error(`[Access Denied] The file does not exist or you are not allowed to access it`);
        }

        // Retrieve ledger entry
        const data: Uint8Array = await ctx.stub.getState(id);

        const ledgerEntry: IPFSStorage = JSON.parse(data.toString()) as IPFSStorage;

        // Perform access control
        const authorized = (await ctx.stub.invokeChaincode('access-control', ['ValidateCertificate', ledgerEntry.policies.update], 'mychannel')).payload.toString();

        if (authorized !== "true") {
            throw new Error(`[Access Denied] The file does not exist or you are not allowed to access it`);
        }

        // Update ledger entry
        ledgerEntry.cid = cid.toString();

        // Submit ledger entry
        const buffer: Buffer = Buffer.from(JSON.stringify(ledgerEntry));

        await ctx.stub.putState(id, buffer);

        return { id: ledgerEntry.id };
    }

    @Transaction()
    @Returns('Partial<IPFSStorage>')
    public async DeleteFile(ctx: Context, id: string): Promise<Partial<IPFSStorage>> {
        // Does the file exist?
        const exists: boolean = await this.FileExists(ctx, id);
        if (!exists) {
            throw new Error(`[Access Denied] The file does not exist or you are not allowed to access it`);
        }

        // Retrieve ledger entry
        const data: Uint8Array = await ctx.stub.getState(id);

        const ledgerEntry: IPFSStorage = JSON.parse(data.toString()) as IPFSStorage;

        // Perform access control
        const authorized = (await ctx.stub.invokeChaincode('access-control', ['ValidateCertificate', ledgerEntry.policies.delete], 'mychannel')).payload.toString();

        if (authorized !== "true") {
            throw new Error(`[Access Denied] The file does not exist or you are not allowed to access it`);
        }

        // Delete ledger entry
        await ctx.stub.deleteState(id);

        return { id: ledgerEntry.id };
    }

    @Transaction(false)
    @Returns('Partial<IPFSStorage>')
    public async ReadPolicy(ctx: Context, id: string): Promise<Partial<IPFSStorage>> {
        // Does the file exist?
        const exists: boolean = await this.FileExists(ctx, id);
        if (!exists) {
            throw new Error(`[Access Denied] The file does not exist or you are not allowed to access it`);
        }

        // Retrieve ledger entry
        const data: Uint8Array = await ctx.stub.getState(id);

        const ledgerEntry: IPFSStorage = JSON.parse(data.toString()) as IPFSStorage;

        // Perform access control
        const authorized = (await ctx.stub.invokeChaincode('access-control', ['ValidateCertificate', ledgerEntry.policies.policy], 'mychannel')).payload.toString();

        if (authorized !== "true") {
            throw new Error(`[Access Denied] The file does not exist or you are not allowed to access it`);
        }

        return { policies: ledgerEntry.policies };
    }

    @Transaction()
    @Returns('Partial<IPFSStorage>')
    public async UpdatePolicy(ctx: Context, id: string, type: string, value: string): Promise<Partial<IPFSStorage>> {
        // Validate the request
        if (!['read', 'update', 'delete', 'policy'].includes(type)) {
            throw new Error(`[Invalid Request] The submitted value for the 'type' property is invalid`);
        }

        const parsedValue: AccessPolicy = JSON.parse(value) as AccessPolicy;

        if (!PolicyManager.isValid(parsedValue)) {
            throw new Error(`[Invalid Request] The submitted value for the 'value' property is invalid`);
        }

        // Does the file exist?
        const exists: boolean = await this.FileExists(ctx, id);
        if (!exists) {
            throw new Error(`[Access Denied] The file does not exist or you are not allowed to access it`);
        }

        // Retrieve ledger entry
        const data: Uint8Array = await ctx.stub.getState(id);

        const ledgerEntry: IPFSStorage = JSON.parse(data.toString()) as IPFSStorage;

        // Perform access control
        const authorized = (await ctx.stub.invokeChaincode('access-control', ['ValidateCertificate', ledgerEntry.policies.policy], 'mychannel')).payload.toString();

        if (authorized !== "true") {
            throw new Error(`[Access Denied] The file does not exist or you are not allowed to access it`);
        }

        // Update ledger entry
        ledgerEntry.policies[type] = value;

        // Submit ledger entry
        const buffer: Buffer = Buffer.from(JSON.stringify(ledgerEntry));

        await ctx.stub.putState(id, buffer);

        return { policies: ledgerEntry.policies };
    }

}
