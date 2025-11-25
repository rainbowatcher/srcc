# SRCC (Source Compare)

[![Visual Studio Code Extension](https://img.shields.io/badge/VSCode-Extension-blue.svg)](https://marketplace.visualstudio.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Visual Studio Code extension that enables quick source code comparison using simple `.srcc` files. Compare two files side-by-side with automatic diff view opening and syntax highlighting support.

## Features

### 🚀 Quick File Comparison

- **Simple File Format**: Create `.srcc` files with just two file paths (one per line)
- **Automatic Path Resolution**: Supports both absolute and relative paths
- **Intelligent File Detection**: Automatically detects and validates file existence

### ⚙️ Smart Configuration

- **Auto-Open Diff**: Automatically open diff view when `.srcc` files are opened (configurable)
- **Error Handling**: Clear error messages for invalid paths or missing files

## Requirements

- **VS Code Version**: 1.106.1 or higher
- **Node.js**: No additional Node.js dependencies required for end users
- **File System Access**: Extension needs to read file paths and open files for comparison

## Installation

### From VS Code Marketplace

1. Open Visual Studio Code
2. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "SRCC"
4. Click Install

### From Source (Development)

```bash
# Clone the repository
git clone https://github.com/rainbowatcher/srcc.git
cd srcc

# Install dependencies
npm install

# Compile the extension
npm run compile

# Install the extension locally
code --install-extension srcc-<version>.vsix
```

### Manual Installation (VSIX File)

1. Download the `.vsix` file from the releases page
2. In VS Code: Extensions → Install from VSIX...
3. Select the downloaded `.vsix` file

## Usage

### Creating a Comparison File

1. Create a new file with `.srcc` extension (e.g., `comparison.srcc`)
2. Write two file paths, one per line:

```
/path/to/left-file.js
/path/to/right-file.js
```

Or using relative paths:

```
./src/old-version.js
./src/new-version.js
```

3. Save the file - the diff view opens automatically (if auto-open is enabled)

### Supported Path Formats

#### Absolute Paths

```
/Users/username/project/src/file1.js
/Users/username/project/src/file2.js
```

#### Relative Paths

```
./src/feature-a.js
./src/feature-b.js
```

## Extension Settings

This extension contributes the following settings:

### `srcc.autoOpenDiff`

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Automatically open the diff view when opening `.srcc` files

To modify this setting:

1. Open VS Code User Settings (`Ctrl+,` / `Cmd+,`)
2. Search for "srcc"
3. Toggle the `Auto Open Diff` setting

Or add to your `settings.json`:

```json
{
  "srcc.autoOpenDiff": false
}
```

## Examples

### Basic Comparison

```
hello.js
world.js
```

### Feature Branch Comparison

```
./src/main-branch.js
./src/feature-branch.js
```

### Configuration Files

```
config/production.json
config/development.json
```

## File Format Specification

### SRCC File Structure

- **Line 1**: Path to the left/base file (displayed on the left side in diff)
- **Line 2**: Path to the right/comparison file (displayed on the right side in diff)

### Path Resolution

- **Absolute paths**: Used as-is
- **Relative paths**: Resolved relative to the `.srcc` file's directory
- **File validation**: Both files must exist before opening diff view

## Troubleshooting

### Common Issues

**"File does not exist" error**

- Ensure file paths are correct and accessible
- Check if files exist at the specified locations
- Verify read permissions for the files

**Diff view not opening**

- Check the `srcc.autoOpenDiff` setting is enabled
- Verify both files exist and are readable
- Try manually opening files first to ensure VS Code can access them

**Syntax highlighting not working**

- Ensure the file has `.srcc` extension
- Check VS Code language mode is set to "Source Compare"
- Try reloading the window (`Ctrl+Shift+P` → "Developer: Reload Window")

## Contributing

We welcome contributions to improve the SRCC extension!

### Development Setup

```bash
# Clone and setup
git clone https://github.com/your-repo/srcc-vscode-extension.git
cd srcc-vscode-extension
npm install

# Development
npm run build      # Build TypeScript
npm run watch      # Watch for changes

# Testing
# Open test files in VS Code and verify functionality
```

### Adding Tests

Add `.srcc` test files to the `test/` directory following the naming pattern `test*.srcc`.

### Publishing

1. Update version in `package.json`
2. Build and test the extension
3. Create a new release on GitHub
4. Publish to VS Code Marketplace using `vsce publish`

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/srcc-vscode-extension/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/srcc-vscode-extension/discussions)

---
