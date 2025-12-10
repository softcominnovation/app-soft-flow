'use client';
import { useMemo, useState } from 'react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import classNames from 'classnames';

export type SortDirection = 'asc' | 'desc' | null;

interface SortableTableHeaderProps {
	children: React.ReactNode;
	sortKey: string;
	currentSortKey?: string | null;
	currentSortDirection?: SortDirection;
	onSort: (sortKey: string, direction: SortDirection) => void;
	className?: string;
}

/**
 * Componente de header de tabela com funcionalidade de ordenação
 * Segue princípios SOLID: Single Responsibility (apenas ordenação de header)
 * e Open/Closed (extensível via props)
 */
export default function SortableTableHeader({
	children,
	sortKey,
	currentSortKey,
	currentSortDirection,
	onSort,
	className,
}: SortableTableHeaderProps) {
	const [isHovered, setIsHovered] = useState(false);
	
	const isActive = useMemo(
		() => currentSortKey === sortKey && currentSortDirection !== null,
		[currentSortKey, sortKey, currentSortDirection]
	);

	const handleClick = () => {
		let newDirection: SortDirection = 'asc';

		if (isActive) {
			// Se já está ordenado, alterna entre asc e desc
			if (currentSortDirection === 'asc') {
				newDirection = 'desc';
			} else if (currentSortDirection === 'desc') {
				// Se já está em desc, remove a ordenação (volta para null)
				newDirection = null;
			}
		}

		onSort(sortKey, newDirection);
	};

	const getSortIcon = () => {
		if (!isActive) {
			return 'lucide:arrow-up-down';
		}

		return currentSortDirection === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down';
	};

	const getIconStyle = (): React.CSSProperties => {
		const baseStyle: React.CSSProperties = {
			fontSize: '1.25rem',
			width: '1.25rem',
			height: '1.25rem',
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			transition: 'all 0.2s ease',
			padding: '5px',
			borderRadius: '5px',
			minWidth: '1.25rem',
			minHeight: '1.25rem',
		};

		if (isActive) {
			baseStyle.color = 'var(--bs-primary)';
			baseStyle.backgroundColor = 'rgba(var(--bs-primary-rgb), 0.18)';
			baseStyle.opacity = 1;
			baseStyle.fontWeight = 600;
			baseStyle.transform = 'scale(1.05)';
		} else if (isHovered) {
			baseStyle.color = 'var(--bs-primary)';
			baseStyle.backgroundColor = 'rgba(var(--bs-primary-rgb), 0.12)';
			baseStyle.opacity = 1;
		} else {
			baseStyle.color = 'var(--bs-secondary)';
			baseStyle.opacity = 0.75;
		}

		return baseStyle;
	};

	return (
		<th
			className={classNames('py-3 sortable-header', className, {
				'cursor-pointer user-select-none': true,
				'sortable-header--active': isActive,
			})}
			onClick={handleClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="d-flex align-items-center gap-2">
				<span className={classNames({
					'fw-semibold': isActive,
					'text-primary': isActive,
				})}>
					{children}
				</span>
				<div style={{ 
					display: 'inline-flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}>
					<IconifyIcon
						icon={getSortIcon()}
						style={getIconStyle()}
					/>
				</div>
			</div>
		</th>
	);
}

