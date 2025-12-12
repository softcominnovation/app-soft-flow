import {notifications as defaultNotifications, profileMenus, searchOptions} from './data';
import LanguageDropdown from './LanguageDropdown';
import NotificationDropdown from './NotificationDropdown';
import NotificationModal from './NotificationModal';
import ProfileDropdown from './ProfileDropdown';
import SearchDropdown from './SearchDropdown';
import TopbarSearch from './TopbarSearch';
import AppsDropdown from './AppsDropdown';
import MaximizeScreen from './MaximizeScreen';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import Cookies from 'js-cookie';
// assets
import userImage from '@/assets/images/users/avatar-1.jpg';
import logo from '@/assets/images/logo.png';
import logoDark from '@/assets/images/logo-dark.png';
import logoSm from '@/assets/images/logo-sm.png';
import {ThemeSettings, useThemeContext} from '@/common';
import useThemeCustomizer from '@/components/ThemeCustomizer/useThemeCustomizer';
import {useViewport} from '@/hooks';
import Link from 'next/link';
import Image from 'next/image';
import {useEffect, useState} from "react";
import { getMensagens } from '@/services/mensagensServices';
import { IMensagem } from '@/types/mensagens/IMensagem';
import { NotificationItem } from './types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

type TopbarProps = {
    topbarDark?: boolean;
    toggleMenu?: () => void;
    navOpen?: boolean;
};

