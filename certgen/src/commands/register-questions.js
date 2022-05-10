import fs from 'fs';
import yaml from 'js-yaml';
import shell from 'shelljs';
import System from '../utils/system.js';

const environmentQuestions = [
    {
        type: 'input',
        name: 'BIN_PATH',
        message: `Specify the path to the Fabric 'bin' directory`,
        default: '../bin/',
        when: () => !shell.which('fabric-ca-client'),
        filter: (input, _) => System.resolvePath(input),
        validate: (input, _) => {
            if (!input || input.trim().length <= 0) {
                return 'Field must be a non-empty string';
            }
            return System.validatePath(input, System.VALIDATION_MODE.FOLDER_EXISTS) || System.ENOENT_FOLDER;
        }
    },
    {
        type: 'input',
        name: 'FABRIC_CFG_PATH',
        message: `Specify the path to the Fabric 'config' directory`,
        default: '../config/',
        when: () => !shell.env.FABRIC_CFG_PATH,
        filter: (input, _) => System.resolvePath(input),
        validate: (input, _) => {
            if (!input || input.trim().length <= 0) {
                return 'Field must be a non-empty string';
            }
            return System.validatePath(input, System.VALIDATION_MODE.FOLDER_EXISTS) || System.ENOENT_FOLDER;
        }
    },
    {
        type: 'input',
        name: 'FABRIC_CA_CLIENT_HOME',
        message: `Specify the path to the CA Client 'home' directory`,
        when: () => !shell.env.FABRIC_CA_CLIENT_HOME,
        filter: (input, _) => System.resolvePath(input),
        validate: (input, _) => {
            if (!input || input.trim().length <= 0) {
                return 'Field must be a non-empty string';
            }
            return System.validatePath(input, System.VALIDATION_MODE.FOLDER_EXISTS) || System.ENOENT_FOLDER;
        }
    },
];

const optionalQuestions = [
    {
        type: 'input',
        name: 'csr.cn',
        message: `Provide a value for the CSR common name`,
        validate: (input, _) => (input && input.trim().length > 0) || 'Field must be a non-empty string'
    },
    {
        type: 'input',
        name: 'csr.hosts',
        suffix: '(e.g. 127.0.0.0,127.0.0.1)',
        message: `Provide a value for the CSR hostnames`,
        validate: (input, _) => (input && input.trim().length > 0) || 'Field must be a non-empty string'
    },
    {
        type: 'input',
        name: 'csr.keyrequest.algo',
        message: `Provide a value for the CSR key algorithm`,
        validate: (input, _) => (input && input.trim().length > 0) || 'Field must be a non-empty string'
    },
    {
        type: 'confirm',
        name: 'csr.keyrequest.reusekey',
        message: `Would you like to allow CSR key reuse?`,
    },
    {
        type: 'number',
        name: 'csr.keyrequest.size',
        message: `Provide a value for the CSR key size`,
        validate: (input, _) => (input && Number.isInteger(input)) || 'Field must be a valid integer'
    },
    {
        type: 'input',
        name: 'csr.names',
        suffix: '(e.g. C=US,ST=North Carolina,L=Durham)',
        message: `Provide a value for the CSR names`,
        validate: (input, _) => (input && input.trim().length > 0) || 'Field must be a non-empty string'
    },
    {
        type: 'input',
        name: 'csr.serialnumber',
        message: `Provide a value for the CSR serial number`,
        validate: (input, _) => (input && input.trim().length > 0) || 'Field must be a non-empty string'
    },
    // // Skipped: enrollment.*, home
    {
        type: 'input',
        name: 'id.affiliation',
        suffix: '(e.g. org1.department1)',
        message: `Provide a value for the identity affiliation`,
        validate: (input, _) => (input && input.trim().length > 0) || 'Field must be a non-empty string'
    },
    {
        type: 'input',
        name: 'id.attrs',
        suffix: '(e.g. foo=foo1,bar=bar1)',
        message: `Provide a value for the identity attributes`,
        validate: (input, _) => (input && input.trim().length > 0) || 'Field must be a non-empty string'
    },
    {
        type: 'number',
        name: 'id.maxenrollments',
        message: `Provide a value for the identity max. enrollments`,
        validate: (input, _) => (input && Number.isInteger(input)) || 'Field must be a valid integer'
    },
    {
        type: 'input',
        name: 'id.secret',
        message: `Provide a value for the identity secret`,
        validate: (input, _) => (input && input.trim().length > 0) || 'Field must be a non-empty string'
    },
    {
        type: 'input',
        name: 'id.type',
        message: `Provide a value for the identity type`,
        validate: (input, _) => (input && input.trim().length > 0) || 'Field must be a non-empty string'
    },
    {
        type: 'input',
        name: 'myhost',
        message: 'Provide a value for the certificate hostname',
        validate: (input, _) => (input && input.trim().length > 0) || 'Field must be a non-empty string'
    },
    // // Skipped: revoke.*
    {
        type: 'input',
        name: 'tls.certfiles',
        message: `Specify the path to the organization's TLS Certificate (.pem)`,
        filter: (input, _) => System.resolvePath(input),
        validate: (input, _) => {
            if (!input || input.trim().length <= 0) {
                return 'Field must be a non-empty string';
            }
            return System.validatePath(input, System.VALIDATION_MODE.FILE_EXISTS) || System.ENOENT_FILE;
        }
    },
    {
        type: 'input',
        name: 'tls.client.certfile',
        message: `Specify the path to the client's TLS certificate (.pem)`,
        filter: (input, _) => System.resolvePath(input),
        validate: (input, _) => {
            if (!input || input.trim().length <= 0) {
                return 'Field must be a non-empty string';
            }
            return System.validatePath(input, System.VALIDATION_MODE.FILE_EXISTS) || System.ENOENT_FILE;
        }
    },
    {
        type: 'input',
        name: 'tls.client.keyfile',
        message: `Specify the path to the client's TLS keyfile (.pem)`,
        filter: (input, _) => System.resolvePath(input),
        validate: (input, _) => {
            if (!input || input.trim().length <= 0) {
                return 'Field must be a non-empty string';
            }
            return System.validatePath(input, System.VALIDATION_MODE.FILE_EXISTS) || System.ENOENT_FILE;
        }
    }
];

