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
