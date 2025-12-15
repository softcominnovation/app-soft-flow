'use client';
import type { ChildrenType } from '@/types/component-props';
import type { User } from '@/types/User';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { createContext, useContext, useState, useEffect } from 'react';
import { removePermissoes } from '@/helpers/permissionsHelpers';

export type AuthContextType = {
	user: User | undefined;
	isAuthenticated: boolean;
	saveSession: (auth: boolean) => void;
	removeSession: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuthContext must be used within an AuthProvider');
	}
	return context;
}

const authSessionKey = 'access_token';

export function AuthProvider({ children }: ChildrenType) {
	const getSession = (): boolean => {
		return !!getCookie("user_email") && !!getCookie('user_id') && !!getCookie("user_name");
	};

	const [user, setUser] = useState<User | undefined>(undefined);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(getSession());

	useEffect(() => {
		const checkAuth = getSession();
		setIsAuthenticated(checkAuth);

		// if (checkAuth) {
		// 	const user = JSON.parse(getCookie(authSessionKey)?.toString() || '{}');
		// 	setUser(user);
		// }
	}, []);

	const saveSession = (auth: boolean) => {
		setIsAuthenticated(auth);
		if (auth) {
			setCookie(authSessionKey, JSON.stringify(user));
		} else {
			deleteCookie(authSessionKey);
		}
	};

	const removeSession = () => {
		deleteCookie("user_email");
		deleteCookie("user_name");
		deleteCookie("user_id");
		removePermissoes(); // Remove permissões do localStorage
		setUser(undefined);
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				saveSession,
				removeSession,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
