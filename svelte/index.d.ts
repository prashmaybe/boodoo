export interface DisclosureActionOptions {
  defaultOpen?: boolean;
  open?: boolean;
}

export declare function disclosure(node: HTMLElement, options?: DisclosureActionOptions): {
  update(newOptions?: DisclosureActionOptions): void;
  destroy(): void;
};

export declare function tooltip(node: HTMLElement, options?: string | { content: string }): {
  update(newContent?: string | { content: string }): void;
  destroy(): void;
} | undefined;
