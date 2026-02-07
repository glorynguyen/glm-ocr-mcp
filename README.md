# GLM-OCR MCP Server

A Model Context Protocol (MCP) server that provides local OCR capabilities using the **GLM-OCR** model via **Ollama**. This server enables AI assistants (like Claude Desktop or VS Code with Continue) to extract text, tables, and mathematical formulas from images locally.

## 🌟 Features

- 📝 **Text Extraction**: Convert images into clean Markdown text.
- 📊 **Table Recovery**: Preserve complex table structures in Markdown format.
- 🧮 **Math Support**: Automatically convert mathematical formulas to LaTeX.
- 🖼️ **Broad Support**: Works with PNG, JPG, and other standard image formats.
- 🔧 **Privacy-Focused**: Local processing via Ollama (no cloud dependencies).

## 📋 Prerequisites

1.  [Node.js](https://nodejs.org/) (v18 or higher)
2.  [Ollama](https://ollama.com/) installed and running
3.  The GLM-OCR model pulled in Ollama:

```bash
ollama pull glm-ocr
```

## 🚀 Quick Start (via npx)

You can run this server directly without cloning the repository by using `npx`.

### ⚙️ Configuration

#### Claude Desktop
Add the following to your Claude Desktop configuration file:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "glm-ocr": {
      "command": "npx",
      "args": ["-y", "@vinhnguyen/glm-ocr-mcp"],
      "env": {}
    }
  }
}
```

---

#### Continue.dev (VS Code / JetBrains)
Add this to your `config.json` (usually found at `~/.continue/config.json` or `~/.continue/config.yaml`):

```json
{
  "mcpServers": {
    "glm-ocr": {
      "command": "npx",
      "args": ["-y", "@vinhnguyen/glm-ocr-mcp"],
      "env": {},
      "description": "GLM-OCR document processing via Ollama",
      "timeout": 120
    }
  }
}
```

---

## 🛠️ Usage

Once configured and Ollama is running, your AI assistant will have a new tool called `ocr_document`. You can use natural language to trigger it:

- "Extract the text from this screenshot: `/path/to/image.png`"
- "Read the table in `/Users/me/Downloads/invoice.jpg` and format it as markdown."
- "What is the math formula in this image? `/path/to/notes.png`"

### How It Works
1.  The assistant sends a local image path to the server.
2.  The server validates the file and converts it to base64.
3.  It communicates with your local **Ollama** instance using the `glm-ocr` model.
4.  The extracted content is returned directly into your chat.

## 📂 Manual Installation (For Development)

If you want to modify the server or run it from source:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/vinhnguyen/glm-ocr-mcp.git
    cd glm-ocr-mcp
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run locally for testing:**
    ```bash
    npm start
    ```

## ❓ Troubleshooting

### Error: "Ollama connection refused"
Ensure Ollama is running in your system tray or run `ollama serve` in a terminal.

### Error: "model 'glm-ocr' not found"
Run `ollama pull glm-ocr` to download the specific OCR model.

### Timeout Issues
OCR processing is GPU/CPU intensive. If the process times out, ensure your configuration has a `timeout` value of at least `120` seconds.

## 📄 License
ISC

## ✨ Acknowledgments
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Ollama](https://ollama.com/)
- [GLM-OCR Model](https://github.com/THUDM/GLM-4)

---

### ⚠️ Note for Publishing
If this is your first time publishing this scoped package to NPM, remember to use the public access flag:
```bash
npm publish --access public
```