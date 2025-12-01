import helpBoxImage from '@/assets/images/svg/help-icon.svg';
import { MenuItemType, ThemeSettings, useThemeContext } from '@/common';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { findAllParent, findMenuItem } from './utils/menu';
import Image from 'next/image';

export type SubMenus = {
	item: MenuItemType;
	linkClassName?: string;
	subMenuClassNames?: string;
	activeMenuItems?: Array<string>;
	toggleMenu?: (item: MenuItemType, status: boolean) => void;
	className?: string;
};

const MenuItemWithChildren = ({ item, linkClassName, subMenuClassNames, activeMenuItems, toggleMenu }: SubMenus) => {
	const [open, setOpen] = useState<boolean>(activeMenuItems!.includes(item.key));

	const { settings } = useThemeContext();

	const collapseClass = settings.sidebar.size === ThemeSettings.sidebar.size.condensed;

	useEffect(() => {
		setOpen(activeMenuItems!.includes(item.key));
	}, [activeMenuItems, item]);

	const toggleMenuItem = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.preventDefault();
		const status = !open;
		setOpen(status);
		if (toggleMenu) toggleMenu(item, status);
		return false;
	};

	return (
		<li className={classNames('side-nav-item', { 'menuitem-active': open })}>
			<Link href="" onClick={toggleMenuItem} data-menu-key={item.key} aria-expanded={open} className={linkClassName}>
				{item.icon && <i className={item.icon}></i>}
				<span>{item.label}</span>
				{item.badge ? (
					<span className={`badge bg-${item.badge.variant} rounded-pill`}>{item.badge.text}</span>
				) : (
					<span className="menu-arrow"></span>
				)}
			</Link>
			<Collapse in={open}>
				<div className={collapseClass ? 'collapse' : ''}>
					<ul className={classNames(subMenuClassNames)} id="sidebarDashboards">
						{(item.children || []).map((child, index) => {
							return (
								<React.Fragment key={index.toString()}>
									{child.children ? (
										<MenuItemWithChildren
											item={child}
											linkClassName={activeMenuItems!.includes(child.key) ? 'active' : ''}
											activeMenuItems={activeMenuItems}
											subMenuClassNames="side-nav-third-level"
											toggleMenu={toggleMenu}
										/>
									) : (
										<MenuItem
											item={child}
											className={activeMenuItems!.includes(child.key) ? 'menuitem-active' : ''}
											linkClassName={activeMenuItems!.includes(child.key) ? 'active' : ''}
										/>
									)}
								</React.Fragment>
							);
						})}
					</ul>
				</div>
			</Collapse>
		</li>
	);
};

const MenuItem = ({ item, className, linkClassName }: SubMenus) => {
	return (
		<li className={className}>
			<MenuItemLink item={item} className={linkClassName} />
		</li>
	);
};

const MenuItemLink = ({ item, className }: SubMenus) => {
	const isActive = className?.includes('active') || className?.includes('menuitem-active');
	
	return (
		<Link href={item.url!} target={item.target} className={`side-nav-link-ref ${className}`} data-menu-key={item.key}>
			{item.icon && (
				<i className={item.icon}></i>
			)}
			<span>{item.label}</span>
			{item.badge && (
				<span
					className={classNames('badge', 'bg-' + item.badge.variant, 'rounded-pill', 'font-10', {
						'text-dark': item.badge.variant === 'light',
						'text-light': item.badge.variant === 'dark' || item.badge.variant === 'secondary' || item.badge.variant === 'success',
						'bg-success': item.badge.variant === 'success',
						'bg-warning': item.badge.variant === 'warning',
					})}
				>
					{item.badge.text}
				</span>
			)}
		</Link>
	);
};

type AppMenuProps = {
	menuItems: Array<MenuItemType>;
};

const AppMenu = ({ menuItems }: AppMenuProps) => {
	const location = usePathname();

	const menuRef = useRef<HTMLUListElement>(null);

	const [activeMenuItems, setActiveMenuItems] = useState<Array<string>>([]);

	/*
	 * toggle the menus
	 */
	const toggleMenu = (menuItem: MenuItemType, show: boolean) => {
		if (show) setActiveMenuItems([menuItem['key'], ...findAllParent(menuItems, menuItem)]);
	};

	/**
	 * activate the menuitems
	 */
	const activeMenu = useCallback(() => {
		// Não ativar nenhum item do menu quando estiver na página de notificações
		if (location === '/apps/mensagens/list') {
			setActiveMenuItems([]);
			return;
		}

		const div = document.getElementById('main-side-menu');
		let matchingMenuItem = null;

		if (div) {
			const items: HTMLCollectionOf<HTMLAnchorElement> = div.getElementsByClassName('side-nav-link-ref') as HTMLCollectionOf<HTMLAnchorElement>;
			for (let i = 0; i < items.length; ++i) {
				if (location === items[i].pathname) {
					matchingMenuItem = items[i];
					break;
				}
			}

			if (matchingMenuItem) {
				const mid = matchingMenuItem.getAttribute('data-menu-key');
				const activeMt = findMenuItem(menuItems, mid!);
				if (activeMt) {
					setActiveMenuItems([activeMt['key'], ...findAllParent(menuItems, activeMt)]);
				}
			}
		}
	}, [location, menuItems]);

	useEffect(() => {
		activeMenu();
	}, [activeMenu]);

	// Separar itens principais dos itens da seção inferior (itens com key começando com "bottom-")
	const mainItems: MenuItemType[] = [];
	const bottomItems: MenuItemType[] = [];
	
	menuItems.forEach(item => {
		if (item.key && item.key.startsWith('bottom-')) {
			bottomItems.push(item);
		} else {
			mainItems.push(item);
		}
	});

	return (
		<>
			<ul className="side-nav" ref={menuRef} id="main-side-menu">
				{mainItems.map((item, index) => {
					return (
						<React.Fragment key={index.toString()}>
							{item.isTitle ? (
								<li className="side-nav-title">{item.label}</li>
							) : (
								<>
									{item.children ? (
										<MenuItemWithChildren
											item={item}
											toggleMenu={toggleMenu}
											subMenuClassNames="side-nav-second-level"
											activeMenuItems={activeMenuItems}
											linkClassName="side-nav-link"
										/>
									) : (
										<MenuItem
											item={item}
											linkClassName="side-nav-link"
											className={`side-nav-item ${activeMenuItems.includes(item.key) ? 'menuitem-active' : ''}`}
										/>
									)}
								</>
							)}
						</React.Fragment>
					);
				})}
			</ul>
			{bottomItems.length > 0 && (
				<>
					<hr className="side-nav-separator" />
					<ul className="side-nav bottom">
						{bottomItems.map((item, index) => {
							return (
								<React.Fragment key={index.toString()}>
									{item.isTitle ? (
										<li className="side-nav-title">{item.label}</li>
									) : (
										<>
											{item.children ? (
												<MenuItemWithChildren
													item={item}
													toggleMenu={toggleMenu}
													subMenuClassNames="side-nav-second-level"
													activeMenuItems={activeMenuItems}
													linkClassName="side-nav-link"
												/>
											) : (
												<MenuItem
													item={item}
													linkClassName="side-nav-link"
													className={`side-nav-item ${activeMenuItems.includes(item.key) ? 'menuitem-active' : ''}`}
												/>
											)}
										</>
									)}
								</React.Fragment>
							);
						})}
					</ul>
				</>
			)}
		</>
	);
};

export default AppMenu;
