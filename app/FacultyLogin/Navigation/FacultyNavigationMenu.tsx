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

export type ActiveMenuItem =  'reports' |  'evaluations' |  'statistics' ;

interface FacultyNavigationProps {
  activeItem: ActiveMenuItem;
  onActiveItemChange: (itemId: ActiveMenuItem) => void;
  onLogout: () => void;
}

const FacultyNavigation: React.FC<FacultyNavigationProps> = ({ activeItem, onActiveItemChange, onLogout }) => {
  const router = useRouter();
  const { resetNotifications } = useNotification();
  
  // Wrap the onLogout function to reset notifications before calling the original
  const handleLogoutWithReset = () => {
    resetNotifications();
    onLogout();
  };
  
  const items: MenuItem[] = [
    { id: 'reports', label: 'Reports', icon: <FileText size={18} />, onClick: () => onActiveItemChange('reports') },
    { id: 'evaluations', label: 'Evaluations', icon: <ClipboardCheck size={18} />, onClick: () => onActiveItemChange('evaluations') },
    { id: 'statistics', label: 'Statistics', icon: <BarChart2 size={18} />, onClick: () => onActiveItemChange('statistics') },
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

export default FacultyNavigation;
