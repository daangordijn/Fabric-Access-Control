class PolicyCreator {
    static getPolicy(id) {
        if (id === 1) {
            return JSON.stringify(PolicyCreator.getPolicyEquals());
        } else {
            return JSON.stringify(PolicyCreator.getPolicyAndEquals(id));
        }
    }

    static getPolicyEquals() {
        return { type: "EQUALS", name: "hf.EnrollmentID", value: "user2" };
    }

    static getPolicyAndEquals(count) {
        let value = [...Array(count).keys()].map(() => this.getPolicyEquals());
        return { type: "AND", value };
    }
}

module.exports = { PolicyCreator };
