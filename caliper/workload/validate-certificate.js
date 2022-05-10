'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const { PolicyCreator } = require('../utils/policy-creator');

class ValidateCertificateWorkload extends WorkloadModuleBase {
    constructor() {
        super();
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
    }

    async submitTransaction() {
        const policy = PolicyCreator.getPolicy(this.roundArguments.policy);

        const request = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'ValidateCertificate',
            invokerIdentity: this.roundArguments.invokerIdentity,
            contractArguments: [policy],
            readOnly: true
        };

        await this.sutAdapter.sendRequests(request);
    }
}

function createWorkloadModule() {
    return new ValidateCertificateWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;