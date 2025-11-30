'use client'
import React from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import dynamic from "next/dynamic";
const SimpleBar = dynamic(() => import('simplebar-react'),{ssr: false});
import classNames from 'classnames';
import { NotificationItem } from './types';
import { useToggle } from '@/hooks';
import Link from 'next/link';
import Image from 'next/image';

// notifiaction continer styles
const notificationShowContainerStyle = {
	maxHeight: '300px',
};

type NotificationDropdownProps = {
	notifications: Array<NotificationItem>;
	onNotificationClick?: (message: any) => void;
};

const NotificationDropdown = ({ notifications, onNotificationClick }: NotificationDropdownProps) => {
	const [isOpen, toggleDropdown] = useToggle();
	const [hasInteracted, setHasInteracted] = React.useState(false);

	// Conta o número de notificações não lidas
	const unreadCount = notifications.reduce((count, item) => {
		return count + (item.messages || []).filter(msg => !msg.isRead).length;
	}, 0);

	// Marca como interagido quando o dropdown é aberto
	const handleToggle = () => {
		if (!isOpen) {
			setHasInteracted(true);
		}
		toggleDropdown();
	};

	return (
		<>
			<style>{`
				@keyframes notificationPulse {
					0%, 100% {
						opacity: 1;
						transform: scale(1);
					}
					50% {
						opacity: 0.9;
						transform: scale(1.1);
					}
				}
				@keyframes ripple {
					0% {
						transform: scale(1.2);
						opacity: 0.9;
					}
					100% {
						transform: scale(3);
						opacity: 0;
					}
				}
				.notification-pulse {
					animation: notificationPulse 2s ease-in-out infinite;
				}
				.notification-ripple {
					position: absolute;
					border-radius: 50%;
					border: 2px solid #ff9800;
					width: 24px;
					height: 24px;
					left: 50%;
					top: 50%;
					margin-left: -12px;
					margin-top: -12px;
					animation: ripple 3s ease-out infinite;
				}
				.notification-ripple:nth-child(2) {
					animation-delay: 1s;
				}
				.notification-ripple:nth-child(3) {
					animation-delay: 2s;
				}
				.notification-icon-wrapper {
					position: relative;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					width: 24px;
					height: 24px;
				}
			`}</style>
			<Dropdown show={isOpen} onToggle={handleToggle}>
				<Dropdown.Toggle variant="link" id="dropdown-notification" onClick={handleToggle} className="nav-link dropdown-toggle arrow-none">
					<div className="notification-icon-wrapper">
						{unreadCount > 0 && !hasInteracted && (
							<>
								<span className="notification-ripple"></span>
								<span className="notification-ripple"></span>
								<span className="notification-ripple"></span>
							</>
						)}
						<i 
							className={`ri-notification-3-line font-22 ${unreadCount > 0 && !hasInteracted ? 'notification-pulse' : ''}`}
							style={{ 
								color: unreadCount > 0 && !hasInteracted ? '#ff9800' : 'inherit',
								fontSize: '1.5rem',
								position: 'relative',
								zIndex: 1,
							}}
						></i>
					</div>
				</Dropdown.Toggle>
			<Dropdown.Menu className="dropdown-menu-animated dropdown-lg" align="end">
				<div>
					<div className="dropdown-item noti-title px-3">
						<h5 className="m-0 d-flex align-items-center justify-content-between">
							<span>Notificação</span>
							{unreadCount > 0 && (
								<span className="badge bg-danger rounded-pill">{unreadCount}</span>
							)}
						</h5>
					</div>
					<SimpleBar className="px-3" style={notificationShowContainerStyle}>
						{notifications.length === 0 ? (
							<div className="text-center py-4">
								<i className="mdi mdi-bell-off-outline text-muted h3 mb-2"></i>
								<p className="text-muted mb-0">Nenhuma notificação</p>
							</div>
						) : (
							notifications.map((item, index) => {
								return (
									<React.Fragment key={index.toString()}>
										<h5 className="text-muted font-13 fw-normal mt-0">{item.day}</h5>
										{(item.messages || []).map((message, index) => {
											const handleClick = (e: React.MouseEvent) => {
												e.preventDefault();
												e.stopPropagation();
												if (onNotificationClick) {
													onNotificationClick(message);
													setTimeout(() => toggleDropdown(), 100);
												} else if (message.link) {
													window.open(message.link, '_blank');
												}
											};

											return (
											<div
												key={index + '-noti'}
												className={classNames('dropdown-item p-0 notify-item card shadow-none mb-2', message.isRead ? 'read-noti' : 'unread-noti')}
												onClick={handleClick}
												style={{ cursor: 'pointer' }}
											>
												<Card.Body>
													<span className="float-end noti-close-btn text-muted">
														<i className="mdi mdi-close"></i>
													</span>
													<div className="d-flex align-items-center">
														<div className="flex-shrink-0">
															<div className={classNames('notify-icon', message.variant && 'bg-' + message.variant)}>
																{message.avatar ? (
																	<Image src={message.avatar} className="img-fluid rounded-circle" alt="" />
																) : (
																	<i className={message.icon}></i>
																)}
															</div>
														</div>
														<div className="flex-grow-1 text-truncate ms-2">
															<h5 className="noti-item-title fw-semibold font-14">
																{message.title}
																{message.time && <small className="fw-normal text-muted ms-1">{message.time}</small>}
															</h5>
															<small className="noti-item-subtitle text-muted">{message.subText}</small>
														</div>
													</div>
												</Card.Body>
											</div>
											);
										})}
									</React.Fragment>
								);
							})
						)}
					</SimpleBar>
					<div className="dropdown-item text-center border-top pt-2 pb-2">
						<Link 
							href="/apps/mensagens/list" 
							className="btn btn-sm btn-primary w-100"
							onClick={() => toggleDropdown()}
						>
							<i className="mdi mdi-eye me-1"></i>
							Visualizar Todas as Notificações
						</Link>
					</div>
				</div>
			</Dropdown.Menu>
		</Dropdown>
		</>
	);
};

export default NotificationDropdown;
