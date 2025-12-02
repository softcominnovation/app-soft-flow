'use client';
import { useEffect, useState } from 'react';

export function useAccountLayout() {
	useEffect(() => {
		if (document) document.body.classList.add('authentication-bg');

		return () => document.body.classList.remove('authentication-bg');
	}, []);
}

// Função para converter cor hexadecimal para RGB
const hexToRgb = (hex: string): string | null => {
	// Remove o # se existir
	const cleanHex = hex.replace('#', '');
	
	// Se for um gradiente ou não for uma cor válida, retorna null
	if (cleanHex.length !== 6 || cleanHex.includes('gradient') || cleanHex.includes('rgb')) {
		return null;
	}
	
	const r = parseInt(cleanHex.substring(0, 2), 16);
	const g = parseInt(cleanHex.substring(2, 4), 16);
	const b = parseInt(cleanHex.substring(4, 6), 16);
	
	return `${r}, ${g}, ${b}`;
};

const BGCircles = () => {
	useAccountLayout();
	const [menuColorRgb, setMenuColorRgb] = useState<string>('31, 41, 55'); // Fallback: #1F2937

	useEffect(() => {
		if (typeof window === 'undefined') return;
		
		const getMenuColor = () => {
			const menuBg = getComputedStyle(document.documentElement)
				.getPropertyValue('--bs-menu-bg')
				.trim();
			
			if (!menuBg) return '31, 41, 55'; // Fallback
			
			// Se for um gradiente, pega a primeira cor
			if (menuBg.includes('gradient')) {
				const match = menuBg.match(/#([0-9A-Fa-f]{6})/);
				if (match) {
					const rgb = hexToRgb(match[1]);
					return rgb || '31, 41, 55';
				}
				return '31, 41, 55';
			}
			
			// Se já for RGB, extrai os valores
			if (menuBg.includes('rgb')) {
				const match = menuBg.match(/(\d+),\s*(\d+),\s*(\d+)/);
				if (match) {
					return `${match[1]}, ${match[2]}, ${match[3]}`;
				}
			}
			
			// Tenta converter hexadecimal
			const rgb = hexToRgb(menuBg);
			return rgb || '31, 41, 55';
		};

		setMenuColorRgb(getMenuColor());
	}, []);

	return (
		<div className="position-absolute start-0 end-0 start-0 bottom-0 w-100 h-100" style={{ zIndex: -1 }}>
			<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 800">
				<g fillOpacity="0.22">
					<circle style={{ fill: `rgba(${menuColorRgb}, 0.1)` }} cx={400} cy={400} r={600} />
					<circle style={{ fill: `rgba(${menuColorRgb}, 0.2)` }} cx={400} cy={400} r={500} />
					<circle style={{ fill: `rgba(${menuColorRgb}, 0.3)` }} cx={400} cy={400} r={300} />
					<circle style={{ fill: `rgba(${menuColorRgb}, 0.4)` }} cx={400} cy={400} r={200} />
					<circle style={{ fill: `rgba(${menuColorRgb}, 0.5)` }} cx={400} cy={400} r={100} />
				</g>
			</svg>
		</div>
	);
};

export default BGCircles;
