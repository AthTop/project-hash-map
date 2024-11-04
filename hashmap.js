import Node from "./node.js";
import LinkedList from "./linked-list.js";

export default class HashMap {
  #capacity;
  #array;
  #length = 0;
  #loadFactor;

  constructor(capacity = 16, loadFactor) {
    this.#capacity = capacity;
    this.#array = new Array(capacity);
    this.#loadFactor = loadFactor;
  }

  // Hashing function
  hash(key) {
    let hashCode = 0;
    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = primeNumber * hashCode + key.charCodeAt(i);
      hashCode = hashCode % this.#capacity;
    }

    return hashCode;
  }

  // Private method to expand the hashmap, utilizing the array from entries()

  #expand() {
    this.#capacity *= 2;
    const entries = this.entries();
    this.#array = new Array(this.#capacity);
    this.#length = 0;
    for (const { key, value } of entries) {
      this.set(key, value);
    }
  }
  // Method to set/update a node in the hashmap. Creates a new node if none exist and sets
  // it as head of a linked list, otherwise it checks the list for an existing key

  set(key, value) {
    if (this.#loadFactor * this.#capacity < this.#length + 1) {
      this.#expand();
    }
    let node = new Node(key, value);
    let hashKey = this.hash(key);
    if (this.#array[hashKey] === undefined) {
      let linkedList = new LinkedList();
      this.#array[hashKey] = linkedList;
      linkedList.append(node);
      this.#length++;
    } else if (this.#array[hashKey].key === key) {
      this.#array[hashKey].value = node.value;
    } else {
      let result = this.#array[hashKey].find(key);
      if (result !== null) {
        this.#array[hashKey].at(result).value = value;
      } else {
        this.#array[hashKey].append(node);
        this.#length++;
      }
    }
  }
  // Checks if hashmap has key and returns its value or null
  get(key) {
    let hashKey = this.hash(key);
    if (this.#array[hashKey] !== undefined) {
      let head = this.#array[hashKey];
      let result = head.find(key);
      return head.at(result).value;
    }
    return null;
  }
  // Checks if hashmap has a key and returns true or false
  has(key) {
    let hashKey = this.hash(key);
    let head = this.#array[hashKey];
    if (head !== undefined) {
      let result = head.contains(key);
      if (result) return true;
      return false;
    }
  }
  // Removes entry, either by removing it from a linked list or by removing the list itself if there's only 1 entry
  remove(key) {
    if (this.has(key)) {
      let hashKey = this.hash(key);
      let head = this.#array[hashKey];
      if (head.find(key) === 0 && head.size() === 1) {
        this.#array[hashKey] = undefined;
      } else {
        head.removeAt().find(key);
      }
      this.#length--;
    }
  }
  // Simply returns the value of the length property
  length() {
    return this.#length;
  }
  // Clear the hashmap by creating a new array of the same capacitiy
  clear() {
    this.#array = new Array(this.#capacity);
  }
  // Loop through the area and traverse each node in it and append the keys to the array, then return it
  keys() {
    let keys = [];
    for (let i = 0; i < this.#array.length; i++) {
      if (this.#array[i] !== undefined) {
        LinkedList.traverse(this.#array[i].head(), (cursor) => {
          keys.push(cursor.key);
        });
      }
    }
    return keys;
  }
  // Similarily to keys, return the values
  values() {
    let values = [];
    for (let i = 0; i < this.#array.length; i++) {
      if (this.#array[i] !== undefined) {
        LinkedList.traverse(this.#array[i].head(), (cursor) => {
          values.push(cursor.value);
        });
      }
    }
    return values;
  }
  // Return key:value pairs
  entries() {
    let entries = [];
    for (let i = 0; i < this.#array.length; i++) {
      if (this.#array[i] !== undefined) {
        LinkedList.traverse(this.#array[i].head(), (cursor) => {
          let { key, value } = cursor;
          entries.push({ key, value });
        });
      }
    }
    return entries;
  }
}
