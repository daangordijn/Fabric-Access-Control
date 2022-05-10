import { URL } from 'url';

const createRegistrationOptions = (options) => {
    let result = '';
    /*
     * --caname
     */
    result += options['caname'] ? `--caname '${options['caname']}' ` : '';

    /*
     * --csr.*
     */
    if (options['csr']) {
        result += options['csr']['cn'] ? `--csr.cn '${options['csr']['cn']}' ` : '';

        result += options['csr']['hosts'] ? `--csr.hosts '${options['csr']['hosts']}' ` : '';

        if (options['csr']['keyrequest']) {
            result += options['csr']['keyrequest']['algo'] ? `--csr.keyrequest.algo '${options['csr']['keyrequest']['algo']}' ` : '';

            result += options['csr']['keyrequest']['reusekey'] ? `--csr.keyrequest.reusekey ` : '';

            result += options['csr']['keyrequest']['size'] ? `--csr.keyrequest.size ${options['csr']['keyrequest']['size']} ` : '';
        }

        result += options['csr']['names'] ? `--csr.names '${options['csr']['names']}' ` : '';

        result += options['csr']['serialnumber'] ? `--csr.serialnumber '${options['csr']['serialnumber']}' ` : '';
    }

    /*
     * --id.*
     */
    if (options['id']) {
        result += options['id']['affiliation'] ? `--id.affiliation '${options['id']['affiliation']}' ` : '';

        result += options['id']['attrs'] ? `--id.attrs '${options['id']['attrs'].split(',').map(attr => `${attr}:ecert`).join(',')}' ` : '';

        result += options['id']['name'] ? `--id.name '${options['id']['name']}' ` : '';

        result += options['id']['secret'] ? `--id.secret '${options['id']['secret']}' ` : '';

        result += options['id']['type'] ? `--id.type '${options['id']['type']}' ` : '';
    }

    /*
     * --myhost
     */
    result += options['myhost'] ? `--myhost '${options['myhost']}' ` : '';

    /*
     * --tls.*
     */
    if (options['tls']) {
        result += options['tls']['certfiles'] ? `--tls.certfiles '${options['tls']['certfiles']}' ` : '';

        if (options['tls']['client']) {
            result += options['tls']['client']['certfile'] ? `--tls.client.certfile '${options['tls']['client']['certfile']}' ` : '';

            result += options['tls']['client']['keyfile'] ? `--tls.client.keyfile '${options['tls']['client']['keyfile']}' ` : '';
        }
    }

    return result;
}

const createEnrollmentOptions = (options, enrollmentSecret) => {
    let result = '';

    /*
     * --caname
     */
    result += options['caname'] ? `--caname '${options['caname']}' ` : '';

    /*
     * --csr.*
     */
    if (options['csr']) {
        result += options['csr']['cn'] ? `--csr.cn '${options['csr']['cn']}' ` : '';

        result += options['csr']['hosts'] ? `--csr.hosts '${options['csr']['hosts']}' ` : '';

        if (options['csr']['keyrequest']) {
            result += options['csr']['keyrequest']['algo'] ? `--csr.keyrequest.algo '${options['csr']['keyrequest']['algo']}' ` : '';

            result += options['csr']['keyrequest']['reusekey'] ? `--csr.keyrequest.reusekey ` : '';

            result += options['csr']['keyrequest']['size'] ? `--csr.keyrequest.size ${options['csr']['keyrequest']['size']} ` : '';
        }

        result += options['csr']['names'] ? `--csr.names '${options['csr']['names']}' ` : '';

        result += options['csr']['serialnumber'] ? `--csr.serialnumber '${options['csr']['serialnumber']}' ` : '';
    }

    /*
     * --mspdir
     */
    result += options['mspdir'] ? `--mspdir '${options['mspdir']}' ` : '';

    /*
     * --tls.*
     */
    if (options['tls']) {
        result += options['tls']['certfiles'] ? `--tls.certfiles '${options['tls']['certfiles']}' ` : '';

        if (options['tls']['client']) {
            result += options['tls']['client']['certfile'] ? `--tls.client.certfile '${options['tls']['client']['certfile']}' ` : '';

            result += options['tls']['client']['keyfile'] ? `--tls.client.keyfile '${options['tls']['client']['keyfile']}' ` : '';
        }
    }

    /*
     * --url
     */
    if (options['url']) {
        const uri = new URL(options['url']);
        uri.username = options['id']['name'];
        uri.password = options['id']['secret'] || enrollmentSecret;

        result += `--url '${uri.href.replace(/\/$/, '')}' `;
    }

    return result;
}

export { createRegistrationOptions, createEnrollmentOptions };