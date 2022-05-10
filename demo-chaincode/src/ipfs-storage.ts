/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object() 
export class IPFSPolicies {

    @Property()
    public read: string;

    @Property()
    public update: string;

    @Property()
    public delete: string;

    @Property()
    public policy: string;

}

@Object()
export class IPFSStorage {

    @Property()
    public id: string;

    @Property()
    public cid: string;

    @Property()
    public name: string;

    @Property()
    public policies: IPFSPolicies

}
