export interface SolidDisclosureOptions {
  defaultOpen?: boolean;
}

export interface SolidDisclosureReturn {
  isOpen(): boolean;
  open(): void;
  close(): void;
  toggle(): void;
  subscribe(fn: (open: boolean) => void): () => void;
}

export declare function createDisclosure(options?: SolidDisclosureOptions): SolidDisclosureReturn;
