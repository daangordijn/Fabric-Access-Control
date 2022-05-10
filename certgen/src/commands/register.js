import fs from 'fs';
import yaml from 'js-yaml';
import inquirer from 'inquirer';

import { registerCertificateHelper } from '../scripts/register.js';
import { environmentQuestions, requiredQuestions, optionalQuestions } from './register-questions.js';

const registerCertificate = (name) => {
    const inquirerQuestions = [];

    // Environment Questions
    environmentQuestions.forEach(question => {
        inquirerQuestions.push(question);
    });

    // Required Questions
    requiredQuestions.forEach(question => {
        inquirerQuestions.push(question);
    });

    // Optional Questions
    optionalQuestions.forEach(question => {
        question.when = (answers) => answers.options.includes(question.name);
        inquirerQuestions.push(question);
    });

    inquirer.prompt(inquirerQuestions).then(answers => {
        delete answers.options;

        // Set implicit arguments
        if (answers['id']) {
            answers['id']['name'] = name;
        } else {
            answers['id'] = { name: name };
        }

        // Set implicit options
        const ccp = yaml.load(fs.readFileSync(answers.ccp.path, 'utf8'));
        answers['msp'] = ccp.organizations[answers.ccp.org].mspid;
        answers['url'] = ccp.certificateAuthorities[answers.ccp.cahost].url;
        answers['caname'] = ccp.certificateAuthorities[answers.ccp.cahost].caName;
        
        registerCertificateHelper(answers);
    });
};

export { registerCertificate };