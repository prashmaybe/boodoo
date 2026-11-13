# Boodoo Model Context Protocol (MCP) Server

The official, zero-dependency MCP server for the **Boodoo Framework**. It enables AI coding assistants (Claude Desktop, Cursor, Roo-Code, Cline, Antigravity) to query real-time component documentation, inspect design tokens, and retrieve runnable code examples.

## Features & Tools

- `search_components`: Search Boodoo components by name, keyword, or UI category.
- `get_component_docs`: Inspect full component specs, CSS classes, and WCAG accessibility standards.
- `get_component_example`: Retrieve complete runnable code samples across Vanilla JS, React, Vue, and React Native.
- `search_utilities`: Search spacing, flexbox, CSS grid, and elevation utilities.
- `get_design_tokens`: Access universal color palettes, spacing scales, border radii, and shadows.
- `get_installation_guide`: Retrieve verified setup and package instructions for npm, CDN, React, Vue, or React Native.

## Usage & Deployment Scope

The MCP server is a **repository-level developer tool** designed for development workspaces and cloned repositories (e.g., git clones or monorepos). Because it requires direct access to source component catalogues (`docs/ai/component-index.json`), design tokens (`tokens/tokens.json`), and framework examples (`examples/`), it is hosted directly in the repository under `mcp/server.mjs` and intentionally omitted from the published npm runtime tarball to preserve package lightness and zero-runtime-dependency hygiene.

To launch the MCP server in your local repository or cloned workspace:

```bash
node mcp/server.mjs
```

## Adding to Claude Desktop

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "boodoo": {
      "command": "node",
      "args": ["<PATH_TO_BOODOO_REPO>/mcp/server.mjs"]
    }
  }
}
```

## Adding to Cursor or Cline

In your project workspace MCP settings or `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "boodoo": {
      "command": "node",
      "args": ["./mcp/server.mjs"]
    }
  }
}
```

