## Using the DashboardTab Component

The `DashboardTab` component is a reusable navigation component that can be used to create consistent tab interfaces across different pages in your application.

### Import the Component

```tsx
import DashboardTab from "../../src/components/global/DashboardTab";
```

### Basic Usage

```tsx
<DashboardTab
  tabs={[
    { id: "tab1", label: "Tab 1" },
    { id: "tab2", label: "Tab 2" },
    { id: "tab3", label: "Tab 3" },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

### With Tab Counters

```tsx
<DashboardTab
  tabs={[
    { id: "tab1", label: "Tab 1", count: 5 },
    { id: "tab2", label: "Tab 2", count: 10 },
    { id: "tab3", label: "Tab 3" },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

### With Custom Styling

```tsx
<DashboardTab
  tabs={[
    { id: "tab1", label: "Tab 1" },
    { id: "tab2", label: "Tab 2" },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  className="custom-tabs-class"
/>
```

### Props

- `tabs`: An array of tab items, each with:
  - `id`: Unique identifier for the tab
  - `label`: Text or JSX element to display
  - `count` (optional): Number to show in badge
- `activeTab`: The ID of the currently active tab
- `onTabChange`: Function called when a tab is clicked
- `className` (optional): Additional CSS class name

### With TypeScript

If using TypeScript with string literals for tab IDs:

```tsx
type MyTabType = "home" | "profile" | "settings";

const [activeTab, setActiveTab] = useState<MyTabType>("home");

// In render:
<DashboardTab
  tabs={[
    { id: "home", label: "Home" },
    { id: "profile", label: "Profile" },
    { id: "settings", label: "Settings" },
  ]}
  activeTab={activeTab}
  onTabChange={(tabId) => setActiveTab(tabId as MyTabType)}
/>;
```

## UI Hierarchy Guidelines

To maintain consistent UI hierarchy across pages, follow these implementation guidelines:

### Correct Page Structure

```jsx
<div className={styles.pageContainer}>
  {/* Header/Navigation */}
  <Navigation title="Page Title" />
  
  <div className={styles.contentWrapper}>
    {/* Filter Sidebar - Show for all tabs */}
    <FilterSidebar
      filters={getFormattedFilters()}
      onFilterChange={handleFilterChange}
    />

    {/* Main Content */}
    <main className={styles.mainContent}>
      {/* Tab Navigation */}
      <DashboardTab
        tabs={[
          { 
            id: 'tab1', 
            label: 'Tab 1',
            count: countForTab1
          },
          { 
            id: 'tab2', 
            label: 'Tab 2',
            count: countForTab2
          }
        ]}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId)}
        className={styles.dashboardTabs}
      />
      
      {/* Tab Content */}
      {activeTab === 'tab1' && (
        <div className={styles.tabContent}>
          {/* Content for Tab 1 */}
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            placeholder="Search..."
          />
          {/* Rest of tab content */}
        </div>
      )}
    </main>
  </div>
</div>
```

### CSS Styling

Add this CSS to your page's module CSS file for consistent styling:

```css
/* Enhanced DashboardTab styling */
.dashboardTabs {
  margin-bottom: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  background: linear-gradient(to bottom, #ffffff, #f8fafd);
  border-bottom: 1px solid #e0e7ef;
  width: 100%;
}

/* Additional active tab styling */
.dashboardTabs :global(.active) {
  position: relative;
  font-weight: 600;
  background-color: rgba(2, 132, 199, 0.08);
}

.dashboardTabs :global(.active)::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: #0284c7;
  border-radius: 3px 3px 0 0;
}

/* No Results Section */
.noResults {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  text-align: center;
  background-color: #f9fafb;
  border-radius: 12px;
  border: 1px dashed #e0e0e0;
  margin: 20px 0;
}

.noResultsIcon {
  font-size: 32px;
  margin-bottom: 16px;
  color: #94a3b8;
}
```

### Key Implementation Points

1. **DashboardTab Inside Main Content**: Place the DashboardTab component inside the main content area, not outside it.
2. **Single FilterSidebar**: Use only one FilterSidebar component that changes its filters based on the active tab.
3. **Consistent Styling**: Apply the `dashboardTabs` class for consistent visual appearance.
4. **"No Results" Styling**: Use consistent styling for empty states across all pages.
