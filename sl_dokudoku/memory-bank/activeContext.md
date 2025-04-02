# Active Context

## Current Focus
- **Strategic Information Gathering:** Implementing the competitive intelligence framework outlined in `epcic_strategy.md`.
- **Market & Competitor Analysis:** Monitoring emerging energy technologies and competitor strategies.
- **Operational Efficiency:** Identifying cost optimization opportunities and technology adoption risks.
- **Integration & Testing:** Implementing key integrations (Mem0, Langfuse, SerpAPI) and comprehensive testing.
- **Performance Optimization:** Monitoring database performance and optimizing queries.
- **Documentation:** Creating comprehensive component, API, and user documentation.

## Recent Changes
- Created `epcic_strategy.md` to centralize competitive intelligence efforts.
- Initiated market monitoring systems to track energy demand forecasts and policy changes.
- Added integration roadmap for:
  - ChatDOC document traceability system
  - LiteLLM unified API gateway
  - Mem0 memory layer
  - Langfuse observability
  - SerpAPI external data integration
  - WordPress AI Assistant plugin
- Created E2E testing infrastructure with Cypress configured in CI/CD pipeline.
- Implemented test coverage monitoring.
- Created initial test cases for memory search and observability.
- Added database connection pool monitoring.
- Implemented database performance analysis tools.
- Added component documentation standards.

## Next Steps
- Develop competitor profiling framework to analyze key players' capabilities and weaknesses.
- Establish technology assessment process to prioritize high-ROI innovations.
- Complete ChatDOC/LiteLLM integration (ETA 2 days)
- Implement Mem0 context layer (ETA 3 days)
- Add Langfuse monitoring (ETA 1 day)
- Integrate SerpAPI external data (ETA 2 days)
- WordPress plugin adaptation (ETA 3 days)
- Complete SerpAPI external data integration (ETA 2 days)
- Finish all E2E test implementations (ETA 2 days)
- Complete component documentation (ETA 1 day)
- Optimize database queries based on performance analysis (ETA 1 day)
- Update user guides (ETA 1 day)

## Active Decisions & Considerations
- **Data Management:** Evaluating centralized data repository solutions for real-time analytics.
- **Collaboration Tools:** Assessing project management platforms for enhanced team efficiency.
- **Testing Strategy:** Using Cypress for E2E testing and React Testing Library for component tests.
- **Documentation Standards:** Component documentation includes props, usage examples, and implementation details.
- **Performance Monitoring:** Implementing custom database monitoring for query analysis.

## Current Focus: Phase 2 - Core Feature Integration
Integrating remaining frontend hooks/mutations, implementing folder/tag/sharing UI interactions, and preparing for batch operations.

## Recent Changes (This Session)

*   **Phase 2.1 (Connect Frontend):**
    *   Integrated `useSearch` hook into `/search` page (including pagination).
    *   Integrated `useUpdateDocument` hook into `DocumentMetadata` for title editing.
    *   Reviewed/prepared `useFolderMutations`, `useTagMutations`, `usePermissionMutations`.
*   **Phase 2.2 (Authentication):**
    *   Verified API route protection (`/api/documents`, `/api/search`, `/api/folders`, `/api/tags`, `/api/share`).
    *   Verified component-level protection in `AppHeader` and `DocumentList`.
*   **Phase 2.3 (Organization UI - Partial):**
    *   Created `useFolders` hook.
    *   Created `FolderTree` component and integrated into `AppSidebar`.
    *   Implemented folder selection via URL parameters (`?folderId=...`).
    *   Created `useTags` hook.
    *   Created basic `TagManager` component and integrated into `DocumentMetadata`.
    *   Verified tag filtering UI (`FilterDialog`) and backend support are present.
*   **Phase 2.4 (Sharing UI):**
    *   Created `usePermissions` hook.
    *   Refactored `ShareModal` to use `useUpsertPermission`, `useRemovePermission`, display existing shares, and handle adding/removing permissions.
*   **Phase 2.5 (Advanced Filtering):**
    *   Verified date range filtering UI (`FilterDialog`) and backend support are present.
*   **Phase 2.6 (Batch Operations - Partial):**
    *   Added checkboxes and selection state to `DocumentTable`.
    *   Added placeholder batch action toolbar to `DocumentTable`.
*   **Phase 3 (Information Extraction - Setup):**
    *   Defined extraction schemas (`src/lib/extractionSchemas.ts`).
    *   Added `ExtractedDatum` model to Prisma schema and migrated DB.
    *   Updated upload API (`/api/upload`) to use GCS and include structure for async Graphlit processing (MCP SDK integration TODO).
    *   Created API endpoint (`/api/documents/[id]/extracted-data`) to fetch extracted data.
    *   Created `useExtractedData` hook and `ExtractedDataDisplay` component.
    *   Integrated `ExtractedDataDisplay` into document detail page.
*   **Document Extraction Service:**
    - Created `DocumentExtractionService` class with `extractInformation` and `getExtractedData` methods
    - Implemented LiteLLM API integration for document processing
    - Added Prisma database operations for storing extracted data
    - Created `useDocumentExtraction` hook for React integration
    - Updated Prisma schema to support extracted data types
    - Resolved type mismatches between Prisma schema and service implementation
*   **Type System Updates:**
    - Updated `ExtractedDatumType` to align with Prisma schema
    - Created `LLMExtractedDatum` and `LLMResponse` interfaces
    - Implemented proper type casting for metadata fields

## Active Decisions
1. Using shadcn/ui components for consistent UI.
2. Using React Query for data management.
3. Using NextAuth.js for authentication.
4. Using Prisma for database interaction.
5. Using URL search parameters for filtering state (folders, tags, dates, etc.).
6. Using Graphlit MCP server for information extraction (via backend SDK).

## Current Considerations
1. Completing Folder/Tag CRUD integration in UI (`FolderTree`, `TagManager`).
2. Implementing Batch Operations (Modals, Hooks, API).
3. Refining RBAC checks (temporarily commented out in `DocumentTable`).
4. Improving error handling and loading states across all new integrations.
5. Addressing TODOs in `ShareModal` (e.g., filtering owner from available users).
6. Addressing potential type mismatches or missing fields as integration continues.
7. Implementing robust background job handling for Graphlit processing.
8. Debugging MCP SDK integration issues in the backend environment.

## Next Steps (Remaining Phase 2 & Initial Phase 3 Tasks)
1.  **Organization UI:** Integrate CRUD mutations into `FolderTree` and `