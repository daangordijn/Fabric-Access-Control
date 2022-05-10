#!/bin/bash
#
# SPDX-License-Identifier: Apache-2.0

# Initialize
set -ev
set -o pipefail

# Setup Environment
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export FABRIC_CFG_PATH="${DIR}/config"

# Teardown Network
cd "${DIR}/test-network/"
./network.sh down