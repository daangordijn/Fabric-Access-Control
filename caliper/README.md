<h1 align="center">Hyperledger Caliper - Benchmark</h1>

## Getting Started

### Prerequisites
In order to run this Hyperledger Caliper benchmark, you need to perform the following steps:

1. Start the local Hyperledger Fabric network by running the `./network-starter.sh` script at the root of this repository;
2. Next, `cd` into the `../test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore` directory;
3. Then, copy the name of the single file in this directory that contains the private key (the one ending with `_sk`);
3. Finally, paste it at the end of the `path` property on line 20 of the `./networks/network-config.yaml` file.

### Start Benchmark
Now, you can start running the Hyperledger Caliper benchmarks. There are two benchmark configurations provided in this repository, one for the `demo-chaincode` codebase, and one for the `access-chaincode` codebase. In order to run these configurations, execute the `npm run start:ipfs-storage` or `npm run start:access-control` commands, respectively. 


## Access Control Benchmark - Basic
The tables below show the average latency and average throughput measured on the latest commits to the `main` branch on GitHub, without using the "parent certificate" access feature. 

These results have been obtained on a Virtual Machine running Ubuntu 20.04.4 LTS, with 8 GiB of total available RAM memory.

### Average Latency (sec)

| Method                     | Transactions | Benchmark 1 | Benchmark 2 | Benchmark 3 | Benchmark 4 | Benchmark 5 | Average |
|----------------------------|--------------|-------------|-------------|-------------|-------------|-------------|---------|
| validateCertificate_1      | 1000         | 0.04        | 0.05        | 0.04        | 0.04        | 0.05        | 0.04    |
| validateCertificate_10     | 1000         | 0.04        | 0.04        | 0.04        | 0.04        | 0.04        | 0.04    |
| validateCertificate_50     | 1000         | 0.04        | 0.04        | 0.04        | 0.05        | 0.04        | 0.04    |
| validateCertificate_100    | 1000         | 0.04        | 0.05        | 0.04        | 0.04        | 0.04        | 0.04    |
| validateCertificate_500    | 1000         | 0.05        | 0.06        | 0.06        | 0.05        | 0.06        | 0.06    |
| validateCertificate_1000   | 1000         | 0.06        | 0.07        | 0.07        | 0.06        | 0.07        | 0.07    |
| validateCertificate_5000   | 1000         | 0.19        | 0.18        | 0.18        | 0.16        | 0.16        | 0.17    |
| validateCertificate_10000  | 1000         | 0.32        | 0.32        | 0.31        | 0.30        | 0.31        | 0.31    |
| validateCertificate_50000  | 1000         | 1.77        | 1.46        | 1.45        | 1.39        | 1.48        | 1.51    |
| validateCertificate_100000 | 1000         | 3.09        | 3.21        | 3.09        | 3.03        | 3.17        | 3.12    |
| registerCertificate        | 1000         | 0.05        | 0.05        | 0.05        | 0.05        | 0.05        | 0.05    |

### Average Throughput (TPS)

| Method                     | Transactions | Benchmark 1 | Benchmark 2 | Benchmark 3 | Benchmark 4 | Benchmark 5 | Average |
|----------------------------|--------------|-------------|-------------|-------------|-------------|-------------|---------|
| validateCertificate_1      | 1000         | 91.8        | 91.1        | 93.5        | 95.3        | 94.6        | 93.3    |
| validateCertificate_10     | 1000         | 100.9       | 104.5       | 91.3        | 96.3        | 101.2       | 98.8    |
| validateCertificate_50     | 1000         | 105.5       | 105.4       | 102.1       | 96.2        | 105.7       | 103.0   |
| validateCertificate_100    | 1000         | 102.8       | 95.4        | 95.4        | 106.5       | 104.6       | 100.9   |
| validateCertificate_500    | 1000         | 84.2        | 79.5        | 81.1        | 85.9        | 81.8        | 82.5    |
| validateCertificate_1000   | 1000         | 73.4        | 63.8        | 67.4        | 68.5        | 68.6        | 68.3    |
| validateCertificate_5000   | 1000         | 29.7        | 28.2        | 28.4        | 32.8        | 30.7        | 30.0    |
| validateCertificate_10000  | 1000         | 17.8        | 17.5        | 16.5        | 19.1        | 18.9        | 18.0    |
| validateCertificate_50000  | 1000         | 3.5         | 3.8         | 3.9         | 4.1         | 4.0         | 3.9     |
| validateCertificate_100000 | 1000         | 1.8         | 1.8         | 1.9         | 1.9         | 1.8         | 1.8     |
| registerCertificate        | 1000         | 91.7        | 89.0        | 85.0        | 86.6        | 92.5        | 89.0    |


