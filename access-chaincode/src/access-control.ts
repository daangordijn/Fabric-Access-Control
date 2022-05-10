/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class CertificateHash {

    @Property()
    public hash: string;

    @Property()
    public x509: string;

    @Property()
    public mspId: string;

}
