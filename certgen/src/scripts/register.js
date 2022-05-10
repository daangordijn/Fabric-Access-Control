import fs from 'fs';
import path from 'path';
import shell from 'shelljs';

import Logger from '../utils/logger.js';
import { createRegistrationOptions, createEnrollmentOptions } from './register-parser.js';

const registerCertificateHelper = (options) => {
  // Step 1. Initialize
  Logger.trace('Setting the required Fabric environment variables...');

  shell.env['PATH'] = options.BIN_PATH ? `${shell.env.PATH}:${options.BIN_PATH}` : shell.env.PATH;
  shell.env['FABRIC_CFG_PATH'] = shell.env.FABRIC_CFG_PATH || options.FABRIC_CFG_PATH;
  shell.env['FABRIC_CA_CLIENT_HOME'] = shell.env.FABRIC_CA_CLIENT_HOME || options.FABRIC_CA_CLIENT_HOME;

  // Step 2. Register Identity
  Logger.trace('Registering the new identity with the Fabric CA Server...')

  const registrationCommand = `fabric-ca-client register ${createRegistrationOptions(options)}`;

  const registrationResult = shell.exec(registrationCommand, { silent: true });

  if (registrationResult.code != 0) {
    Logger.error(registrationResult.stderr);
    process.exit(1);
  }

  Logger.info('Registration of the new identity with the Fabric CA Server succeeded!');

  // Step 3. Extract Secret
  const enrollmentSecretRegex = /Password: (.*)/;
  const enrollmentSecret = enrollmentSecretRegex.exec(registrationResult.stdout)[1];

  // Step 4. Enroll Identity
  Logger.trace('Enrolling the new identity with the Fabric CA Server...');

  const enrollmentCommand = `fabric-ca-client enroll ${createEnrollmentOptions(options, enrollmentSecret)}`;

  const enrollmentResult = shell.exec(enrollmentCommand, { silent: true });

  if (enrollmentResult.code != 0) {
    Logger.error(enrollmentResult.stderr);
    process.exit(1);
  }

  Logger.info('Enrollment of the new identity with the Fabric CA Server succeeded!');

  // Step 5. Create Wallet
  const localMspPath = options['mspdir'] ? path.resolve(options['mspdir']) : path.resolve(shell.env.FABRIC_CA_CLIENT_HOME, 'msp');

  if (options.createWallet) {
    Logger.trace('Generating an filesystem wallet using cryptographic materials...');

    const certificateFolder = path.resolve(localMspPath, 'signcerts');
    const certificateName = fs.readdirSync(certificateFolder)[0];

    const privateKeyFolder = path.resolve(localMspPath, 'keystore');
    const privateKeyName = fs.readdirSync(privateKeyFolder)[0];

    const identity = {
      credentials: {
        certificate: fs.readFileSync(path.resolve(certificateFolder, certificateName), 'utf8').replace(/(?:\r\n|\r|\n)/g, '\\n'),
        privateKey: fs.readFileSync(path.resolve(privateKeyFolder, privateKeyName), 'utf8').replace(/(?:\r\n|\r|\n)/g, '\\n'),
      },
      mspId: options.msp,
      type: 'X.509',
      version: 1,
    };

    shell.exec(`mkdir -p ${path.resolve(options['walletdir'])}`);

    shell.exec(`echo '${JSON.stringify(identity)}' > ${path.resolve(options['walletdir'], `${options['id']['name']}.id`)}`);

    Logger.info('Generation of the filesystem wallet using cryptographic materials succeeded!');
  }

  // Step 6. Finalize
  Logger.trace('Generating a config.yaml file in the specified MSP directory...')

  const authorityFolder = path.resolve(localMspPath, 'cacerts');
  const authorityName = fs.readdirSync(authorityFolder)[0];

  shell.exec(`echo '${createMspConfiguration(authorityName)}' > ${path.resolve(localMspPath, 'config.yaml')}`);

  Logger.success('Successfully finished user registration and populated the required directories!');
};

const createMspConfiguration = (fileName) => `
NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/${fileName}
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/${fileName}
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/${fileName}
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/${fileName}
    OrganizationalUnitIdentifier: orderer
`;

export { registerCertificateHelper };