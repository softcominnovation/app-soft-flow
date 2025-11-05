'use client'
import {useEffect, useRef} from 'react';
import dynamic from "next/dynamic";
import AppMenu from './Menu';

// assets
import profileImg from '@/assets/images/users/avatar-1.jpg';
import logo from '@/assets/images/logo.png';
import logoDark from '@/assets/images/logo-dark.png';
import logoSm from '@/assets/images/logo-sm.png';
import logoDarkSm from '@/assets/images/logo-dark-sm.png';
import {getMenuItems} from './utils/menu';
import Link from 'next/link';
import Image from 'next/image';

const SimpleBar = dynamic(() => import('simplebar-react'), {ssr: false});

const UserBox = () => {
    return (
        <div className="leftbar-user">
            <Link href="/pages/profile">
                <Image src={profileImg} alt="user-image" height="42" className="rounded-circle shadow-sm"/>
                <span className="leftbar-user-name mt-2">Dominic Keller</span>
            </Link>
        </div>
    );
};

const SideBarContent = () => {
    return (
        <>
            <UserBox/>
            <AppMenu menuItems={getMenuItems()}/>
            <div className="clearfix"/>
        </>
    );
};

type LeftSidebarProps = {
    hideLogo?: boolean;
    hideUserProfile: boolean;
    leftbarDark: boolean;
    isCondensed: boolean;
};

const LeftSidebar = ({isCondensed, leftbarDark}: LeftSidebarProps) => {
    const menuNodeRef = useRef<HTMLDivElement>(null);

    /**
     * Handle the click anywhere in doc
     */
    const handleOtherClick = (e: MouseEvent) => {
        if (menuNodeRef && menuNodeRef.current && menuNodeRef.current.contains(e.target as Node)) return;
        // else hide the menubar
        if (document.body) {
            document.body.classList.remove('sidebar-enable');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOtherClick, false);

        return () => {
            document.removeEventListener('mousedown', handleOtherClick, false);
        };
    }, []);

    return (
        <div className="leftside-menu" ref={menuNodeRef}>
            <Link href="/" className={`logo ${leftbarDark ? 'logo-light' : 'logo-dark'}`} style={{display: 'flex', alignItems: 'center'}}>
				<span className="logo-lg">
					<Image src={leftbarDark ? logo : logoDark} alt="logo" className="sidebar-logo-img"/>
				</span>
                <span className="logo-sm">
					<Image src={leftbarDark ? logoSm : logoDarkSm} alt="logo" className="sidebar-logo-img-sm"/>
				</span>
            </Link>

            {!isCondensed && (
                <SimpleBar style={{maxHeight: '100%'}} scrollbarMaxSize={320}>
                    <SideBarContent/>
                </SimpleBar>
            )}
            {isCondensed && <SideBarContent/>}
        </div>
    );
};

export default LeftSidebar;
