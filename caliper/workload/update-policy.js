'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const { IdStorage } = require('../utils/id-storage.js');

class UpdatePolicyWorkload extends WorkloadModuleBase {
    constructor() {
        super();
        this.txIndex = -1;
        this.idStorage = IdStorage.getInstance();
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
    }

    async submitTransaction() {
        this.txIndex++;

        const id = this.idStorage.at(this.txIndex % this.idStorage.size());
        const type = 'read';
        const value = '{"type":"EQUALS","name":"hf.EnrollmentID","value":"user2"}';

        const request = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'UpdatePolicy',
            contractArguments: [id, type, value],
            invokerIdentity: 'User1',
            readOnly: false
        };

        await this.sutAdapter.sendRequests(request);
    }
}

function createWorkloadModule() {
    return new UpdatePolicyWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;