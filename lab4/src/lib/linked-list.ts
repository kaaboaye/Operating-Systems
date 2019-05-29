interface DoubleLinkedListNode<T> {
  next: DoubleLinkedListNode<T> | null;
  prev: DoubleLinkedListNode<T> | null;
  value: T;
}

export class DoubleLinkedList<T> {
  private head: DoubleLinkedListNode<T> | null = null;
  private tail: DoubleLinkedListNode<T> | null = null;

  addBegin(value: T): void {
    if (!this.head) {
      this.head = { next: null, prev: null, value };
      this.tail = this.head;
      return;
    }

    const newNode = { next: this.head, prev: null, value };
    this.head.prev = newNode;
    this.head = newNode;
  }

  popTail(): T | undefined {
    if (this.tail === null) {
      return undefined;
    }

    const elem = this.tail;
    if (this.tail === this.head) {
      this.tail = null;
      this.head = null;
      return elem.value;
    }

    this.tail.prev!.next = null;
    this.tail = this.tail.prev;
    return elem.value;
  }

  isEmpty(): boolean {
    return this.tail === null;
  }
}
