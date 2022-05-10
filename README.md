<h1 align="center">Hyperledger Fabric - Access Control</h1>

<p align="center">
  <a>
    <img src="https://img.shields.io/badge/Hyperledger%20Fabric-v2.2-brightgreen" />
  </a>&nbsp;
  <a>
    <img src="https://img.shields.io/badge/Ubuntu-v20.04.4-brightgreen" />
  </a>&nbsp;
  <a>
    <img src="https://img.shields.io/badge/Docker-v20.10.14-brightgreen" />
  </a>&nbsp;
  <a>
    <img src="https://img.shields.io/badge/Docker%20Compose-v1.29.2-brightgreen" />
  </a>&nbsp;
  <a>
    <img src="https://img.shields.io/badge/NodeJS-v16.15.0-brightgreen" />
  </a>&nbsp;
  <a>
    <img src="https://img.shields.io/badge/NPM-v8.8.0-brightgreen" />
  </a>
</p>

## Getting Started

### Prerequisites
In order to run this demo repository, you need to install the following tools:

#### 1. NodeJS
Installation guide: https://nodejs.org/en/download/

#### 2. Docker
Installation guide: https://docs.docker.com/get-docker/

#### 3. Docker Compose
Installation guide: https://docs.docker.com/compose/install/

### Start Network
First, execute the following command in the root directory of this repository:
```
./network-starter.sh
```

Next, `cd` into the `certgen` directory and execute the following commands:
```
npm install
[sudo] npm install -g
```

Next, `cd` into the `demo-application` directory and execute the following command:
```
certgen register user2
```

If you execute the `certgen` command from the `demo-application` directory, use these values:
```
? Specify the path to the Fabric 'bin' directory                  ../bin/
? Specify the path to the Fabric 'config' directory               ../config/
? Specify the path to the CA Client 'home' directory              ../test-network/organizations/peerOrganizations/org1.example.com
? Specify the path to the organization's connection profile       ../test-network/organizations/peerOrganizations/org1.example.com/connection-org1.yaml
? Select the peer organization that is issuing the identity       Org1
? Select the certificate authority that is issuing the identity   ca.org1.example.com
? Provide a value for the MSP directory                           ../test-network/organizations/peerOrganizations/org1.example.com/users/User2@org1.example.com/msp
? Would you like to create a system wallet?                       Yes
? Provide a value for the wallet directory                        ./identities/user2
? Which additional options would you like to provide?             [id.affiliation, id.type, tls.certfiles]
? Provide a value for the identity affiliation                    org1.department2
? Provide a value for the identity type                           client
? Specify the path to the organization's TLS Certificate (.pem)   ../test-network/organizations/fabric-ca/org1/ca-cert.pem
```

Finally, you can run the demo-application by executing the following commands:
```
npm install
npm run build
npm run [command-name]
```

where `[command-name]` can be:

* `listFiles`
* `createFile <id> <content>`
* `readFile <id>`
* `updateFile <id> <content>`
* `deleteFile <id>`
* `readPolicy <id>`
* `updatePolicy <id> <type> <value>`
* `registerCertificate`

### Teardown Network
When you are done with the tests, run the following command in the root directory of this repository:
```
./network-cleaner.sh
```

## Changelog

### `test-network`
The following code has been added to the `./test-network/docker/docker-compose-test-net.yaml` file:

```
ipfs:
  container_name: ipfs
  image: ipfs/go-ipfs:latest
  volumes:
      - /var/ipfs/staging:/export
      - /var/ipfs/data:/data/ipfs
  ports:
    - 4001:4001
    - 4001:4001/udp
    - 127.0.0.1:8080:8080
    - 127.0.0.1:5001:5001
  networks:
    - test
```

## Policy Syntax
The `<value>` field of the `updatePolicy` command must be a JSON object, structured as follows:
```json
{
    "type": "AND",
    "value": [
        {
            "type": "OR",
            "value": [
                {
                    "type": "EQUALS",
                    "name": "hf.EnrollmentID",
                    "value": "user2"
                },
                {
                    "type": "AND",
                    "value": [
                        {
                            "type": "EQUALS",
                            "name": "hf.Affiliation",
                            "value": "org1.department2"
                        },
                        {
                            "type": "INCLUDES",
                            "name": "hf.Type",
                            "value": "admin"
                        },
                        {
                            "type": "NOT",
                            "value": {
                                "type": "INCLUDES",
                                "name": "hf.Type",
                                "value": "peer"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "type": "EQUALS",
            "name": "privileged",
            "value": "true"
        }
    ]
}
```
