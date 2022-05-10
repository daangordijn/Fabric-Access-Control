import shell from 'shelljs';

import Logger from '../utils/logger.js';
import System from '../utils/system.js';

const inspectCertificateHelper = (filePath) => {
    const extension = System.getFileExtension(filePath);

    switch(extension) {
        case '.id':
            inspectCertificateSDKHelper(filePath);
            break;
        case '.pem':
            inspectCertificateCLIHelper(filePath);
            break;
        default:
            Logger.error(`Cannot parse file extension ${extension}; supported formats are '.id' and '.pem'`)
            process.exit(1);
    }
};

const inspectCertificateCLIHelper = (filePath) => {
    if (!shell.which(`openssl`)) {
        Logger.error(`Cannot find the 'openssl' executable; please install it before continuing`)
        process.exit(1);
    };

    const command = `openssl x509 -in ${filePath} -text`;

    inspectCertificateCommonHelper(filePath, command);
};

const inspectCertificateSDKHelper = (filePath) => {
    if (!shell.which(`cat`)) {
        Logger.error(`Cannot find the 'cat' executable; please install it before continuing`)
        process.exit(1);
    };

    if (!shell.which(`jq`)) {
        Logger.error(`Cannot find the 'jq' executable; please install it before continuing`)
        process.exit(1);
    };

    if (!shell.which(`openssl`)) {
        Logger.error(`Cannot find the 'openssl' executable; please install it before continuing`)
        process.exit(1);
    };
    
    const command = `cat ${filePath} | jq .credentials.certificate -r | openssl x509 -text`;

    inspectCertificateCommonHelper(filePath, command);
};

const inspectCertificateCommonHelper = (filePath, command) => {
    if (System.validatePath(filePath, System.VALIDATION_MODE.FILE_EXISTS)) {
        const result = shell.exec(command, { silent: true });

        if (result.code != 0) {
            Logger.error(result.stderr);
            process.exit(1);
        }  

        Logger.success(`Successfully loaded and inspected the specified X.509 certificate`);
        Logger.log(result.stdout, false);
    } else {
        Logger.error(System.ENOENT_FILE);
        process.exit(1);
    };
}

export { inspectCertificateHelper };
