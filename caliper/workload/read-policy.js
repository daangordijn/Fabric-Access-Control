'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const { IdStorage } = require('../utils/id-storage.js');

class ReadPolicyWorkload extends WorkloadModuleBase {
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

        const request = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'ReadPolicy',
            contractArguments: [id],
            invokerIdentity: 'User1',
            readOnly: true
        };

        await this.sutAdapter.sendRequests(request);
    }
}

function createWorkloadModule() {
    return new ReadPolicyWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;