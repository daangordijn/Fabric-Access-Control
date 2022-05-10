'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const { IdStorage } = require('../utils/id-storage.js');

class DeleteFileWorkload extends WorkloadModuleBase {
    constructor() {
        super();
        this.idStorage = IdStorage.getInstance();
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
    }

    async submitTransaction() {
        const id = this.idStorage.pop();

        const request = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'DeleteFile',
            contractArguments: [id],
            invokerIdentity: 'User1',
            readOnly: false
        };

        await this.sutAdapter.sendRequests(request);
    }
}

function createWorkloadModule() {
    return new DeleteFileWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;