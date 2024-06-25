import React from "react";

class HashTable {
    constructor() {
        this.table = new Array(10);
        this.size = 0;
    }

    _setKey(key) { // later switch to allowing user input hashing?
        return key % 10;
    }

    insert(value) {
        const index = this._setKey(value);
        this.table[index] = value;
        this.size++;
    }

    get(key) {
        const target = this._setKey(key);
        return this.table[target];
    }

    search(value) {
        const index = this._setKey(value);
        if(this.table[index] == value)
            console.log("Value found at index ", index);
        else
            console.log("Not found");
    }

    delete(key) {
        const index = this._setKey(value);
        if(this.table[index]) {
            this.table[index] = [];
            this.size--;
            return true;
        }
        else return false;
    }
}