'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import NavigationMenu from '../../../../src/components/global/NavigationMenu';
import { 
  User, 
  Briefcase, 
  FileText, 
  Building, 
} from 'lucide-react';

const StudentNavigationMenu: React.FC = () => {
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
    if (typeof window !== 'undefined' && sessionStorage.getItem('activeNavItem') === 'profile') {
      // Clear it after reading to ensure it's only used once
      sessionStorage.removeItem('activeNavItem');
      return 'profile';
    }
    
    // Special case for profile views in companies page
    if (lastSegment === 'companies' && activeTabParam === 'profileViews') {
      return 'profile';
    }
    
    // Otherwise match based on the path
    switch (lastSegment) {
      case 'internships':
        return 'internships';
      case 'InternshipRequirements':
        return 'internships';
      case 'myInternships':
        return 'my-internships';
      case 'companies':
        return 'companies';
      default:
        // If no specific tab or it's any other tab, return profile
        return 'profile';
    }
  };

  return (
    <NavigationMenu
      items={[
        {
          id: 'profile',
          label: 'Profile',
          icon: <User size={18} />,
          onClick: () => router.push('/StudentLogin/student')
        },
        {
          id: 'companies',
          label: 'Companies',
          icon: <Building size={18} />,
          onClick: () => router.push('/StudentLogin/student/companies')
        },
        {
          id: 'internships',
          label: 'Internships',
          icon: <Briefcase size={18} />,
          dropdownItems: [
            {
              id: 'all-internships',
              label: 'All Internships',
              onClick: () => router.push('/StudentLogin/student/internships')
            },
            {
              id: 'internship-requirements',
              label: 'Internship Requirements',
              onClick: () => router.push('/StudentLogin/student/InternshipRequirements')
            }
          ]
        },
        {
          id: 'my-internships',
          label: 'My Internships',
          icon: <FileText size={18} />,
          dropdownItems: [
            {
              id: 'my-applications',
              label: 'My Applications',
              onClick: () => router.push('/StudentLogin/student/myInternships?tab=applications')
            },
            {
              id: 'current-internships',
              label: 'My Internships',
              onClick: () => router.push('/StudentLogin/student/myInternships?tab=internships')
            },
            {
              id: 'reports-results',
              label: 'Reports Results',
              onClick: () => router.push('/StudentLogin/student/myInternships?tab=reports')
            }
          ]
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

export default StudentNavigationMenu;
