/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { AccessControlContract } from '.';

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

describe('AccessControlContract', () => {

    let contract: AccessControlContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new AccessControlContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"access control 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"access control 1002 value"}'));
    });

    describe('#accessControlExists', () => {

        it('should return true for a access control', async () => {
            await contract.accessControlExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a access control that does not exist', async () => {
            await contract.accessControlExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createAccessControl', () => {

        it('should create a access control', async () => {
            await contract.createAccessControl(ctx, '1003', 'access control 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"access control 1003 value"}'));
        });

        it('should throw an error for a access control that already exists', async () => {
            await contract.createAccessControl(ctx, '1001', 'myvalue').should.be.rejectedWith(/The access control 1001 already exists/);
        });

    });

    describe('#readAccessControl', () => {

        it('should return a access control', async () => {
            await contract.readAccessControl(ctx, '1001').should.eventually.deep.equal({ value: 'access control 1001 value' });
        });

        it('should throw an error for a access control that does not exist', async () => {
            await contract.readAccessControl(ctx, '1003').should.be.rejectedWith(/The access control 1003 does not exist/);
        });

    });

    describe('#updateAccessControl', () => {

        it('should update a access control', async () => {
            await contract.updateAccessControl(ctx, '1001', 'access control 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"access control 1001 new value"}'));
        });

        it('should throw an error for a access control that does not exist', async () => {
            await contract.updateAccessControl(ctx, '1003', 'access control 1003 new value').should.be.rejectedWith(/The access control 1003 does not exist/);
        });

    });

    describe('#deleteAccessControl', () => {

        it('should delete a access control', async () => {
            await contract.deleteAccessControl(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a access control that does not exist', async () => {
            await contract.deleteAccessControl(ctx, '1003').should.be.rejectedWith(/The access control 1003 does not exist/);
        });

    });

});