const requiredQuestions = [
    {
        type: 'input',
        name: 'ccp.path',
        message: `Specify the path to the organization's connection profile`,
        filter: (input, _) => System.resolvePath(input),
        validate: (input, _) => {
            if (!input || input.trim().length <= 0) {
                return 'Field must be a non-empty string';
            }
            if (System.getFileExtension(input) !== '.yaml') {
                return 'File extension must be of type .yaml';
            }
            return System.validatePath(input, System.VALIDATION_MODE.FILE_EXISTS) || System.ENOENT_FILE;
        }
    },
    {
        type: 'list',
        name: 'ccp.org',
        message: 'Select the peer organization that is issuing the identity',
        choices: (answers) => {
            const ccp = yaml.load(fs.readFileSync(answers.ccp.path, 'utf8'));
            return Object.keys(ccp.organizations);
        }
    },
    {
        type: 'list',
        name: 'ccp.cahost',
        message: 'Select the certificate authority that is issuing the identity',
        choices: (answers) => {
            const ccp = yaml.load(fs.readFileSync(answers.ccp.path, 'utf8'));
            return ccp.organizations[answers.ccp.org].certificateAuthorities;
        }
    },
    {
        type: 'input',
        name: 'mspdir',
        message: `Provide a value for the MSP directory`,
        filter: (input, _) => System.resolvePath(input),
        validate: (input, _) => {
            if (!input || input.trim().length <= 0) {
                return 'Field must be a non-empty string';
            }
            return System.validatePath(input, System.VALIDATION_MODE.FOLDER_NOT_EXISTS) || System.EEXIST_FOLDER;
        }
    },
    {
        type: 'confirm',
        name: 'createWallet',
        message: 'Would you like to create a system wallet?',
    },
    {
        type: 'input',
        name: 'walletdir',
        message: `Provide a value for the wallet directory`,
        when: (answers) => answers.createWallet,
        filter: (input, _) => System.resolvePath(input),
        validate: (input, _) => {
            if (!input || input.trim().length <= 0) {
                return 'Field must be a non-empty string';
            }
            return System.validatePath(input, System.VALIDATION_MODE.FOLDER_NOT_EXISTS) || System.EEXIST_FOLDER;
        }
    },
    {
        type: 'checkbox',
        name: 'options',
        loop: false,
        message: 'Which additional options would you like to provide?',
        choices: optionalQuestions.map(option => option.name),
    },
];

export { environmentQuestions, requiredQuestions, optionalQuestions };