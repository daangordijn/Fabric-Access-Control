#!/bin/bash
#
# SPDX-License-Identifier: Apache-2.0

# Initialize
set -ev
set -o pipefail

# Setup Environment
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export FABRIC_CFG_PATH="${DIR}/config/"

# Startup Network
cd "${DIR}/test-network/"
./network.sh down
./network.sh up createChannel -ca

# Build Chaincodes
cd "${DIR}/access-chaincode/"
npm run build

cd "${DIR}/demo-chaincode/"
npm run build

# Deploy Chaincodes
cd "${DIR}/test-network/"
./network.sh deployCC -ccn access-control -ccp ${DIR}/access-chaincode -ccl typescript -ccv 1.0 -ccs 1
./network.sh deployCC -ccn ipfs-storage   -ccp ${DIR}/demo-chaincode   -ccl typescript -ccv 1.0 -ccs 1

# Clean Up
rm access-control.tar.gz
rm ipfs-storage.tar.gz