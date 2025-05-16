import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import NavigationMenu from '../global/NavigationMenu';
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
  const pathname = usePathname();
  
  // Handle logout functionality
  const handleLogout = () => {
    // You could add any cleanup logic here, like clearing local storage or cookies
    
    // Navigate to the login page
    router.push('/');
  };
  
  // Determine active item based on current path
  const getActiveItemId = (): string => {
    if (pathname?.includes('/StudentLogin/pro-student/StudentProfile')) {
      return 'profile';
    } else if (pathname?.includes('/internships')) {
      return 'internships';
    } else if (pathname?.includes('/myInternships')) {
      return 'my-internships';
    } else if (pathname?.includes('/workshops')) {
      return 'workshops';
    } else if (pathname?.includes('/Assessment')) {
      return 'assessment';
    } else if (pathname?.includes('/companies')) {
      return 'companies';
    } else if (pathname?.includes('/Appointment')) {
      return 'appointments';
    }
    
    // Default to profile if we can't determine
    return 'profile';
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
              onClick: () => router.push('/StudentLogin/pro-student/StudentProfile')
            },
            {
              id: 'profile-views',
              label: 'Profile Views',
              onClick: () => router.push('/StudentLogin/pro-student/StudentProfile/views')
            }
          ]
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
              onClick: () => router.push('/StudentLogin/pro-student/myInternships/applications')
            },
            {
              id: 'current-internships',
              label: 'My Internships',
              onClick: () => router.push('/StudentLogin/pro-student/myInternships')
            },
            {
              id: 'reports-results',
              label: 'Reports Results',
              onClick: () => router.push('/StudentLogin/pro-student/myInternships/reports')
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
        },
        {
          id: 'companies',
          label: 'Companies',
          icon: <Building size={18} />,
          onClick: () => router.push('/StudentLogin/pro-student/companies')
        },
        {
          id: 'assessment',
          label: 'Assessment',
          icon: <ClipboardCheck size={18} />,
          onClick: () => router.push('/StudentLogin/pro-student/Assessment')
        }
      ]}
      activeItemId={getActiveItemId()}
      logo={{
        src: '/logos/GUCInternshipSystemLogo.png',
        alt: 'GUC Internship System',
        width: 250,
        height: 50      }}
      variant="navigation"
      onLogout={handleLogout}
    />
  );
};

export default ProStudentNavigationMenu;
