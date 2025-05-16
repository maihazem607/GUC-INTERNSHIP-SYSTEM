// 'use client';
// import React from 'react';
// import { useRouter } from 'next/navigation';
// import NavigationMenu, { MenuItem } from '../../../src/components/global/NavigationMenu';
// import {
//   Building,
//   Users,
//   FileText,
//   Settings,
//   ClipboardCheck,
//   Briefcase,
//   Calendar,
//   BarChart2,
//   BookOpen
// } from 'lucide-react';

// // Define allowed menu item IDs matching SCAD dashboard
// export type ActiveMenuItem = 'internships' | 'applications' | 'interns' | 'scad-internships'; 

// interface CompanyNavigationProps {
//   activeItem: ActiveMenuItem;
//   onActiveItemChange: (itemId: ActiveMenuItem) => void;
//   onLogout: () => void;
// }

// const CompanyNavigation: React.FC<CompanyNavigationProps> = ({ activeItem, onActiveItemChange, onLogout }) => {  const router = useRouter();
//   const items: MenuItem[] = [
//     { id: 'internships', label: 'Internship Posts', icon: <Building size={18} />, onClick: () => router.push('/CompanyLogin/CompanyInternships') },
//     { id: 'applications', label: 'Applications', icon: <Users size={18} />, onClick: () => router.push('/CompanyLogin/Applications') },
//     { id: 'interns', label: 'Current Interns', icon: <FileText size={18} />, onClick: () => router.push('/CompanyLogin/Interns') },
//     { id: 'scad-internships', label: 'SCAD Internships', icon: <ClipboardCheck size={18} />, onClick: () => router.push('/CompanyLogin/internships') },
//   ];

//   return (
//     <NavigationMenu
//       items={items}
//       activeItemId={activeItem}
//       logo={{ src: '/logos/GUCInternshipSystemLogo.png', alt: 'GUC Internship System' }}
//       variant="navigation"
//       onLogout={onLogout}
//     />
//   );
// };

// export default CompanyNavigation;

'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import NavigationMenu from '../../../src/components/global/NavigationMenu';
import { 
  User, 
  Briefcase, 
  FileText, 
  Building, 
} from 'lucide-react';

const CompanyNavigationMenu: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname() || '';
  
  // Handle logout functionality
  const handleLogout = () => {
    router.push('/');
  };
    
  // Determine active item based on current path
  const getActiveItemId = (): string => {
    // Extract path segments for more precise matching
    const segments = pathname.split('/').filter(segment => segment);
    const lastSegment = segments[segments.length - 1];
    
    // Get URL parameters (if any)
    let tabParam = null;
    const hasParams = pathname.includes('?');
    
    if (hasParams) {
      const searchParamsString = pathname.split('?')[1];
      const searchParams = new URLSearchParams(searchParamsString);
      tabParam = searchParams.get('tab');
    }
    
    // Check directly from window.location for client-side navigation
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const urlTabParam = urlParams ? urlParams.get('tab') : null;
    
    // Use either source for the tab parameter
    const activeTabParam = tabParam || urlTabParam;
      // Check for stored navigation state in sessionStorage (handles immediate UI updates)
    if (typeof window !== 'undefined' && sessionStorage.getItem('activeNavItem') === 'internships') {
      // Clear it after reading to ensure it's only used once
      sessionStorage.removeItem('activeNavItem');
      return 'internships';
    }
    
      // Otherwise match based on the path
    switch (lastSegment) {
      case 'CompanyInternships':
        return 'internships';
      case 'Applications':
        return 'applications';
      case 'Interns':
        return 'interns';
      case 'internships':
        return 'scad-internships';
      default:
        // If no specific path or it doesn't match any case, return '' so no tab is active by default
        return '';
    }
  };

  return (
    <NavigationMenu
      items={[
        {
          id: 'internships',
          label: 'Internship Posts',
          icon: <User size={18} />,
          onClick: () => router.push('/CompanyLogin/CompanyInternships')
        },
        {
          id: 'applications',
          label: 'Applications',
          icon: <Building size={18} />,
          onClick: () => router.push('/CompanyLogin/Applications')
        },
        {
          id: 'interns',
          label: 'Interns',
          icon: <Briefcase size={18} />,
            onClick: () => router.push('/CompanyLogin/Interns')
        },
        {
          id: 'scad-internships',
          label: 'SCAD Internships',
          icon: <FileText size={18} />,
         onClick: () => router.push('/CompanyLogin/internships')
        }
      ]}
      activeItemId={getActiveItemId()}
      logo={{
        src: '/logos/GUCInternshipSystemLogo.png',
        alt: 'GUC Internship System',
        width: 250,
        height: 150      }}
      variant="navigation"
      onLogout={handleLogout}
    />
  );
};

export default CompanyNavigationMenu;