## Access Control Benchmark - Parent
The tables below show the average latency and average throughput measured on the latest commits to the `main` branch on GitHub, with using the "parent certificate" access feature. 

These results have been obtained on a Virtual Machine running Ubuntu 20.04.4 LTS, with 8 GiB of total available RAM memory.

### Average Latency (sec)

| Method                     | Transactions | Benchmark 1 | Benchmark 2 | Benchmark 3 | Benchmark 4 | Benchmark 5 | Average |
|----------------------------|--------------|-------------|-------------|-------------|-------------|-------------|---------|
| validateCertificate_1      | 1000         | 0.05        | 0.05        | 0.06        | 0.05        | 0.05        | 0.05    |
| validateCertificate_10     | 1000         | 0.05        | 0.04        | 0.05        | 0.05        | 0.05        | 0.05    |
| validateCertificate_50     | 1000         | 0.04        | 0.05        | 0.04        | 0.05        | 0.05        | 0.05    |
| validateCertificate_100    | 1000         | 0.05        | 0.05        | 0.04        | 0.06        | 0.05        | 0.05    |
| validateCertificate_500    | 1000         | 0.06        | 0.06        | 0.06        | 0.06        | 0.06        | 0.06    |
| validateCertificate_1000   | 1000         | 0.08        | 0.07        | 0.06        | 0.07        | 0.07        | 0.07    |
| validateCertificate_5000   | 1000         | 0.20        | 0.19        | 0.18        | 0.20        | 0.19        | 0.19    |
| validateCertificate_10000  | 1000         | 0.38        | 0.34        | 0.37        | 0.38        | 0.39        | 0.37    |
| validateCertificate_50000  | 1000         | 1.61        | 1.62        | 1.64        | 1.76        | 1.67        | 1.66    |
| validateCertificate_100000 | 1000         | 3.35        | 3.46        | 3.36        | 3.32        | 3.53        | 3.40    |
| registerCertificate        | 1000         | 0.05        | 0.05        | 0.04        | 0.04        | 0.05        | 0.05    |

### Average Throughput (TPS)

| Method                     | Transactions | Benchmark 1 | Benchmark 2 | Benchmark 3 | Benchmark 4 | Benchmark 5 | Average |
|----------------------------|--------------|-------------|-------------|-------------|-------------|-------------|---------|
| validateCertificate_1      | 1000         | 86.3        | 86.6        | 84.0        | 87.7        | 85.0        | 85.9    |
| validateCertificate_10     | 1000         | 85.0        | 96.3        | 91.9        | 92.7        | 87.8        | 90.7    |
| validateCertificate_50     | 1000         | 98.9        | 90.6        | 96.3        | 93.8        | 90.9        | 94.1    |
| validateCertificate_100    | 1000         | 89.1        | 93.6        | 95.2        | 81.0        | 90.5        | 89.9    |
| validateCertificate_500    | 1000         | 74.9        | 78.8        | 76.0        | 70.8        | 76.3        | 75.4    |
| validateCertificate_1000   | 1000         | 63.5        | 66.3        | 68.6        | 66.6        | 69.2        | 66.8    |
| validateCertificate_5000   | 1000         | 26.9        | 26.3        | 27.1        | 26.5        | 23.7        | 26.1    |
| validateCertificate_10000  | 1000         | 15.2        | 15.2        | 15.3        | 14.8        | 15.0        | 15.1    |
| validateCertificate_50000  | 1000         | 3.4         | 3.4         | 3.3         | 3.1         | 3.2         | 3.3     |
| validateCertificate_100000 | 1000         | 1.5         | 1.5         | 1.4         | 1.5         | 1.4         | 1.5     |
| registerCertificate        | 1000         | 93.5        | 91.1        | 100.5       | 93.1        | 90.2        | 93.7    |


## IPFS Storage Benchmark - Without Access Control
The tables below show the average latency and average throughput measured on the latest commits to the `main` branch on GitHub, without enabling access control in the `demo-chaincode` contract. 

These results have been obtained on a Virtual Machine running Ubuntu 20.04.4 LTS, with 8 GiB of total available RAM memory.

### Average Latency (sec)

