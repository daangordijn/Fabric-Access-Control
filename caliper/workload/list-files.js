'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class ListFilesWorkload extends WorkloadModuleBase {
    constructor() {
        super();
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
    }

    async submitTransaction() {
        const request = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'ListFiles',
            invokerIdentity: 'User1',
            contractArguments: [],
            readOnly: true
        };

        await this.sutAdapter.sendRequests(request);
    }
}

function createWorkloadModule() {
    return new ListFilesWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;