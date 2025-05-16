import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, MapPin, User, LogOut } from 'lucide-react';
import styles from './NavigationMenu.module.css';
import NotificationBell from './NotificationBell';

export interface MenuItem {
    id: string;
    label: React.ReactNode;
    href?: string;
    icon?: React.ReactNode;
    count?: number;
    dropdownItems?: MenuItem[];
    onClick?: () => void;
}

interface NavigationMenuProps {
    items: MenuItem[];
    activeItemId?: string;
    onItemChange?: (itemId: string) => void;
    logo?: {
        src: string;
        alt: string;
        width?: number;
        height?: number;
    };
    rightElements?: React.ReactNode;
    className?: string;
    variant?: 'navigation' | 'tabs';
    notificationCount?: number;
    locationName?: string;
    onLogout?: () => void;
}

/**
 * A flexible navigation component that can be used for both main navigation and tabs
 * 
 * @param props.items - Array of navigation items
 * @param props.activeItemId - ID of the currently active item
 * @param props.onItemChange - Function called when an item is clicked
 * @param props.logo - Optional logo configuration
 * @param props.rightElements - Optional elements to display on the right side
 * @param props.className - Optional additional CSS class name
 * @param props.variant - 'navigation' (horizontal bar) or 'tabs' (tab style) * @param props.notificationCount - Number of notifications to display
 * @param props.locationName - Location name to display
 * @param props.onLogout - Function to call when the logout button is clicked
 */
const NavigationMenu: React.FC<NavigationMenuProps> = ({
    items,
    activeItemId,
    onItemChange,
    logo = { src: '/logos/GUCInternshipSystemLogo.png', alt: 'GUC Internship System' },
    rightElements,
    className = '',
    variant = 'navigation',
    notificationCount = 0,
    locationName = 'New York, NY',
    onLogout
}) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleItemClick = (item: MenuItem) => {
        if (item.dropdownItems?.length) {
            setOpenDropdown(openDropdown === item.id ? null : item.id);
        } else {
            if (item.onClick) {
                item.onClick();
            }
            if (onItemChange) {
                onItemChange(item.id);
            }
            setOpenDropdown(null);
        }
    };

    const renderMenuItem = (item: MenuItem) => {
        const isActive = activeItemId === item.id;
        const hasDropdown = item.dropdownItems && item.dropdownItems.length > 0;
        const isDropdownOpen = openDropdown === item.id;

        const itemClasses = [
            variant === 'navigation' ? styles.navItem : styles.tabItem,
            isActive ? styles.active : '',
            hasDropdown ? styles.hasDropdown : ''
        ].filter(Boolean).join(' ');

        return (
            <div key={item.id} className={styles.menuItemContainer}>
                <a
                    href={item.href || '#'}
                    className={itemClasses}
                    onClick={(e) => {
                        if (!item.href || hasDropdown) {
                            e.preventDefault();
                        }
                        handleItemClick(item);
                    }}
                    aria-selected={isActive}
                    role={variant === 'tabs' ? 'tab' : undefined}
                >
                    {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
                    <span className={styles.itemLabel}>{item.label}</span>
                    {hasDropdown && (
                        <ChevronDown
                            size={16}
                            className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.open : ''}`}
                        />
                    )}
                </a>

                {hasDropdown && isDropdownOpen && (
                    <div className={styles.dropdown}>
                        {item.dropdownItems!.map((dropdownItem) => (
                            <a
                                key={dropdownItem.id}
                                href={dropdownItem.href || '#'}
                                className={styles.dropdownItem}
                                onClick={(e) => {
                                    if (!dropdownItem.href) {
                                        e.preventDefault();
                                    }
                                    if (dropdownItem.onClick) {
                                        dropdownItem.onClick();
                                    }
                                    if (onItemChange) {
                                        onItemChange(dropdownItem.id);
                                    }
                                    setOpenDropdown(null);
                                }}
                            >
                                {dropdownItem.icon && (
                                    <span className={styles.dropdownItemIcon}>{dropdownItem.icon}</span>
                                )}
                                <span>{dropdownItem.label}</span>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        );
    };    
    // Default right elements with notification bell, and logout button
    const defaultRightElements = (
        <>
            <div className={styles.locationDisplay}>
                <MapPin size={16} className={styles.locationIcon} />
                <span>{locationName}</span>
            </div>
            <div className={styles.userControls}>         
                <NotificationBell />               
                <button 
                    className={styles.logoutButton} 
                    onClick={() => {
                        if (window.confirm('Are you sure you want to logout?')) {
                            if (onLogout) onLogout();
                        }
                    }}
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </>
    );

    return (
        <div className={`${styles.container} ${styles[variant]} ${className}`}>
            <div className={styles.leftSection}>
                {logo && (
                    <div className={styles.logoContainer}>
                        <Image
                            src={logo.src}
                            alt={logo.alt}
                            width={logo.width || 250}
                            height={logo.height || 150}
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                )}
                <nav className={styles.menuItems}>
                    {items.map(renderMenuItem)}
                </nav>
            </div>
            <div className={styles.rightSection}>
                {rightElements || defaultRightElements}
            </div>
        </div>
    );
};

export default NavigationMenu; 