const Topbar = ({topbarDark, toggleMenu, navOpen}: TopbarProps) => {
    const {settings, updateSettings, updateSidebar} = useThemeContext();

    const {sideBarType} = useThemeCustomizer();

    const {width} = useViewport();

    const [prevSideBarType, setPrevSideBarType] = useState(ThemeSettings.sidebar.size.condensed);
    const [notifications, setNotifications] = useState<NotificationItem[]>(defaultNotifications);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [mensagensOriginais, setMensagensOriginais] = useState<IMensagem[]>([]);
    const [selectedMensagem, setSelectedMensagem] = useState<IMensagem | null>(null);
    const [showModal, setShowModal] = useState(false);

    /**
     * Toggle the leftmenu when having mobile screen
     */
    const handleLeftMenuCallBack = () => {
        if (width < 1140) {
            if (sideBarType === 'full') {
                showLeftSideBarBackdrop();
                document.getElementsByTagName('html')[0].classList.add('sidebar-enable');
            } else if (sideBarType === 'condensed' || sideBarType === 'fullscreen') {
                updateSidebar({size: ThemeSettings.sidebar.size.default});
            } else {
                updateSidebar({size: ThemeSettings.sidebar.size.condensed});
            }
        } else if (sideBarType === 'condensed' || sideBarType === 'fullscreen') {
            setPrevSideBarType(sideBarType)
            updateSidebar({size: ThemeSettings.sidebar.size.default});
        } else if (sideBarType === 'full') {
            showLeftSideBarBackdrop();
            document.getElementsByTagName('html')[0].classList.add('sidebar-enable');
        } else {
            if (prevSideBarType == 'condensed') {
                updateSidebar({size: ThemeSettings.sidebar.size.condensed});
            } else if (prevSideBarType == 'fullscreen') {
                updateSidebar({size: ThemeSettings.sidebar.size.fullscreen});
            }
        }
    };

    /**
     * creates backdrop for leftsidebar
     */
    function showLeftSideBarBackdrop() {
        const backdrop = document.createElement('div');
        backdrop.id = 'custom-backdrop';
        backdrop.className = 'offcanvas-backdrop fade show';
        document.body.appendChild(backdrop);

        backdrop.addEventListener('click', function () {
            document.getElementsByTagName('html')[0].classList.remove('sidebar-enable');
            hideLeftSideBarBackdrop();
        });
    }

    function hideLeftSideBarBackdrop() {
        const backdrop = document.getElementById('custom-backdrop');
        if (backdrop) {
            document.body.removeChild(backdrop);
            document.body.style.removeProperty('overflow');
        }
    }

    /**
     * Toggle Dark Mode
     */
    const toggleDarkMode = () => {
        if (settings.theme === 'dark') {
            updateSettings({theme: ThemeSettings.theme.light});
        } else {
            updateSettings({theme: ThemeSettings.theme.dark});
        }
    };

    /**
     * Toggles the right sidebar
     */
    const handleRightSideBar = () => {
        updateSettings({rightSidebar: ThemeSettings.rightSidebar.show});
    };

    /**
     * Transforma mensagens da API no formato esperado pelo NotificationDropdown
     */
    const transformMensagensToNotifications = (mensagens: IMensagem[]): NotificationItem[] => {
        if (!mensagens || mensagens.length === 0) {
            return [];
        }

        // Agrupa mensagens por dia
        const groupedByDay: Record<string, IMensagem[]> = {};
        
        mensagens.forEach((msg) => {
            const dataMsg = msg.datas.enviado || msg.datas.msg || msg.datas.hora;
            if (!dataMsg) return;

            const date = dayjs(dataMsg);
            const today = dayjs().startOf('day');
            const yesterday = today.subtract(1, 'day');

            let dayKey: string;
            if (date.isSame(today, 'day')) {
                dayKey = 'Hoje';
            } else if (date.isSame(yesterday, 'day')) {
                dayKey = 'Ontem';
            } else {
                dayKey = date.format('DD MMM YYYY');
            }

            if (!groupedByDay[dayKey]) {
                groupedByDay[dayKey] = [];
            }
            groupedByDay[dayKey].push(msg);
        });

        // Converte para o formato NotificationItem
        return Object.entries(groupedByDay).map(([day, messages]) => ({
            day,
            messages: messages.map((msg) => {
                const dataMsg = msg.datas.enviado || msg.datas.msg || msg.datas.hora;
                const timeAgo = dataMsg ? dayjs(dataMsg).fromNow() : '';

                return {
                    id: msg.id,
                    title: msg.titulo,
                    subText: msg.msg_texto || msg.titulo,
                    time: timeAgo,
                    icon: 'mdi mdi-bell-outline',
                    variant: msg.status_leitura.lido ? 'secondary' : 'primary',
                    isRead: msg.status_leitura.lido,
                    link: msg.link,
                    // Preserva todos os campos da mensagem original
                    enviado_por: msg.enviado_por,
                    msg_texto: msg.msg_texto,
                    id_tipo: msg.id_tipo,
                    endo_imagem: msg.endo_imagem,
                    datas: msg.datas,
                    status_leitura: msg.status_leitura,
                    titulo: msg.titulo, // Preserva o título original também
                };
            }),
        }));
    };

    /**
     * Busca notificações da API quando o usuário está logado
     */
    useEffect(() => {
        const fetchNotifications = async () => {
            const userEmail = Cookies.get('user_email');
            const userId = Cookies.get('user_id');
            
            // Só busca notificações se o usuário estiver logado
            if (!userEmail || !userId) {
                return;
            }

            setLoadingNotifications(true);
            try {
                // Filtra apenas não lidas e do mês atual
                const inicioMes = dayjs().startOf('month').format('YYYY-MM-DD');
                const fimMes = dayjs().endOf('month').format('YYYY-MM-DD');
                
                const response = await getMensagens({ 
                    lido: false,
                    data_msg_inicio: inicioMes,
                    data_msg_fim: fimMes
                });
                
                if (response.success && response.data) {
                    setMensagensOriginais(response.data);
                    const transformedNotifications = transformMensagensToNotifications(response.data);
                    setNotifications(transformedNotifications);
                }
            } catch (error) {
                console.error('Erro ao buscar notificações:', error);
                // Mantém as notificações padrão em caso de erro
            } finally {
                setLoadingNotifications(false);
            }
        };

        fetchNotifications();
    }, []);

    /**
     * Abre o modal com a mensagem selecionada
     */
    const handleNotificationClick = (message: any) => {
        // Converte o message para o formato IMensagem usando os campos preservados
        if (message) {
            const mensagemCompleta: IMensagem = {
                id: message.id,
                titulo: message.titulo || message.title,
                link: message.link,
                enviado_por: message.enviado_por || '',
                msg_texto: message.msg_texto || message.subText || '',
                id_tipo: message.id_tipo || 0,
                endo_imagem: message.endo_imagem,
                datas: message.datas || {
                    msg: null,
                    hora: null,
                    enviado: null,
                    inicio: null,
                    prazo_limite: null,
                    endo_inicial: null,
                    endo_final: null,
                },
                status_leitura: message.status_leitura || {
                    lido: message.isRead || false,
                    auto: false,
                    data_lido: null,
                },
            };
            setSelectedMensagem(mensagemCompleta);
            setShowModal(true);
        }
    };

    /**
     * Atualiza a lista de notificações após marcar como lida
     */
    const handleMarcarLida = async (msgId: number) => {
        // Atualiza a notificação na lista local
        setNotifications(prevNotifications => {
            return prevNotifications.map(item => ({
                ...item,
                messages: item.messages.map(msg => {
                    if (msg.id === msgId) {
                        return {
                            ...msg,
                            isRead: true,
                            variant: 'secondary',
                            status_leitura: msg.status_leitura ? {
                                ...msg.status_leitura,
                                lido: true,
                                auto: msg.status_leitura.auto || false,
                                data_lido: msg.status_leitura.data_lido || new Date().toISOString(),
                            } : {
                                lido: true,
                                auto: false,
                                data_lido: new Date().toISOString(),
                            },
                        };
                    }
                    return msg;
                }),
            }));
        });

        // Atualiza a lista de mensagens originais
        setMensagensOriginais(prev => {
            return prev.map(msg => {
                if (msg.id === msgId) {
                    return {
                        ...msg,
                        status_leitura: {
                            ...msg.status_leitura,
                            lido: true,
                            data_lido: new Date().toISOString(),
                        },
                    };
                }
                return msg;
            });
        });
    };

    return (
        <div className={'navbar-custom'}>
            <div className="topbar container-fluid">
                <div className="d-flex align-items-center gap-lg-2 gap-1">
                    <div className="logo-topbar">
                        <Link href="/" className={topbarDark ? 'logo-light' : 'logo-dark'}>
							<span className="logo-lg">
								<Image src={topbarDark ? logo : logoDark} alt="logo"/>
							</span>
                            <span className="logo-sm">
								<Image src={logoSm} alt="small logo"/>
							</span>
                        </Link>
                    </div>

                    <button className="button-toggle-menu" onClick={handleLeftMenuCallBack}>
                        <i className="mdi mdi-menu"/>
                    </button>

                    <button className={`navbar-toggle ${navOpen ? 'open' : ''}`} onClick={toggleMenu}>
                        <div className="lines">
                            <span/>
                            <span/>
                            <span/>
                        </div>
                    </button>

                    {/* <TopbarSearch options={searchOptions}/> */}
                </div>

                <ul className="topbar-menu d-flex align-items-center gap-3">
                    <li className="dropdown d-lg-none">
                        <SearchDropdown/>
                    </li>
                    <li className="dropdown notification-list">
                        <NotificationDropdown 
                            notifications={notifications}
                            onNotificationClick={handleNotificationClick}
                        />
                    </li>
                    {/* <li className="dropdown d-none d-sm-inline-block">
                        <AppsDropdown/>
                    </li> */}
                    <li className="d-inline-block">
                        <div className="nav-link" id="light-dark-mode" onClick={toggleDarkMode}>
                            <i className="ri-moon-line font-22"/>
                        </div>
                    </li>

                    <li className="d-none d-md-inline-block">
                        <MaximizeScreen/>
                    </li>

                    <li className="dropdown">
                        <ProfileDropdown userImage={userImage} menuItems={profileMenus} username={Cookies.get('user_name') || ''} />
                                         
                    </li>
                </ul>
            </div>
            
            <NotificationModal 
                show={showModal}
                mensagem={selectedMensagem}
                onHide={() => {
                    setShowModal(false);
                    setSelectedMensagem(null);
                }}
                onMarcarLida={handleMarcarLida}
            />
        </div>
    );
};

export default Topbar;
