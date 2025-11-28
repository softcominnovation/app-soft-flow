'use client';
import { CheckInput, Form, PasswordInput, TextInput } from '@/components/Form';
import Link from 'next/link';
import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import AccountWrapper from '../AccountWrapper';
import useLogin from '../login2/useLogin';
import Spinner from '@/components/Spinner';
import { useQuery } from '@/hooks';

const BottomLink = () => {
	const { t } = useTranslation();

	return (
		<Row className="mt-3">
			<Col className="text-center">
			</Col>
		</Row>
	);
};

const LoginPage = () => {
	const { t } = useTranslation();
	const { loading, login } = useLogin();
	const queryParams = useQuery();
	const hasAutoLoggedIn = useRef(false);

	useEffect(() => {
		// Verifica se há parâmetros de email e password/senha na URL
		const email = queryParams['email'];
		const password = queryParams['password'] || queryParams['senha'];

		// Se ambos os parâmetros existirem e ainda não tiver feito login automático, faz login
		if (email && password && !hasAutoLoggedIn.current && !loading) {
			hasAutoLoggedIn.current = true;
			login({ email, password });
		}
	}, [queryParams, login, loading]);

	return (
		<AccountWrapper bottomLinks={<BottomLink />}>
			<div className="text-center w-75 m-auto">
				<h4 className="text-dark-50 text-center mt-0 fw-bold">{t('Sign In')}</h4>
				<p className="text-muted mb-4">{t('Bem-vindo(a) ao SoftFlow — organize casos e avance entregas."')}</p>
			</div>
			<Form onSubmit={login}>
				<Row>
					<Col>
						<TextInput label={t('Email')} name="email" type="email" placeholder={t('Digite seu email')} containerClass="mb-3" />
					</Col>
				</Row>
				<PasswordInput label={t('Senha')} name="password" placeholder={t('Digite sua senha')} containerClass="mb-3"/>

				<CheckInput name="rememberme" type="checkbox" label="Lembrar de mim" containerClass="mb-3" defaultChecked />

				<div className="mb-3 text-center">
					<Button variant="primary" type="submit" disabled={loading}>
						{
							loading ? 
							<>
								<span style={{marginRight: '10px'}}>Entrando</span>
								<Spinner className="spinner-grow-sm" tag="span" color="white" type="bordered" />
							</>
							: t('Entrar')
						}
					</Button>
				</div>
			</Form>
		</AccountWrapper>
	);
};

export default LoginPage;
