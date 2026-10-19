# Security Policy

## Supported Versions

The Boodoo project team actively maintains and releases security patches for the versions listed below.

| Version | Supported          | Security Fixes Window |
| ------- | ------------------ | --------------------- |
| 1.1.x   | :white_check_mark: | Active support        |
| 1.0.x   | :white_check_mark: | Critical patches only |
| < 1.0.0 | :x:                | End of life           |

## Reporting a Vulnerability

We take the security of Boodoo and all downstream applications built with it very seriously. If you identify a security vulnerability, we request that you report it responsibly.

### How to Report Privately

1. **Do not** open a public GitHub issue or discussion for an unpatched vulnerability.
2. Email your findings directly to the maintainers at **security@boodooframework.com** or submit an advisory via GitHub Security Advisories at [github.com/prashmaybe/boodoo/security/advisories](https://github.com/prashmaybe/boodoo/security/advisories).
3. Include the following details to assist rapid triage:
   - Type of vulnerability (e.g. XSS, unsafe DOM interpolation, prototype pollution, CSS injection).
   - Component, file path, or entry point affected (e.g. `js/src/components/`, `tokens/index.cjs`).
   - Step-by-step reproduction instructions or a minimal test case demonstrating the exploit.
   - Any proposed fix or mitigation steps if you have them.

### Response Timelines & SLA

- **Acknowledgment:** Within 48 hours of initial receipt.
- **Triage & Severity Assessment:** Within 5 business days.
- **Remediation & Patch Release:** Target release of a fix within 14 business days of confirmation, with CVE publication and release notes acknowledging your contribution (unless you request anonymity).

## Secure Design Principles

Boodoo enforces built-in security constraints across its codebase:
- **DOM XSS Prevention:** Dynamic elements are created via safe DOM methods (`document.createElement()`, `element.textContent`, `element.setAttribute()`). Raw user input strings are never concatenated directly into `innerHTML` or evaluated as JavaScript.
- **Navigation Scheme Whitelist:** Programmatic redirect handlers (e.g. Command Palette item activation) enforce strict protocol allowlists (`https:`, `http:`, `/`, `#`, `mailto:`) and prohibit `javascript:` and `data:` schemes.
- **Zero DOM in React Native:** Mobile modules (`react-native/`) rely solely on native primitives and never call unescaped DOM evaluation methods.
- **Zero Dependency Core:** The production runtime has zero third-party runtime npm dependencies, eliminating supply-chain exposure in client bundles.
