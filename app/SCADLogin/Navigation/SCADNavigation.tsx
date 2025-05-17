'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import NavigationMenu, { MenuItem } from '../../../src/components/global/NavigationMenu';
import { useNotification } from '../../../src/context/NotificationContext';
import {
  Building,
  Users,
  FileText,
  Settings,
  ClipboardCheck,
  Briefcase,
  Calendar,
  BarChart2,
  BookOpen
} from 'lucide-react';

// Define allowed menu item IDs matching SCAD dashboard
export type ActiveMenuItem = 'companies' | 'students' | 'reports' | 'settings' | 'evaluations' | 'internships' | 'appointments' | 'statistics' | 'workshops';

interface SCADNavigationProps {
  activeItem: ActiveMenuItem;
  onLogout: () => void;
}

const SCADNavigation: React.FC<SCADNavigationProps> = ({ activeItem, onLogout }) => {
  const router = useRouter();
  const { resetNotifications } = useNotification();
  
  // Wrap the onLogout function to reset notifications before calling the original
  const handleLogoutWithReset = () => {
    resetNotifications();
    onLogout();
  };
  
  const items: MenuItem[] = [
    { id: 'companies', label: 'Companies', icon: <Building size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=companies') },
    { id: 'students', label: 'Students', icon: <Users size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=students') },
    { id: 'reports', label: 'Reports', icon: <FileText size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=reports') },
    { id: 'evaluations', label: 'Evaluations', icon: <ClipboardCheck size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=evaluations') },
    { id: 'internships', label: 'Internships', icon: <Briefcase size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=internships') },
    { id: 'statistics', label: 'Statistics', icon: <BarChart2 size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=statistics') },
    { id: 'workshops', label: 'Workshops', icon: <BookOpen size={18} />, onClick: () => router.push('/SCADLogin/workshops?activeItem=workshops') },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: <Calendar size={18} />, 
      dropdownItems: [
        { id: 'my-appointments', label: 'My Appointments', onClick: () => router.push('/SCADLogin/AppointmentsSCAD?tab=my-appointments') },
        { id: 'requests', label: 'Requests', onClick: () => router.push('/SCADLogin/AppointmentsSCAD?tab=requests') },
        { id: 'new-appointment', label: 'New Appointment', onClick: () => router.push('/SCADLogin/AppointmentsSCAD?tab=new-appointment') }
      ]
    },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=settings') }
  ];
  return (
    <NavigationMenu
      items={items}
      activeItemId={activeItem}
      logo={{ src: '/logos/GUCInternshipSystemLogo.png', alt: 'GUC Internship System' }}
      variant="navigation"
      onLogout={handleLogoutWithReset}
    />
  );
};

export default SCADNavigation;
