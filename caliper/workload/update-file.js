'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const { IdStorage } = require('../utils/id-storage.js');

class UpdateFileWorkload extends WorkloadModuleBase {
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
        const cid = this.getRandomCID();

        const request = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'UpdateFile',
            contractArguments: [id, cid],
            invokerIdentity: 'User1',
            readOnly: false
        };

        await this.sutAdapter.sendRequests(request);
    }

    getRandomCID() {
        const list = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let res = "Qm";
        for (var i = 0; i < 44; i++) {
            let rnd = Math.floor(Math.random() * list.length);
            res = res + list.charAt(rnd);
        }
        return res;
    }
}

function createWorkloadModule() {
    return new UpdateFileWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;