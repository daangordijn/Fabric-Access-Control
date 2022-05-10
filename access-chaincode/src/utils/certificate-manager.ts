/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Attribute, Certificate, DistinguishedName } from '@fidm/x509';
import { createHash } from 'crypto';
import { ChaincodeStub } from 'fabric-shim';

const FABRIC_CERT_ATTR_OID = '1.2.3.4.5.6.7.8.1';

class CertificateManager {
    private id: string;
    private mspId: string;
    private idBytes: Uint8Array;
    private certificate: Certificate;
    private attributes: object = {};

    constructor(idBytes: Uint8Array, mspId: string) {
        this.mspId = mspId;
        this.idBytes = idBytes;

        const normalizedX509 = this.getNormalizedX509(new TextDecoder().decode(this.idBytes));
        this.certificate = Certificate.fromPEM(Buffer.from(normalizedX509, 'utf-8'));

        const subjectDistinguishedName = this.getDistinguishedName(this.certificate.subject);
        const issuerDistinguishedName = this.getDistinguishedName(this.certificate.issuer);
        this.id = `x509::${subjectDistinguishedName}::${issuerDistinguishedName}`;

        const extension = this.certificate.extensions.find((ext) => ext.oid === FABRIC_CERT_ATTR_OID);
        if (extension) {
            const str = extension.value.toString();
            const obj = JSON.parse(str);
            this.attributes = obj.attrs;
        }
    }

    /**
     * Public Methods
     */
    public getID() {
        return this.id;
    }

    public getMSPID(): string {
        return this.mspId;
    }

    public getIDBytes(): Uint8Array {
        return this.idBytes;
    }
    
    public getAttributes(): object {
        return this.attributes;
    }

    public getCertificate(): Certificate {
        return this.certificate;
    }

    public getCertificateHash(): string {
        const cert = this.idBytes.toString();
        const hash = createHash('sha512').update(cert, 'utf8');
        return hash.digest('base64');
    }

    public getAttributeValue(name: string): string {
        const attribute = this.attributes[name];
        if (attribute) {
            return attribute;
        } else {
            return null;
        }
    }

    public assertAttributeEquals(name: string, value: string): boolean {
        const attribute = this.getAttributeValue(name);
        if (attribute === null) {
            return false;
        }

        return attribute.trim() === value.trim();
    }

    public assertAttributeIncludes(name: string, value: string): boolean {
        const attribute = this.getAttributeValue(name);
        if (attribute === null) {
            return false;
        }

        return attribute
            .split(',')
            .map(attr => attr.trim())
            .includes(value.trim());
    }

    public static fromStub(stub: ChaincodeStub): CertificateManager {
        return new CertificateManager(stub.getCreator().idBytes, stub.getCreator().mspid);
    }

    public static fromBytes(idBytes: Uint8Array, mspId: string): CertificateManager {
        return new CertificateManager(idBytes, mspId);
    }

    /**
     * Private Methods
     */
    private getNormalizedX509(idBytes: string): string {
        const idRegex = /(\-\-\-\-\-\s*BEGIN ?[^-]+?\-\-\-\-\-)([\s\S]*)(\-\-\-\-\-\s*END ?[^-]+?\-\-\-\-\-)/;

        let matches = idBytes.match(idRegex);
        if (!matches || matches.length !== 4) {
            throw new Error('[Server Error] Failed to find start line or end line of the certificate');
        }

        matches.shift();

        matches = matches.map((element) => {
            return element.trim();
        });

        return matches.join('\n') + '\n';
    }

    private getDistinguishedName(name: DistinguishedName) {
        return name.attributes.map((attribute: Attribute) => {
            const value = attribute.value.replace('/', '\\/');
            return `/${attribute.shortName}=${value}`;
        }).join('');
    }
}

export { CertificateManager };
