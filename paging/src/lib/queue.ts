import { DoubleLinkedList } from "./linked-list";

export class Queue<T> {
  private readonly list = new DoubleLinkedList<T>();

  enqueue(value: T): this {
    this.list.addBegin(value);
    return this;
  }

  dequeue(): T | undefined {
    return this.list.popTail();
  }

  isEmpty(): boolean {
    return this.list.isEmpty();
  }
}
