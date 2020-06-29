export default class MemoryStorage implements Storage {

  public clear(): void {
  }

  public getItem(key: string): string | null {
    return Memory[key];
  }

  public key(index: number): string | null {
    return null;
  }

  public removeItem(key: string): void {
    delete Memory[key];
  }

  public setItem(key: string, value: string): void {
    Memory[key] = value;
  }

  public readonly length: number = 0;

}
