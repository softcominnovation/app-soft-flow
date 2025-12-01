import React, { useEffect, useState, useCallback } from 'react';
import { MenuItemType } from '@/common/menu-items';
import classNames from 'classnames';
import { findAllParent, findMenuItem } from '../utils/menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Renders the application menu
 */

type MenuItems = {
	item: MenuItemType;
	tag?: React.ElementType;
	linkClassName?: string;
	className?: string;
	subMenuClassNames?: string;
	activeMenuItems?: string[];
	toggleMenu?: (item: MenuItemType, status: boolean) => void;
};

const MenuItemWithChildren = ({ item, tag, linkClassName, className, subMenuClassNames, activeMenuItems, toggleMenu }: MenuItems) => {
	const Tag: React.ElementType = tag || 'div';

	const [open, setOpen] = useState<boolean>(activeMenuItems!.includes(item.key));

	const showMenu = window.screen.width <= 991 && open;

	useEffect(() => {
		setOpen(activeMenuItems!.includes(item.key));
	}, [activeMenuItems, item]);

	const toggleMenuItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		const status = !open;
		setOpen(status);
		if (toggleMenu) toggleMenu(item, status);
		return false;
	};

	return (
		<Tag className={classNames('dropdown', className, activeMenuItems!.includes(item.key) ? 'active' : '')}>
			<Link
				href=""
				onClick={toggleMenuItem}
				data-menu-key={item.key}
				className={classNames('dropdown-toggle', 'arrow-none', linkClassName)}
				id={item.key}
				role="button"
				data-bs-toggle="dropdown"
				aria-haspopup="true"
				aria-expanded={open}
			>
				{item.icon && <i className={item.icon}></i>}
				<span> {item.label} </span>
				<div className="arrow-down"></div>
			</Link>

			{item.children && (
				<div className={classNames(subMenuClassNames, { show: showMenu })} aria-labelledby={item.key}>
					{item.children.map((child, index) => {
						return (
							<React.Fragment key={index.toString()}>
								{child.children ? (
									<>
										{/* parent */}
										<MenuItemWithChildren
											item={child}
											tag="div"
											linkClassName={classNames('dropdown-item', activeMenuItems!.includes(child.key) ? 'active' : '')}
											activeMenuItems={activeMenuItems}
											className=""
											subMenuClassNames={classNames('dropdown-menu')}
											toggleMenu={toggleMenu}
										/>
									</>
								) : (
									<>
										{/* child */}
										<MenuItemLink
											item={child}
											className={classNames('dropdown-item', {
												active: activeMenuItems!.includes(child.key),
											})}
										/>
									</>
								)}
							</React.Fragment>
						);
					})}
				</div>
			)}
		</Tag>
	);
};

const MenuItem = ({ item, className, linkClassName }: MenuItems) => {
	return (
		<li className={`nav-item ${className}`}>
			<MenuItemLink item={item} className={linkClassName} />
		</li>
	);
};

const MenuItemLink = ({ item, className }: MenuItems) => {
	return (
		<Link href={item.url!} target={item.target} className={className} data-menu-key={item.key}>
			{item.icon && <i className={item.icon}></i>}
			<span> {item.label} </span>
		</Link>
	);
};

type AppMenuProps = {
	menuItems: Array<MenuItemType>;
};

const AppMenu = ({ menuItems }: AppMenuProps) => {
	const [activeMenuItems, setActiveMenuItems] = useState<string[]>([]);

	const pathname = usePathname();

	/*
	 * toggle the menus
	 */
	const toggleMenu = (menuItem: MenuItemType, show: boolean) => {
		if (show) setActiveMenuItems([menuItem.key, ...findAllParent(menuItems, menuItem)]);
	};

	/**
	 * activate the menuitems
	 */
	const activeMenu = useCallback(() => {
		// Não ativar nenhum item do menu quando estiver na página de notificações
		if (pathname === '/apps/mensagens/list') {
			setActiveMenuItems([]);
			return;
		}

		const div = document.getElementById('main-side-menu');
		let matchingMenuItem = null;

		if (div) {
			const items: HTMLCollectionOf<HTMLAnchorElement> = div.getElementsByTagName('a');
			for (let i = 0; i < items.length; ++i) {
				if (pathname === items[i].pathname) {
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
	}, [pathname, menuItems]);

	useEffect(() => {
		if (menuItems && menuItems.length > 0) activeMenu();
	}, [activeMenu, menuItems]);

	return (
		<ul className="navbar-nav w-100" id="main-side-menu">
			{(menuItems || []).map((item, index) => {
				return (
					<React.Fragment key={index.toString()}>
						{item.children ? (
							<MenuItemWithChildren
								item={item}
								tag="li"
								className="nav-item"
								subMenuClassNames={classNames('dropdown-menu')}
								activeMenuItems={activeMenuItems}
								linkClassName="nav-link"
								toggleMenu={toggleMenu}
							/>
						) : (
							<MenuItem
								item={item}
								linkClassName="nav-link dropdown-toggle arrow-none"
								className={activeMenuItems.includes(item.key) ? 'show' : ''}
							/>
						)}
					</React.Fragment>
				);
			})}
		</ul>
	);
};

export default AppMenu;
