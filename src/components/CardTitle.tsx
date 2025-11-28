import React, { Fragment } from 'react';
import { Dropdown, DropdownDivider, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import classNames from 'classnames';
import Link from 'next/link';

type MenuItem = {
	label: string;
	icon?: string;
	variant?: string;
	hasDivider?: boolean;
};

type CardTitleProps = {
	menuItems?: Array<MenuItem>;
	title: string | React.ReactNode;
	containerClass: string;
	icon?: string;
};

const CardTitle = ({ title, containerClass, icon, menuItems }: CardTitleProps) => {
	return (
		<div className={classNames(containerClass)}>
			{typeof title === 'string' ? <h4 className="header-title mb-0">{title}</h4> : title}
				{menuItems && (
					<Dropdown>
						<DropdownToggle as={'a'} className="arrow-none cursor-pointer card-drop">
							<i className={classNames(icon ? icon : 'mdi mdi-dots-vertical')} />
						</DropdownToggle>
						<DropdownMenu align="end">
							{menuItems.map((item, index) => {
								return (
									<Fragment key={index.toString()}>
										{item.hasDivider && <DropdownDivider as="div" />}
										<DropdownItem className={classNames(item.variant ? item.variant : '')}>
											{item.icon && <i className={classNames(item.icon, 'me-1')}></i>}
											{item.label}
										</DropdownItem>
									</Fragment>
								);
							})}
						</DropdownMenu>
					</Dropdown>
				)}
		</div>
	);
};

export default CardTitle;
