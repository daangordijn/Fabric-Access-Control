/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { IPFSStorageContract } from '.';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as winston from 'winston';

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('IPFSStorageContract', () => {

    let contract: IPFSStorageContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new IPFSStorageContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"ipfs storage 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"ipfs storage 1002 value"}'));
    });

    describe('#ipfsStorageExists', () => {

        it('should return true for a ipfs storage', async () => {
            await contract.ipfsStorageExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a ipfs storage that does not exist', async () => {
            await contract.ipfsStorageExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createIpfsStorage', () => {

        it('should create a ipfs storage', async () => {
            await contract.createIpfsStorage(ctx, '1003', 'ipfs storage 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"ipfs storage 1003 value"}'));
        });

        it('should throw an error for a ipfs storage that already exists', async () => {
            await contract.createIpfsStorage(ctx, '1001', 'myvalue').should.be.rejectedWith(/The ipfs storage 1001 already exists/);
        });

    });

    describe('#readIpfsStorage', () => {

        it('should return a ipfs storage', async () => {
            await contract.readIpfsStorage(ctx, '1001').should.eventually.deep.equal({ value: 'ipfs storage 1001 value' });
        });

        it('should throw an error for a ipfs storage that does not exist', async () => {
            await contract.readIpfsStorage(ctx, '1003').should.be.rejectedWith(/The ipfs storage 1003 does not exist/);
        });

    });

    describe('#updateIpfsStorage', () => {

        it('should update a ipfs storage', async () => {
            await contract.updateIpfsStorage(ctx, '1001', 'ipfs storage 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"ipfs storage 1001 new value"}'));
        });

        it('should throw an error for a ipfs storage that does not exist', async () => {
            await contract.updateIpfsStorage(ctx, '1003', 'ipfs storage 1003 new value').should.be.rejectedWith(/The ipfs storage 1003 does not exist/);
        });

    });

    describe('#deleteIpfsStorage', () => {

        it('should delete a ipfs storage', async () => {
            await contract.deleteIpfsStorage(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a ipfs storage that does not exist', async () => {
            await contract.deleteIpfsStorage(ctx, '1003').should.be.rejectedWith(/The ipfs storage 1003 does not exist/);
        });

    });

});
