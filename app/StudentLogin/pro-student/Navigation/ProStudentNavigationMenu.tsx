'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import NavigationMenu from '../../../../src/components/global/NavigationMenu';
import { useNotification } from '../../../../src/context/NotificationContext';
import { 
  User, 
  Briefcase, 
  FileText, 
  BookOpen, 
  Calendar, 
  Building, 
  ClipboardCheck,
  Eye
} from 'lucide-react';

const ProStudentNavigationMenu: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname() || '';
  const { resetNotifications } = useNotification();
  
  // Handle logout functionality
  const handleLogout = () => {
    // Reset notifications when logging out
    resetNotifications();
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
      case 'workshops':
        return 'workshops';      case 'assessments':
        return 'assessments';
      case 'companies':
        return 'companies';
      case 'Appointments':
        return 'appointments';
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
          dropdownItems: [
            {
              id: 'my-profile',
              label: 'My Profile',
              onClick: () => router.push('/StudentLogin/pro-student')
            },            {
              id: 'profile-views',
              label: 'Profile Views',
              onClick: () => {
                // Store the profile views state in sessionStorage before navigation
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem('activeNavItem', 'profile');
                }
                router.push('/StudentLogin/pro-student/companies?tab=profileViews');
              }
            }
          ]
        },
        {
          id: 'workshops',
          label: 'Workshops',
          icon: <BookOpen size={18} />,
          onClick: () => router.push('/StudentLogin/pro-student/workshops')
        },
        {
          id: 'companies',
          label: 'Companies',
          icon: <Building size={18} />,
          onClick: () => router.push('/StudentLogin/pro-student/companies')
        },
        {          
          id: 'assessments',
          label: 'Assessments',
          icon: <ClipboardCheck size={18} />,
          onClick: () => router.push('/StudentLogin/pro-student/assessments')
        },
        {
          id: 'internships',
          label: 'Internships',
          icon: <Briefcase size={18} />,
          dropdownItems: [
            {
              id: 'all-internships',
              label: 'All Internships',
              onClick: () => router.push('/StudentLogin/pro-student/internships')
            },
            {
              id: 'internship-requirements',
              label: 'Internship Requirements',
              onClick: () => router.push('/StudentLogin/pro-student/InternshipRequirements')
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
              onClick: () => router.push('/StudentLogin/pro-student/myInternships?tab=applications')
            },
            {
              id: 'current-internships',
              label: 'My Internships',
              onClick: () => router.push('/StudentLogin/pro-student/myInternships?tab=internships')
            },
            {
              id: 'reports-results',
              label: 'Reports Results',
              onClick: () => router.push('/StudentLogin/pro-student/myInternships?tab=reports')
            }
          ]
        },
        {
          id: 'appointments',
          label: 'Appointments',
          icon: <Calendar size={18} />,
          dropdownItems: [
            {
              id: 'my-appointments',
              label: 'My Appointments',
              onClick: () => router.push('/StudentLogin/pro-student/Appointments?tab=my-appointments')
            },
            {
              id: 'appointment-requests',
              label: 'Requests',
              onClick: () => router.push('/StudentLogin/pro-student/Appointments?tab=requests')
            },
            {
              id: 'new-appointment',
              label: 'New Appointment',
              onClick: () => router.push('/StudentLogin/pro-student/Appointments?tab=new-appointment')
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

export default ProStudentNavigationMenu;
