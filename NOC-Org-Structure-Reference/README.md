# NOC Org Structure Reference — EDGE AMS

This bundle contains the NOC AMS implementation files relevant to the **Team / Organization Structure** experience, extracted from the NOC AMS Control Tower source.

## Primary Org Structure files

- `src/pages/operations/TeamStructurePage.tsx` — main Team Structure / organization implementation
- `src/pages/operations/TeamOverviewLandingPage.tsx` — Team Overview landing/navigation pattern
- `src/pages/operations/ResourceRoster.tsx` — resource roster used alongside the structure

## Supporting data / interaction files

- `src/data/master-employees.ts` — master employee/resource model and calculations
- `src/data/resourceMobilization.ts` — resource mobilization/reference data
- `src/data/annex1-team.ts` — contracted team baseline / team statistics used by Team Structure
- `src/data/mockDataStore.tsx` — NOC state/data-store pattern used by the workforce modules
- `src/components/common/EmployeeDetailModal.tsx` — employee/resource detail interaction
- `src/components/navigation/SubPageHeader.tsx` — sub-page navigation/header used by Team Structure

## Important

These files are provided as **read-only functional/reference material for EDGE AMS**.

Do NOT copy NOC branding, NOC employee identities, NOC-specific business rules, or NOC-specific terminology into EDGE.

Use them to understand:

- organization hierarchy
- team structure presentation
- tower/department roll-ups
- leadership/resource relationships
- resource drill-down
- employee detail interaction
- workforce KPIs
- organization/resource navigation

For EDGE, the existing EDGE Resource Master must remain the canonical source of personnel/resource data.
