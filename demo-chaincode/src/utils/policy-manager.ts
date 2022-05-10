/*
 * SPDX-License-Identifier: Apache-2.0
 */

interface AndPolicy {
    type: "AND";
    value: AccessPolicy[];
};

interface OrPolicy {
    type: "OR";
    value: AccessPolicy[];
};

interface NotPolicy {
    type: "NOT";
    value: AccessPolicy;
};

interface EqualsPolicy {
    type: "EQUALS";
    name: string;
    value: string;
};

interface IncludesPolicy {
    type: "INCLUDES";
    name: string;
    value: string;
};

type AccessPolicy = AndPolicy | OrPolicy | NotPolicy | EqualsPolicy | IncludesPolicy;

class PolicyManager {
    constructor() {}

    public static isValid(policy: any): boolean {
        try {
            if (!policy || typeof(policy) !== 'object' || !policy.type) {
                return false;
            }
    
            if (policy.type === 'AND' && policy.value && Array.isArray(policy.value) && policy.value.length >= 2) {
                return policy.value.every(PolicyManager.isValid);
            }
    
            if (policy.type === 'OR' && policy.value && Array.isArray(policy.value) && policy.value.length >= 2) {
                return policy.value.every(PolicyManager.isValid);
            }
    
            if (policy.type === 'NOT' && policy.value && !Array.isArray(policy.value)) {
                return PolicyManager.isValid(policy.value);
            }

            if (policy.type === 'EQUALS' && policy.name && policy.value && typeof(policy.name) === 'string' && typeof(policy.value) === 'string') {
                return true;
            }

            if (policy.type === 'INCLUDES' && policy.name && policy.value && typeof(policy.name) === 'string' && typeof(policy.value) === 'string') {
                return true;
            }
            
            return false;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    public static toString(policy: AccessPolicy): string {
        switch(policy.type) {
            case 'AND':
                return `( ${policy.value.map(rule => PolicyManager.toString(rule)).join(' AND ')} )`;
            case 'OR':
                return `( ${policy.value.map(rule => PolicyManager.toString(rule)).join(' OR ')} )`;
            case 'NOT':
                return `( NOT ${PolicyManager.toString(policy.value)} )`;
            case 'EQUALS':
                return `( "${policy.name}" EQUALS "${policy.value} )`;
            case 'INCLUDES':
                return `( "${policy.name}" INCLUDES "${policy.value}" )`
        }
    }
}

export { AccessPolicy, PolicyManager };