| Method       | Transactions | Benchmark 1 | Benchmark 2 | Benchmark 3 | Benchmark 4 | Benchmark 5 | Average |
|--------------|--------------|-------------|-------------|-------------|-------------|-------------|---------|
| createFile   | 1000         | 0.28        | 0.30        | 0.31        | 0.30        | 0.28        | 0.29    |
| listFiles    | 1000         | 0.49        | 0.49        | 0.48        | 0.50        | 0.47        | 0.49    |
| readFile     | ~ (60s)      | 0.04        | 0.04        | 0.04        | 0.04        | 0.04        | 0.04    |
| readPolicy   | ~ (60s)      | 0.04        | 0.04        | 0.04        | 0.04        | 0.04        | 0.04    |
| updateFile   | 1000         | 0.36        | 0.38        | 0.34        | 0.33        | 0.30        | 0.34    |
| updatePolicy | 1000         | 0.36        | 0.36        | 0.31        | 0.33        | 0.36        | 0.34    |
| deleteFile   | 1000         | 0.36        | 0.40        | 0.34        | 0.34        | 0.34        | 0.36    |

### Average Throughput (TPS)

| Method       | Transactions | Benchmark 1 | Benchmark 2 | Benchmark 3 | Benchmark 4 | Benchmark 5 | Average |
|--------------|--------------|-------------|-------------|-------------|-------------|-------------|---------|
| createFile   | 1000         | 17.7        | 17.7        | 17.7        | 17.7        | 17.7        | 17.7    |
| listFiles    | 1000         | 12.2        | 12.4        | 12.3        | 11.7        | 12.6        | 12.4    |
| readFile     | ~ (60s)      | 113.1       | 108.1       | 113.1       | 111.1       | 115.7       | 112.2   |
| readPolicy   | ~ (60s)      | 115.3       | 114.9       | 119.9       | 120.2       | 120.5       | 118.2   |
| updateFile   | 1000         | 14.9        | 13.9        | 16.7        | 16.7        | 19.3        | 16.3    |
| updatePolicy | 1000         | 15.6        | 14.9        | 19.1        | 16.9        | 16.2        | 16.5    |
| deleteFile   | 1000         | 16.1        | 13.1        | 15.2        | 16.7        | 16.9        | 15.6    |


## IPFS Storage Benchmark - With Access Control
The tables below show the average latency and average throughput measured on the latest commits to the `main` branch on GitHub, with enabling access control in the `demo-chaincode` contract. 

These results have been obtained on a Virtual Machine running Ubuntu 20.04.4 LTS, with 8 GiB of total available RAM memory.

### Average Latency (sec)

| Method       | Transactions | Benchmark 1 | Benchmark 2 | Benchmark 3 | Benchmark 4 | Benchmark 5 | Average | Delta  |
|--------------|--------------|-------------|-------------|-------------|-------------|-------------|---------|--------|
| createFile   | 1000         | 0.31        | 0.32        | 0.30        | 0.32        | 0.35        | 0.32    | +0.03  |
| listFiles    | 1000         | 13.18       | 16.32       | 13.56       | 15.96       | 17.86       | 15.38   | +14.89 |
| readFile     | ~ (60s)      | 0.07        | 0.06        | 0.06        | 0.06        | 0.06        | 0.06    | +0.02  |
| readPolicy   | ~ (60s)      | 0.06        | 0.05        | 0.06        | 0.06        | 0.06        | 0.06    | +0.02  |
| updateFile   | 1000         | 0.42        | 0.49        | 0.39        | 0.47        | 0.44        | 0.44    | +0.10  |
| updatePolicy | 1000         | 0.38        | 0.44        | 0.46        | 0.43        | 0.49        | 0.44    | +0.10  |
| deleteFile   | 1000         | 0.45        | 0.41        | 0.46        | 0.54        | 0.39        | 0.45    | +0.09  |

### Average Throughput (TPS)

| Method       | Transactions | Benchmark 1 | Benchmark 2 | Benchmark 3 | Benchmark 4 | Benchmark 5 | Average | Delta  |
|--------------|--------------|-------------|-------------|-------------|-------------|-------------|---------|--------|
| createFile   | 1000         | 17.5        | 17.5        | 17.7        | 17.4        | 17.4        | 17.5    | -0.2   |
| listFiles    | 1000         | 0.4         | 0.3         | 0.4         | 0.3         | 0.3         | 0.3     | -12.1  |
| readFile     | ~ (60s)      | 79.0        | 83.1        | 85.0        | 84.1        | 81.5        | 82.5    | -29.7  |
| readPolicy   | ~ (60s)      | 84.5        | 91.6        | 88.3        | 90.6        | 91.8        | 89.4    | -28.8  |
| updateFile   | 1000         | 12.3        | 10.3        | 15.1        | 11.4        | 12.6        | 12.3    | -4.0   |
| updatePolicy | 1000         | 15.0        | 13.5        | 12.1        | 13.9        | 11.2        | 13.1    | -3.4   |
| deleteFile   | 1000         | 11.5        | 14.6        | 12.8        | 9.7         | 14.7        | 12.7    | -2.9   |