# Salsabeela Server Architecture

```mermaid
graph TD
    subgraph Local Files
        XML[quran-uthmani.xml]
        TXT[quranic-corpus-morphology-0.4.txt]
    end

    subgraph Salsabeela Server (Node.js)
        direction LR
        LOAD[Data Loading\n(fs, XMLParser)]
        MEM[In-Memory Data\n- quranData (Map)\n- rootIndex (Map)\n- lemmaIndex (Map)\n- verseMorphology (Map)\n- ayahTextIndex (FlexSearch)]
        TOOL_LOGIC[Tool Logic\n(executeMcpTool)]
        MCP[MCP Interface\n(Stdio)]
        HTTP[HTTP API Server\n(Express on Port 3001)]
        FC_SDK[Firecrawl SDK Client]

        LOAD --> MEM;
        TOOL_LOGIC --> MEM;
        MCP --> TOOL_LOGIC;
        HTTP -- /api/tool/* --> TOOL_LOGIC;
        HTTP -- /api/research --> TOOL_LOGIC;
        TOOL_LOGIC -- firecrawl-research --> FC_SDK;

    end

    subgraph Clients
        CLINE[Cline (via VS Code)]
        WEBAPP[salsabeela-webapp\n(Browser)]
    end

    subgraph External Services
        FC_API[Firecrawl API]
    end

    XML --> LOAD;
    TXT --> LOAD;
    CLINE <-.-> MCP;
    WEBAPP <-.-> HTTP;
    FC_SDK --> FC_API;

    style "Salsabeela Server (Node.js)" fill:#f9f,stroke:#333,stroke-width:2px
    style "Local Files" fill:#ccf,stroke:#333,stroke-width:1px
    style Clients fill:#cfc,stroke:#333,stroke-width:1px
    style "External Services" fill:#fcc,stroke:#333,stroke-width:1px

```

**Explanation:**

1.  **Local Files:** The server reads the Quran text (`.xml`) and morphology data (`.txt`) from the local filesystem during startup.
2.  **Salsabeela Server (Node.js):**
    *   **Data Loading:** Parses the local files.
    *   **In-Memory Data:** Stores the parsed Quran text, morphology (roots, lemmas, POS tags), and creates a FlexSearch index for efficient text searching.
    *   **Tool Logic:** Contains the functions that implement the core logic for each tool (`get-ayah`, `search-arabiyan`, `search-exact-phrase`, `firecrawl-research`, etc.), accessing the in-memory data or the Firecrawl SDK.
    *   **MCP Interface:** Communicates with Cline (via VS Code) using the Model Context Protocol over stdio.
    *   **HTTP API Server:** Runs an Express server on port 3001, exposing endpoints (`/api/tool/*`, `/api/research`) for the web application frontend.
    *   **Firecrawl SDK Client:** Used by the `firecrawl-research` tool logic to interact with the external Firecrawl API.
3.  **Clients:**
    *   **Cline:** Interacts with the server's tools via the MCP interface.
    *   **salsabeela-webapp:** Interacts with the server via its HTTP API endpoints.
4.  **External Services:**
    *   **Firecrawl API:** Called by the server when the `firecrawl-research` tool is invoked.
