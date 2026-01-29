# Jacky Daniel's Claude Code Marketplace

Personal marketplace of MCP servers for Claude Code.

## Available Plugins

### Chrome DevTools

Wrapper for the Chrome DevTools MCP Server providing browser automation, debugging, and performance analysis tools.

**Features:**

- Browser automation (navigate, click, fill forms)
- Screenshots and PDF generation
- Console logs and network monitoring
- Performance profiling
- Device emulation

**Configuration:**

- Port: 9222 (Chrome DevTools Protocol)
- Telemetry: Disabled (`--no-usage-statistics`)

## Installation

```bash
# Add this marketplace
/plugin marketplace add https://github.com/YOUR_USERNAME/claude-code-marketplace

# Install the Chrome DevTools plugin
/plugin install chrome-devtools@jackydanielsky

# Enable the plugin
# Add to ~/.config/claude/settings.json:
# "chrome-devtools@jackydanielsky": true
```

## Prerequisites

- Chrome browser with remote debugging enabled on port 9222
- Or Chrome launched with: `google-chrome --remote-debugging-port=9222`

## License

MIT
