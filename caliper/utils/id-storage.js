class IdStorage {
    static instance = null;

    constructor() {
        this.ids = [];
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new IdStorage();
        }

        return this.instance;
    }

    pop(id) {
        return this.ids.pop();
    }

    push(id) {
        return this.ids.push(id);
    }

    at(index) {
        return this.ids[index];
    }

    size() {
        return this.ids.length;
    }
}

module.exports = { IdStorage };
