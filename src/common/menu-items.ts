export type MenuItemType = {
    key: string;
    label: string;
    isTitle?: boolean;
    icon?: string;
    url?: string;
    badge?: {
        variant: string;
        text: string;
    };
    parentKey?: string;
    target?: string;
    children?: MenuItemType[];
};

type AppEnvironment = 'development' | 'preview' | 'production';

const currentEnv = (process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV ?? 'development') as AppEnvironment | string;
const isProductionEnv = currentEnv === 'production';

const PRODUCTION_SIDEBAR_VISIBLE_KEYS = new Set<string>(['navigation', 'apps-cases', 'cases-list', 'apps-diversos', 'diversos-notificacoes']);
const PRODUCTION_HORIZONTAL_VISIBLE_KEYS = new Set<string>(['apps-cases', 'cases', 'apps-diversos']);

const filterMenuItemsByVisibleKeys = (items: MenuItemType[], visibleKeys: Set<string>): MenuItemType[] => {
    const filteredItems: MenuItemType[] = [];

    for (const item of items) {
        const filteredChildren = item.children ? filterMenuItemsByVisibleKeys(item.children, visibleKeys) : undefined;
        const hasVisibleChildren = Array.isArray(filteredChildren) && filteredChildren.length > 0;
        const isDirectlyVisible = visibleKeys.has(item.key);

        if (isDirectlyVisible || hasVisibleChildren) {
            filteredItems.push(
                filteredChildren
                    ? {
                          ...item,
                          children: filteredChildren,
                      }
                    : { ...item }
            );
        }
    }

    return filteredItems;
};

const MENU_ITEMS_BASE: MenuItemType[] = [
    {
        key: 'navigation',
        label: 'Navegação',
        isTitle: true,
    },
    {
        key: 'dashboards',
        label: 'Dashboards',
        isTitle: false,
        icon: 'uil-home-alt',
        badge: {variant: 'success', text: '5'},
        children: [
            {
                key: 'ds-analytics',
                label: 'Analytics',
                url: '/dashboards/analytics',
                parentKey: 'dashboards',
            },
            {
                key: 'ds-ecommerce',
                label: 'Ecommerce',
                url: '/dashboards/ecommerce',
                parentKey: 'dashboards',
            },
            {
                key: 'ds-project',
                label: 'Projects',
                url: '/dashboards/project',
                parentKey: 'dashboards',
            },
            {
                key: 'ds-crm',
                label: 'CRM',
                url: '/dashboards/crm',
                parentKey: 'dashboards',
            },
            {
                key: 'ds-ewallet',
                label: 'E-Wallet',
                url: '/dashboards/e-wallet',
                parentKey: 'dashboards',
            },
        ],
    },
    {
        key: 'apps',
        label: 'Apps',
        isTitle: true,
    },
    // {
    //     key: 'apps-calendar',
    //     label: 'Calendário',
    //     isTitle: false,
    //     icon: 'uil-calender',
    //     url: '/apps/calendar',
    // },
    // {
    //     key: 'apps-chat',
    //     label: 'Chat',
    //     isTitle: false,
    //     icon: 'uil-comments-alt',
    //     url: '/apps/chat',
    // },
    // {
    //     key: 'apps-crm',
    //     label: 'CRM',
    //     isTitle: false,
    //     badge: {variant: 'danger', text: 'New'},
    //     icon: 'uil-tachometer-fast',
    //     children: [
    //         {
    //             key: 'crm-projects',
    //             label: 'Projects',
    //             url: '/apps/crm/projects',
    //             parentKey: 'apps-crm',
    //         },
    //         {
    //             key: 'crm-orders',
    //             label: 'Orders List',
    //             url: '/apps/crm/orders',
    //             parentKey: 'apps-crm',
    //         },
    //         {
    //             key: 'crm-clients',
    //             label: 'Clients',
    //             url: '/apps/crm/clients',
    //             parentKey: 'apps-crm',
    //         },
    //         {
    //             key: 'crm-management',
    //             label: 'Management',
    //             url: '/apps/crm/management',
    //             parentKey: 'apps-crm',
    //         },
    //     ],
    // },
    {
        key: 'apps-cases',
        label: 'Casos',
        isTitle: false,
        // badge: {variant: 'danger', text: 'New'},
        icon: 'uil-file',
        children: [
            {
                key: 'cases-list',
                label: 'Listagem',
                url: '/apps/cases/list',
                parentKey: 'apps-crm',
            },
            // {
            //     key: 'crm-projects',
            //     label: 'Projects',
            //     url: '/apps/crm/projects',
            //     parentKey: 'apps-crm',
            // },
            // {
            //     key: 'crm-clients',
            //     label: 'Clients',
            //     url: '/apps/crm/clients',
            //     parentKey: 'apps-crm',
            // },
            // {
            //     key: 'crm-management',
            //     label: 'Management',
            //     url: '/apps/crm/management',
            //     parentKey: 'apps-crm',
            // },
        ],
    },
    {
        key: 'apps-diversos',
        label: 'Diversos',
        isTitle: false,
        // badge: {variant: 'success', text: 'Novo'},
        icon: 'uil-apps',
        children: [
            {
                key: 'diversos-notificacoes',
                label: 'Notificações',
                url: '/apps/mensagens/list',
                parentKey: 'apps-diversos',
            },
        ],
    },
    // {
    //     key: 'apps-ecommerce',
    //     label: 'Ecommerce',
    //     isTitle: false,
    //     icon: 'uil-store',
    //     children: [
    //         {
    //             key: 'ecommerce-products',
    //             label: 'Products',
    //             url: '/apps/ecommerce/products',
    //             parentKey: 'apps-ecommerce',
    //         },
    //         {
    //             key: 'ecommerce-details',
    //             label: 'Products Details',
    //             url: '/apps/ecommerce/product-details',
    //             parentKey: 'apps-ecommerce',
    //         },
    //         {
    //             key: 'ecommerce-orders',
    //             label: 'Orders',
    //             url: '/apps/ecommerce/orders',
    //             parentKey: 'apps-ecommerce',
    //         },
    //         {
    //             key: 'ecommerce-order-details',
    //             label: 'Order Details',
    //             url: '/apps/ecommerce/order-details',
    //             parentKey: 'apps-ecommerce',
    //         },
    //         {
    //             key: 'ecommerce-customers',
    //             label: 'Customers',
    //             url: '/apps/ecommerce/customers',
    //             parentKey: 'apps-ecommerce',
    //         },
    //         {
    //             key: 'ecommerce-shopping-cart',
    //             label: 'Shopping Cart',
    //             url: '/apps/ecommerce/shopping-cart',
    //             parentKey: 'apps-ecommerce',
    //         },
    //         {
    //             key: 'ecommerce-checkout',
    //             label: 'Checkout',
    //             url: '/apps/ecommerce/checkout',
    //             parentKey: 'apps-ecommerce',
    //         },
    //         {
    //             key: 'ecommerce-sellers',
    //             label: 'Sellers',
    //             url: '/apps/ecommerce/sellers',
    //             parentKey: 'apps-ecommerce',
    //         },
    //     ],
    // },
    // {
    //     key: 'apps-email',
    //     label: 'Email',
    //     isTitle: false,
    //     icon: 'uil-envelope',
    //     children: [
    //         {
    //             key: 'email-inbox',
    //             label: 'Inbox',
    //             url: '/apps/email/inbox',
    //             parentKey: 'apps-email',
    //         },
    //         {
    //             key: 'email-read-email',
    //             label: 'Read Email',
    //             url: '/apps/email/read',
    //             parentKey: 'apps-email',
    //         },
    //     ],
    // },
    // {
    //     key: 'apps-projects',
    //     label: 'Casos',
    //     isTitle: false,
    //     icon: 'uil-briefcase',
    //     children: [
    //         {
    //             key: 'project-list',
    //             label: 'Projetos',
    //             url: '/apps/projects/list',
    //             parentKey: 'apps-projects',
    //         },
    //         {
    //             key: 'project-details',
    //             label: 'Detalhes',
    //             url: '/apps/projects/details',
    //             parentKey: 'apps-projects',
    //         },
    //         {
    //             key: 'project-gantt',
    //             label: 'Gantt',
    //             url: '/apps/projects/gantt',
    //             badge: {variant: 'light', text: 'New'},
    //             parentKey: 'apps-projects',
    //         },
    //         {
    //             key: 'project-create-project',
    //             label: 'Create Project',
    //             url: '/apps/projects/create',
    //             parentKey: 'apps-projects',
    //         },
    //     ],
    // },
    // {
    //     key: 'apps-social',
    //     label: 'Social Feed',
    //     isTitle: false,
    //     icon: 'uil-rss',
    //     url: '/apps/social',
    // },
    // {
    //     key: 'apps-tasks',
    //     label: 'Tasks',
    //     isTitle: false,
    //     icon: 'uil-clipboard-alt',
    //     children: [
    //         {
    //             key: 'task-list',
    //             label: 'List',
    //             url: '/apps/tasks/list',
    //             parentKey: 'apps-tasks',
    //         },
    //         {
    //             key: 'task-details',
    //             label: 'Details',
    //             url: '/apps/tasks/details',
    //             parentKey: 'apps-tasks',
    //         },
    //         {
    //             key: 'task-kanban',
    //             label: 'Kanban Board',
    //             url: '/apps/tasks/kanban',
    //             parentKey: 'apps-tasks',
    //         },
    //     ],
    // },
    // {
    //     key: 'apps-file-manager',
    //     label: 'File Manager',
    //     isTitle: false,
    //     icon: 'uil-folder-plus',
    //     url: '/apps/file',
    // },
    // {
    //     key: 'custom',
    //     label: 'Custom',
    //     isTitle: true,
    // },
    // {
    //     key: 'pages',
    //     label: 'Pages',
    //     isTitle: false,
    //     icon: 'uil-copy-alt',
    //     children: [
    //         {
    //             key: 'page-profile',
    //             label: 'Profile',
    //             url: '/pages/profile',
    //             parentKey: 'pages',
    //         },
    //         {
    //             key: 'page-profile2',
    //             label: 'Profile 2',
    //             url: '/pages/profile2',
    //             parentKey: 'pages',
    //         },
    //         {
    //             key: 'page-invoice',
    //             label: 'Invoice',
    //             url: '/pages/invoice',
    //             parentKey: 'pages',
    //         },
    //         {
    //             key: 'page-faq',
    //             label: 'FAQ',
    //             url: '/pages/faq',
    //             parentKey: 'pages',
    //         },
    //         {
    //             key: 'page-pricing',
    //             label: 'Pricing',
    //             url: '/pages/pricing',
    //             parentKey: 'pages',
    //         },
    //         {
    //             key: 'page-maintenance',
    //             label: 'Maintenance',
    //             url: '/error/maintenance ',
    //             target: '_blank',
    //             parentKey: 'pages',
    //         },
    //         {
    //             key: 'auth-pages',
    //             label: 'Authentication',
    //             url: '/account',
    //             parentKey: 'pages',
    //             children: [
    //                 {
    //                     key: 'auth-login',
    //                     label: 'Login',
    //                     url: '/account/login',
    //                     parentKey: 'auth-pages',
    //                 },
    //                 {
    //                     key: 'auth-login2',
    //                     label: 'Login 2',
    //                     url: '/account/login2',
    //                     parentKey: 'auth-pages',
    //                 },
    //                 {
    //                     key: 'auth-register',
    //                     label: 'Register',
    //                     url: '/account/register',
    //                     parentKey: 'auth-pages',
    //                 },
    //                 {
    //                     key: 'auth-register2',
    //                     label: 'Register 2',
    //                     url: '/account/register2',
    //                     parentKey: 'auth-pages',
    //                 },
    //                 {
    //                     key: 'auth-logout',
    //                     label: 'Logout',
    //                     url: '/account/logout',
    //                     parentKey: 'auth-pages',
    //                 },
    //                 {
    //                     key: 'auth-logout2',
    //                     label: 'Logout 2',
    //                     url: '/account/logout2',
    //                     parentKey: 'auth-pages',
    //                 },
    //                 {
    //                     key: 'auth-recover-password',
    //                     label: 'Recover Password',
    //                     url: '/account/recover-password',
    //                     parentKey: 'auth-pages',
    //                 },
    //                 {
    //                     key: 'auth-recover-password2',
    //                     label: 'Recover Password 2',
    //                     url: '/account/recover-password2',
    //                     parentKey: 'auth-pages',
    //                 },
    //                 {
    //                     key: 'auth-lock-screen',
    //                     label: 'Lock Screen',
    //                     url: '/account/lock-screen',
    //                     parentKey: 'auth-pages',
    //                 },
    //                 {
    //                     key: 'auth-lock-screen2',
    //                     label: 'Lock Screen 2',
    //                     url: '/account/lock-screen2',
    //                     parentKey: 'auth-pages',
    //                 },
    //                 {
    //                     key: 'auth-confirm-mail',
    //                     label: 'Confirm Mail',
    //                     url: '/account/confirm-mail',
    //                     parentKey: 'auth-pages',
    //                 },
    //                 {
    //                     key: 'auth-confirm-mail2',
    //                     label: 'Confirm Mail 2',
    //                     url: '/account/confirm-mail2',
    //                     parentKey: 'auth-pages',
    //                 },
    //             ],
    //         },
    //         {
    //             key: 'error-pages',
    //             label: 'Error',
    //             url: '/error',
    //             parentKey: 'pages',
    //             children: [
    //                 {
    //                     key: 'error-404',
    //                     label: 'Error - 404',
    //                     url: '/error/404',
    //                     parentKey: 'error-pages',
    //                 },
    //                 {
    //                     key: 'error-404-alt',
    //                     label: 'Error - 404-alt',
    //                     url: '/pages/404-alt',
    //                     parentKey: 'error-pages',
    //                 },
    //                 {
    //                     key: 'error-500',
    //                     label: 'Error - 500',
    //                     url: '/error/500',
    //                     parentKey: 'error-pages',
    //                 },
    //             ],
    //         },
    //         {
    //             key: 'page-starter',
    //             label: 'Starter Page',
    //             url: '/pages/starter',
    //             parentKey: 'pages',
    //         },
    //         {
    //             key: 'page-preloader',
    //             label: 'With Preloader',
    //             url: '/pages/preloader',
    //             parentKey: 'pages',
    //         },
    //         {
    //             key: 'page-timeline',
    //             label: 'Timeline',
    //             url: '/pages/timeline',
    //             parentKey: 'pages',
    //         },
    //     ],
    // },
    // {
    //     key: 'landing',
    //     label: 'Landing',
    //     isTitle: false,
    //     icon: 'uil-globe',
    //     url: '/landing',
    //     target: '_blank',
    //     badge: {variant: 'secondary', text: 'New'},
    // },
    // {
    //     key: 'layouts',
    //     label: 'Layouts',
    //     isTitle: false,
    //     icon: 'uil-window',
    //     children: [
    //         {
    //             key: 'layouts-dark',
    //             label: 'Dark',
    //             url: '/layouts/dark',
    //             parentKey: 'layouts',
    //         },
    //         {
    //             key: 'layouts-horizontal',
    //             label: 'Horizontal',
    //             url: '/layouts/horizontal',
    //             parentKey: 'layouts',
    //         },
    //         {
    //             key: 'layouts-detached',
    //             label: 'Detached',
    //             url: '/layouts/detached',
    //             parentKey: 'layouts',
    //         },
    //         {
    //             key: 'layouts-hover',
    //             label: 'Hover',
    //             url: '/layouts/hover',
    //             parentKey: 'layouts',
    //         },
    //         {
    //             key: 'layouts-compact',
    //             label: 'Compact',
    //             url: '/layouts/compact',
    //             parentKey: 'layouts',
    //         },
    //         {
    //             key: 'layouts-icon-view',
    //             label: 'Icon View',
    //             url: '/layouts/icon-view',
    //             parentKey: 'layouts',
    //         },
    //         {
    //             key: 'layouts-full',
    //             label: 'Full',
    //             url: '/layouts/full',
    //             parentKey: 'layouts',
    //         },
    //         {
    //             key: 'layouts-fullscreen',
    //             label: 'Full Screen',
    //             url: '/layouts/fullscreen',
    //             parentKey: 'layouts',
    //         },
    //     ],
    // },
    {key: 'components', label: 'Components', isTitle: true},
    {
        key: 'base-ui',
        label: 'Base UI',
        isTitle: false,
        icon: 'uil-box',
        children: [
            {
                key: 'base-ui-accordions',
                label: 'Accordions & Collapse',
                url: '/ui/base-ui/accordions',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-alerts',
                label: 'Alerts',
                url: '/ui/base-ui/alerts',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-avatars',
                label: 'Avatars',
                url: '/ui/base-ui/avatars',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-badges',
                label: 'Badges',
                url: '/ui/base-ui/badges',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-breadcrumb',
                label: 'Breadcrumb',
                url: '/ui/base-ui/breadcrumb',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-buttons',
                label: 'Buttons',
                url: '/ui/base-ui/buttons',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-cards',
                label: 'Cards',
                url: '/ui/base-ui/cards',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-carousel',
                label: 'Carousel',
                url: '/ui/base-ui/carousel',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-dropdown',
                label: 'Dropdowns',
                url: '/ui/base-ui/dropdowns',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-embedvideo',
                label: 'Embed Video',
                url: '/ui/base-ui/embed',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-grid',
                label: 'Grid',
                url: '/ui/base-ui/grid',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-listgroups',
                label: 'List Group',
                url: '/ui/base-ui/listgroups',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-modals',
                label: 'Modals',
                url: '/ui/base-ui/modals',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-notifications',
                label: 'Notifications',
                url: '/ui/base-ui/notifications',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-offcanvas',
                label: 'Offcanvas',
                url: '/ui/base-ui/offcanvas',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-placeholders',
                label: 'Placeholders',
                url: '/ui/base-ui/placeholders',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-paginations',
                label: 'Pagination',
                url: '/ui/base-ui/pagination',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-popovers',
                label: 'Popovers',
                url: '/ui/base-ui/popovers',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-progress',
                label: 'Progress',
                url: '/ui/base-ui/progress',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-ribbons',
                label: 'Ribbons',
                url: '/ui/base-ui/ribbons',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-spinners',
                label: 'Spinners',
                url: '/ui/base-ui/spinners',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-tabs',
                label: 'Tabs',
                url: '/ui/base-ui/tabs',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-tooltips',
                label: 'Tooltips',
                url: '/ui/base-ui/tooltips',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-links',
                label: 'Links',
                url: '/ui/base-ui/links',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-typography',
                label: 'Typography',
                url: '/ui/base-ui/typography',
                parentKey: 'base-ui',
            },
            {
                key: 'base-ui-utilities',
                label: 'Utilities',
                url: '/ui/base-ui/utilities',
                parentKey: 'base-ui',
            },
        ],
    },
    {
        key: 'extended-ui',
        label: 'Extended UI',
        isTitle: false,
        icon: 'uil-package',
        children: [
            {
                key: 'extended-ui-dragdrop',
                label: 'Drag and Drop',
                url: '/ui/extended/dragdrop',
                parentKey: 'extended-ui',
            },
            {
                key: 'extended-ui-rangesliders',
                label: 'Range Sliders',
                url: '/ui/extended/rangesliders',
                parentKey: 'extended-ui',
            },
            {
                key: 'extended-ui-ratings',
                label: 'Ratings',
                url: '/ui/extended/ratings',
                parentKey: 'extended-ui',
            },
            {
                key: 'extended-ui-scrollbar',
                label: 'Scrollbar',
                url: '/ui/extended/scrollbar',
                parentKey: 'extended-ui',
            },
        ],
    },
    {
        key: 'widgets',
        label: 'Widgets',
        isTitle: false,
        icon: 'uil-layer-group',
        url: '/ui/widgets',
    },
    {
        key: 'icons',
        label: 'Icons',
        isTitle: false,
        icon: 'uil-streering',
        children: [
            {
                key: 'icon-remix',
                label: 'Remix Icons',
                url: '/ui/icons/remix',
                parentKey: 'icons',
            },
            {
                key: 'icon-mdiicons',
                label: 'Material Design',
                url: '/ui/icons/mdi',
                parentKey: 'icons',
            },
            {
                key: 'icon-unicons',
                label: 'Unicons',
                url: '/ui/icons/unicons',
                parentKey: 'icons',
            },
            {
                key: 'icon-lucide',
                label: 'Lucide',
                url: '/ui/icons/lucide',
                parentKey: 'icons',
            },
        ],
    },
    {
        key: 'charts',
        label: 'Charts',
        isTitle: false,
        icon: 'ri-bar-chart-line',
        children: [
            {
                key: 'apex-charts',
                label: 'Apex Charts',
                url: '/',
                parentKey: 'charts',
                children: [
                    {
                        key: 'area-apex',
                        label: 'Area',
                        url: '/ui/charts/apex/area',
                        parentKey: 'apex-charts',
                    },
                    {
                        key: 'bar-apex',
                        label: 'Bar',
                        url: '/ui/charts/apex/bar',
                        parentKey: 'apex-charts',
                    },
                    {
                        key: 'bubble-apex',
                        label: 'Bubble',
                        url: '/ui/charts/apex/bubble',
                        parentKey: 'apex-charts',
                    },
                    {
                        key: 'candlestick-apex',
                        label: 'Candlestick',
                        url: '/ui/charts/apex/candlestick',
                        parentKey: 'apex-charts',
                    },
                    {
                        key: 'column-apex',
                        label: 'Column',
                        url: '/ui/charts/apex/column',
                        parentKey: 'apex-charts',
                    },
                    {
                        key: 'heatmap-apex',
                        label: 'Heatmap',
                        url: '/ui/charts/apex/heatmap',
                        parentKey: 'apex-charts',
                    },
                    {
                        key: 'line-apex',
                        label: 'Line',
                        url: '/ui/charts/apex/line',
                        parentKey: 'apex-charts',
                    },
                    {
                        key: 'mixed-apex',
                        label: 'Mixed',
                        url: '/ui/charts/apex/mixed',
                        parentKey: 'apex-charts',
                    },
                    {
                        key: 'timeline-apex',
                        label: 'Timeline',
                        url: '/ui/charts/apex/timeline',
                        parentKey: 'apex-charts',
                    },
                    {
                        key: 'boxplot-apex',
                        label: 'Boxplot',
                        url: '/ui/charts/apex/boxplot',
                        parentKey: 'apex-charts',
                    },
                    {
                        key: 'treemap-apex',
                        label: 'Treemap',
                        url: '/ui/charts/apex/treemap',
                        parentKey: 'apex-charts',
                    },
                    {
                        key: 'pie-apex',
                        label: 'Pie',
                        url: '/ui/charts/apex/pie',
                        parentKey: 'apex-charts',
                    },
                    {
                        key: 'radar-apex',
                        label: 'Radar',
                        url: '/ui/charts/apex/radar',
                        parentKey: 'apex-charts',
                    },
                    {
                        key: 'radialbar-apex',
                        label: 'RadialBar',
                        url: '/ui/charts/apex/radialbar',
                        parentKey: 'apex-charts',
                    },
                    {
                        key: 'scatter-apex',
                        label: 'Scatter',
                        url: '/ui/charts/apex/scatter',
                        parentKey: 'apex-charts',
                    },
                    {
                        key: 'polararea-apex',
                        label: 'Polar Area',
                        url: '/ui/charts/apex/polararea',
                        parentKey: 'apex-charts',
                    },
                    {
                        key: 'sparklines-apex',
                        label: 'Sparklines',
                        url: '/ui/charts/apex/sparklines',
                        parentKey: 'apex-charts',
                    },
                ],
            },
            {
                key: 'chartjs-charts',
                label: 'ChartJS',
                url: '/',
                parentKey: 'charts',
                children: [
                    {
                        key: 'area-chartjs',
                        label: 'Area',
                        url: '/ui/charts/chartjs/area',
                        parentKey: 'chartjs-charts',
                    },
                    {
                        key: 'bar-chartjs',
                        label: 'Bar',
                        url: '/ui/charts/chartjs/bar',
                        parentKey: 'chartjs-charts',
                    },
                    {
                        key: 'line-chartjs',
                        label: 'Line',
                        url: '/ui/charts/chartjs/line',
                        parentKey: 'chartjs-charts',
                    },
                    {
                        key: 'other-chartjs',
                        label: 'Other',
                        url: '/ui/charts/chartjs/other',
                        parentKey: 'chartjs-charts',
                    },
                ],
            },
            {
                key: 'sparklines-charts',
                label: 'Sparklines Charts',
                url: '/ui/charts/sparklines',
                parentKey: 'charts',
            },
        ],
    },
    {
        key: 'forms',
        label: 'Forms',
        isTitle: false,
        icon: 'uil-document-layout-center',
        children: [
            {
                key: 'form-basic',
                label: 'Basic Elements',
                url: '/ui/forms/basic',
                parentKey: 'forms',
            },
            {
                key: 'form-advanced',
                label: 'Form Advanced',
                url: '/ui/forms/advanced',
                parentKey: 'forms',
            },
            {
                key: 'form-validation',
                label: 'Validation',
                url: '/ui/forms/validation',
                parentKey: 'forms',
            },
            {
                key: 'form-wizard',
                label: 'Wizard',
                url: '/ui/forms/wizard',
                parentKey: 'forms',
            },
            {
                key: 'form-upload',
                label: 'File Upload',
                url: '/ui/forms/upload',
                parentKey: 'forms',
            },
            {
                key: 'form-editors',
                label: 'Editors',
                url: '/ui/forms/editors',
                parentKey: 'forms',
            },
        ],
    },
    {
        key: 'tables',
        label: 'Tables',
        isTitle: false,
        icon: 'uil-table',
        children: [
            {
                key: 'table-basic',
                label: 'Basic Tables',
                url: '/ui/tables/basic',
                parentKey: 'tables',
            },
            {
                key: 'table-advanced',
                label: 'Advanced Tables',
                url: '/ui/tables/advanced',
                parentKey: 'tables',
            },
        ],
    },
    {
        key: 'maps',
        label: 'Maps',
        isTitle: false,
        icon: 'uil-location-point',
        children: [
            {
                key: 'maps-googlemaps',
                label: 'Google Maps',
                url: '/ui/maps/googlemaps',
                parentKey: 'maps',
            },
            {
                key: 'maps-vectormaps',
                label: 'Vector Maps',
                url: '/ui/maps/vectormaps',
                parentKey: 'maps',
            },
        ],
    },
    {
        key: 'menu-levels',
        label: 'Multi Levels',
        isTitle: false,
        icon: 'uil-folder-plus',
        children: [
            {
                key: 'menu-levels-1-1',
                label: 'Level 1.1',
                url: '/',
                parentKey: 'menu-levels',
                children: [
                    {
                        key: 'menu-levels-2-1',
                        label: 'Level 2.1',
                        url: '/',
                        parentKey: 'menu-levels-1-1',
                        children: [
                            {
                                key: 'menu-levels-3-1',
                                label: 'Level 3.1',
                                url: '/',
                                parentKey: 'menu-levels-2-1',
                            },
                            {
                                key: 'menu-levels-3-2',
                                label: 'Level 3.2',
                                url: '/',
                                parentKey: 'menu-levels-2-1',
                            },
                        ],
                    },
                    {
                        key: 'menu-levels-2-2',
                        label: 'Level 2.2',
                        url: '/',
                        parentKey: 'menu-levels-1-1',
                    },
                ],
            },
            {
                key: 'menu-levels-1-2',
                label: 'Level 1.2',
                url: '/',
                parentKey: 'menu-levels',
            },
        ],
    },
];

const HORIZONTAL_MENU_ITEMS_BASE: MenuItemType[] = [
    {
        key: 'dashboards',
        icon: 'uil-dashboard',
        label: 'Dashboards',
        isTitle: true,
        children: [
            {
                key: 'ds-analytics',
                label: 'Analytics',
                url: '/dashboards/analytics',
                parentKey: 'dashboards',
            },
            {
                key: 'ds-ecommerce',
                label: 'Ecommerce',
                url: '/dashboards/ecommerce',
                parentKey: 'dashboards',
            },
            {
                key: 'ds-project',
                label: 'Projects',
                url: '/dashboards/project',
                parentKey: 'dashboards',
            },
            {
                key: 'ds-crm',
                label: 'CRM',
                url: '/dashboards/crm',
                parentKey: 'dashboards',
            },
            {
                key: 'ds-ewallet',
                label: 'E-Wallet',
                url: '/dashboards/e-wallet',
                parentKey: 'dashboards',
            },
        ],
    },
    {
        key: 'apps',
        icon: 'uil-apps',
        label: 'Apps',
        isTitle: true,
        children: [
            {
                key: 'apps-calendar',
                label: 'Calendar',
                url: '/apps/calendar',
                parentKey: 'apps',
            },
            {
                key: 'apps-chat',
                label: 'Chat',
                url: '/apps/chat',
                parentKey: 'apps',
            },
            {
                key: 'apps-crm',
                label: 'CRM',
                parentKey: 'apps',
                children: [
                    {
                        key: 'crm-projects',
                        label: 'Projects',
                        url: '/apps/crm/projects',
                        parentKey: 'apps-crm',
                    },
                    {
                        key: 'crm-orders',
                        label: 'Orders List',
                        url: '/apps/crm/orders',
                        parentKey: 'apps-crm',
                    },
                    {
                        key: 'crm-clients',
                        label: 'Clients',
                        url: '/apps/crm/clients',
                        parentKey: 'apps-crm',
                    },
                    {
                        key: 'crm-management',
                        label: 'Management',
                        url: '/apps/crm/management',
                        parentKey: 'apps-crm',
                    },
                ],
            },
            {
                key: 'apps-cases',
                label: 'Casos',
                parentKey: 'apps',
                children: [
                    {
                        key: 'cases',
                        label: 'Lista',
                        url: '/apps/crm/projects',
                        parentKey: 'apps-crm',
                    },
                    {
                        key: 'crm-orders',
                        label: 'Orders List',
                        url: '/apps/crm/orders',
                        parentKey: 'apps-crm',
                    },
                    {
                        key: 'crm-clients',
                        label: 'Clients',
                        url: '/apps/crm/clients',
                        parentKey: 'apps-crm',
                    },
                    {
                        key: 'crm-management',
                        label: 'Management',
                        url: '/apps/crm/management',
                        parentKey: 'apps-crm',
                    },
                ],
            },
            {
                key: 'apps-diversos',
                label: 'Diversos',
                parentKey: 'apps',
                // badge: {variant: 'success', text: 'Novo'},
                children: [
                    {
                        key: 'diversos-notificacoes',
                        label: 'Notificações',
                        url: '/apps/mensagens/list',
                        parentKey: 'apps-diversos',
                    },
                ],
            },
            {
                key: 'apps-ecommerce',
                label: 'Ecommerce',
                parentKey: 'apps',
                children: [
                    {
                        key: 'ecommerce-products',
                        label: 'Products',
                        url: '/apps/ecommerce/products',
                        parentKey: 'apps-ecommerce',
                    },
                    {
                        key: 'ecommerce-details',
                        label: 'Products Details',
                        url: '/apps/ecommerce/product-details',
                        parentKey: 'apps-ecommerce',
                    },
                    {
                        key: 'ecommerce-orders',
                        label: 'Orders',
                        url: '/apps/ecommerce/orders',
                        parentKey: 'apps-ecommerce',
                    },
                    {
                        key: 'ecommerce-order-details',
                        label: 'Order Details',
                        url: '/apps/ecommerce/order-details',
                        parentKey: 'apps-ecommerce',
                    },
                    {
                        key: 'ecommerce-customers',
                        label: 'Customers',
                        url: '/apps/ecommerce/customers',
                        parentKey: 'apps-ecommerce',
                    },
                    {
                        key: 'ecommerce-shopping-cart',
                        label: 'Shopping Cart',
                        url: '/apps/ecommerce/shopping-cart',
                        parentKey: 'apps-ecommerce',
                    },
                    {
                        key: 'ecommerce-checkout',
                        label: 'Checkout',
                        url: '/apps/ecommerce/checkout',
                        parentKey: 'apps-ecommerce',
                    },
                    {
                        key: 'ecommerce-sellers',
                        label: 'Sellers',
                        url: '/apps/ecommerce/sellers',
                        parentKey: 'apps-ecommerce',
                    },
                ],
            },
            {
                key: 'apps-email',
                label: 'Email',
                parentKey: 'apps',
                children: [
                    {
                        key: 'email-inbox',
                        label: 'Inbox',
                        url: '/apps/email/inbox',
                        parentKey: 'apps-email',
                    },
                    {
                        key: 'email-read-email',
                        label: 'Read Email',
                        url: '/apps/email/read',
                        parentKey: 'apps-email',
                    },
                ],
            },
            {
                key: 'apps-projects',
                label: 'Projects',
                parentKey: 'apps',
                children: [
                    {
                        key: 'project-list',
                        label: 'List',
                        url: '/apps/projects/list',
                        parentKey: 'apps-projects',
                    },
                    {
                        key: 'project-details',
                        label: 'Details',
                        url: '/apps/projects/details',
                        parentKey: 'apps-projects',
                    },
                    {
                        key: 'project-gantt',
                        label: 'Gantt',
                        url: '/apps/projects/gantt',
                        parentKey: 'apps-projects',
                    },
                    {
                        key: 'project-create-project',
                        label: 'Create Project',
                        url: '/apps/projects/create',
                        parentKey: 'apps-projects',
                    },
                ],
            },
            {
                key: 'apps-social',
                label: 'Social Feed',
                url: '/apps/social',
                parentKey: 'apps',
            },
            {
                key: 'apps-tasks',
                label: 'Tasks',
                parentKey: 'apps',
                children: [
                    {
                        key: 'task-list',
                        label: 'List',
                        url: '/apps/tasks/list',
                        parentKey: 'apps-tasks',
                    },
                    {
                        key: 'task-details',
                        label: 'Details',
                        url: '/apps/tasks/details',
                        parentKey: 'apps-tasks',
                    },
                    {
                        key: 'task-kanban',
                        label: 'Kanban Board',
                        url: '/apps/tasks/kanban',
                        parentKey: 'apps-tasks',
                    },
                ],
            },
            {
                key: 'apps-file-manager',
                label: 'File Manager',
                url: '/apps/file',
                parentKey: 'apps',
            },
        ],
    },
    {
        key: 'pages',
        icon: 'uil-copy-alt',
        label: 'Pages',
        isTitle: true,
        children: [
            {
                key: 'auth-pages',
                label: 'Authentication',
                url: '/account',
                parentKey: 'pages',
                children: [
                    {
                        key: 'auth-login',
                        label: 'Login',
                        url: '/account/login',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-login2',
                        label: 'Login 2',
                        url: '/account/login2',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-register',
                        label: 'Register',
                        url: '/account/register',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-register2',
                        label: 'Register 2',
                        url: '/account/register2',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-logout',
                        label: 'Logout',
                        url: '/account/logout',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-logout2',
                        label: 'Logout 2',
                        url: '/account/logout2',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-recover-password',
                        label: 'Recover Password',
                        url: '/account/recover-password',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-recover-password2',
                        label: 'Recover Password 2',
                        url: '/account/recover-password2',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-lock-screen',
                        label: 'Lock Screen',
                        url: '/account/lock-screen',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-lock-screen2',
                        label: 'Lock Screen 2',
                        url: '/account/lock-screen2',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-confirm-mail',
                        label: 'Confirm Mail',
                        url: '/account/confirm-mail',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-confirm-mail2',
                        label: 'Confirm Mail 2',
                        url: '/account/confirm-mail2',
                        parentKey: 'auth-pages',
                    },
                ],
            },
            {
                key: 'error-pages',
                label: 'Error',
                url: '/error',
                parentKey: 'pages',
                children: [
                    {
                        key: 'error-404',
                        label: 'Error - 404',
                        url: '/error/404',
                        parentKey: 'error-pages',
                    },
                    {
                        key: 'error-404-alt',
                        label: 'Error - 404-alt',
                        url: '/pages/404-alt',
                        parentKey: 'error-pages',
                    },
                    {
                        key: 'error-500',
                        label: 'Error - 500',
                        url: '/error/500',
                        parentKey: 'error-pages',
                    },
                ],
            },
            {
                key: 'page-starter',
                label: 'Starter Page',
                url: '/pages/starter',
                parentKey: 'pages',
            },
            {
                key: 'page-preloader',
                label: 'With Preloader',
                url: '/pages/preloader',
                parentKey: 'pages',
            },
            {
                key: 'page-profile',
                label: 'Profile',
                url: '/pages/profile',
                parentKey: 'pages',
            },
            {
                key: 'page-profile2',
                label: 'Profile 2',
                url: '/pages/profile2',
                parentKey: 'pages',
            },
            {
                key: 'page-invoice',
                label: 'Invoice',
                url: '/pages/invoice',
                parentKey: 'pages',
            },
            {
                key: 'page-faq',
                label: 'FAQ',
                url: '/pages/faq',
                parentKey: 'pages',
            },
            {
                key: 'page-pricing',
                label: 'Pricing',
                url: '/pages/pricing',
                parentKey: 'pages',
            },
            {
                key: 'page-maintenance',
                label: 'Maintenance',
                url: '/error/maintenance',
                target: '_blank',
                parentKey: 'pages',
            },
            {
                key: 'page-timeline',
                label: 'Timeline',
                url: '/pages/timeline',
                parentKey: 'pages',
            },
            {
                key: 'page-landing',
                label: 'Landing',
                url: '/landing',
                target: '_blank',
                parentKey: 'pages',
            },
        ],
    },
    {
        key: 'components',
        icon: 'uil-package',
        label: 'Components',
        isTitle: true,
        children: [
            {
                key: 'widgets',
                label: 'Widgets',
                url: '/ui/widgets',
                parentKey: 'components',
            },
            {
                key: 'base-ui1',
                label: 'Base UI 1',
                parentKey: 'components',
                children: [
                    {
                        key: 'base-ui-accordions',
                        label: 'Accordions & Collapse',
                        url: '/ui/base-ui/accordions',
                        parentKey: 'base-ui1',
                    },
                    {
                        key: 'base-ui-alerts',
                        label: 'Alerts',
                        url: '/ui/base-ui/alerts',
                        parentKey: 'base-ui1',
                    },
                    {
                        key: 'base-ui-avatars',
                        label: 'Avatars',
                        url: '/ui/base-ui/avatars',
                        parentKey: 'base-ui1',
                    },
                    {
                        key: 'base-ui-badges',
                        label: 'Badges',
                        url: '/ui/base-ui/badges',
                        parentKey: 'base-ui1',
                    },
                    {
                        key: 'base-ui-breadcrumb',
                        label: 'Breadcrumb',
                        url: '/ui/base-ui/breadcrumb',
                        parentKey: 'base-ui1',
                    },
                    {
                        key: 'base-ui-buttons',
                        label: 'Buttons',
                        url: '/ui/base-ui/buttons',
                        parentKey: 'base-ui1',
                    },
                    {
                        key: 'base-ui-cards',
                        label: 'Cards',
                        url: '/ui/base-ui/cards',
                        parentKey: 'base-ui1',
                    },
                    {
                        key: 'base-ui-carousel',
                        label: 'Carousel',
                        url: '/ui/base-ui/carousel',
                        parentKey: 'base-ui1',
                    },
                    {
                        key: 'base-ui-dropdown',
                        label: 'Dropdowns',
                        url: '/ui/base-ui/dropdowns',
                        parentKey: 'base-ui1',
                    },
                    {
                        key: 'base-ui-embedvideo',
                        label: 'Embed Video',
                        url: '/ui/base-ui/embed',
                        parentKey: 'base-ui1',
                    },
                    {
                        key: 'base-ui-grid',
                        label: 'Grid',
                        url: '/ui/base-ui/grid',
                        parentKey: 'base-ui1',
                    },
                    {
                        key: 'base-ui-listgroups',
                        label: 'List Group',
                        url: '/ui/base-ui/listgroups',
                        parentKey: 'base-ui1',
                    },
                ],
            },
            {
                key: 'base-ui2',
                label: 'Base UI 2',
                parentKey: 'components',
                children: [
                    {
                        key: 'base-ui-modals',
                        label: 'Modals',
                        url: '/ui/base-ui/modals',
                        parentKey: 'base-ui2',
                    },
                    {
                        key: 'base-ui-notifications',
                        label: 'Notifications',
                        url: '/ui/base-ui/notifications',
                        parentKey: 'base-ui2',
                    },
                    {
                        key: 'base-ui-offcanvas',
                        label: 'Offcanvas',
                        url: '/ui/base-ui/offcanvas',
                        parentKey: 'base-ui2',
                    },
                    {
                        key: 'base-ui-placeholders',
                        label: 'Placeholders',
                        url: '/ui/base-ui/placeholders',
                        parentKey: 'base-ui2',
                    },
                    {
                        key: 'base-ui-paginations',
                        label: 'Pagination',
                        url: '/ui/base-ui/pagination',
                        parentKey: 'base-ui2',
                    },
                    {
                        key: 'base-ui-popovers',
                        label: 'Popovers',
                        url: '/ui/base-ui/popovers',
                        parentKey: 'base-ui2',
                    },
                    {
                        key: 'base-ui-progress',
                        label: 'Progress',
                        url: '/ui/base-ui/progress',
                        parentKey: 'base-ui2',
                    },
                    {
                        key: 'base-ui-ribbons',
                        label: 'Ribbons',
                        url: '/ui/base-ui/ribbons',
                        parentKey: 'base-ui2',
                    },
                    {
                        key: 'base-ui-spinners',
                        label: 'Spinners',
                        url: '/ui/base-ui/spinners',
                        parentKey: 'base-ui2',
                    },
                    {
                        key: 'base-ui-tabs',
                        label: 'Tabs',
                        url: '/ui/base-ui/tabs',
                        parentKey: 'base-ui2',
                    },
                    {
                        key: 'base-ui-tooltips',
                        label: 'Tooltips',
                        url: '/ui/base-ui/tooltips',
                        parentKey: 'base-ui2',
                    },
                    {
                        key: 'base-ui-links',
                        label: 'Links',
                        url: '/ui/base-ui/links',
                        parentKey: 'base-ui2',
                    },
                    {
                        key: 'base-ui-typography',
                        label: 'Typography',
                        url: '/ui/base-ui/typography',
                        parentKey: 'base-ui2',
                    },
                    {
                        key: 'base-ui-utilities',
                        label: 'Utilities',
                        url: '/ui/base-ui/utilities',
                        parentKey: 'base-ui2',
                    },
                ],
            },
            {
                key: 'extended-ui',
                label: 'Extended UI',
                parentKey: 'components',
                children: [
                    {
                        key: 'extended-ui-dragdrop',
                        label: 'Drag and Drop',
                        url: '/ui/extended/dragdrop',
                        parentKey: 'extended-ui',
                    },
                    {
                        key: 'extended-ui-rangesliders',
                        label: 'Range Sliders',
                        url: '/ui/extended/rangesliders',
                        parentKey: 'extended-ui',
                    },
                    {
                        key: 'extended-ui-ratings',
                        label: 'Ratings',
                        url: '/ui/extended/ratings',
                        parentKey: 'extended-ui',
                    },
                    {
                        key: 'extended-ui-scrollbar',
                        label: 'Scrollbar',
                        url: '/ui/extended/scrollbar',
                        parentKey: 'extended-ui',
                    },
                ],
            },
            {
                key: 'forms',
                label: 'Forms',
                parentKey: 'components',
                children: [
                    {
                        key: 'form-basic',
                        label: 'Basic Elements',
                        url: '/ui/forms/basic',
                        parentKey: 'forms',
                    },
                    {
                        key: 'form-advanced',
                        label: 'Form Advanced',
                        url: '/ui/forms/advanced',
                        parentKey: 'forms',
                    },
                    {
                        key: 'form-validation',
                        label: 'Validation',
                        url: '/ui/forms/validation',
                        parentKey: 'forms',
                    },
                    {
                        key: 'form-wizard',
                        label: 'Wizard',
                        url: '/ui/forms/wizard',
                        parentKey: 'forms',
                    },
                    {
                        key: 'form-upload',
                        label: 'File Upload',
                        url: '/ui/forms/upload',
                        parentKey: 'forms',
                    },
                    {
                        key: 'form-editors',
                        label: 'Editors',
                        url: '/ui/forms/editors',
                        parentKey: 'forms',
                    },
                ],
            },
            {
                key: 'charts',
                label: 'Charts',
                parentKey: 'components',
                children: [
                    {
                        key: 'apex-charts',
                        label: 'Apex Charts',
                        url: '/',
                        parentKey: 'charts',
                        children: [
                            {
                                key: 'area-apex',
                                label: 'Area',
                                url: '/ui/charts/apex/area',
                                parentKey: 'apex-charts',
                            },
                            {
                                key: 'bar-apex',
                                label: 'Bar',
                                url: '/ui/charts/apex/bar',
                                parentKey: 'apex-charts',
                            },
                            {
                                key: 'bubble-apex',
                                label: 'Bubble',
                                url: '/ui/charts/apex/bubble',
                                parentKey: 'apex-charts',
                            },
                            {
                                key: 'candlestick-apex',
                                label: 'Candlestick',
                                url: '/ui/charts/apex/candlestick',
                                parentKey: 'apex-charts',
                            },
                            {
                                key: 'column-apex',
                                label: 'Column',
                                url: '/ui/charts/apex/column',
                                parentKey: 'apex-charts',
                            },
                            {
                                key: 'heatmap-apex',
                                label: 'Heatmap',
                                url: '/ui/charts/apex/heatmap',
                                parentKey: 'apex-charts',
                            },
                            {
                                key: 'line-apex',
                                label: 'Line',
                                url: '/ui/charts/apex/line',
                                parentKey: 'apex-charts',
                            },
                            {
                                key: 'mixed-apex',
                                label: 'Mixed',
                                url: '/ui/charts/apex/mixed',
                                parentKey: 'apex-charts',
                            },
                            {
                                key: 'timeline-apex',
                                label: 'Timeline',
                                url: '/ui/charts/apex/timeline',
                                parentKey: 'apex-charts',
                            },
                            {
                                key: 'boxplot-apex',
                                label: 'Boxplot',
                                url: '/ui/charts/apex/boxplot',
                                parentKey: 'apex-charts',
                            },
                            {
                                key: 'treemap-apex',
                                label: 'Treemap',
                                url: '/ui/charts/apex/treemap',
                                parentKey: 'apex-charts',
                            },
                            {
                                key: 'pie-apex',
                                label: 'Pie',
                                url: '/ui/charts/apex/pie',
                                parentKey: 'apex-charts',
                            },
                            {
                                key: 'radar-apex',
                                label: 'Radar',
                                url: '/ui/charts/apex/radar',
                                parentKey: 'apex-charts',
                            },
                            {
                                key: 'radialbar-apex',
                                label: 'RadialBar',
                                url: '/ui/charts/apex/radialbar',
                                parentKey: 'apex-charts',
                            },
                            {
                                key: 'scatter-apex',
                                label: 'Scatter',
                                url: '/ui/charts/apex/scatter',
                                parentKey: 'apex-charts',
                            },
                            {
                                key: 'polararea-apex',
                                label: 'Polar Area',
                                url: '/ui/charts/apex/polararea',
                                parentKey: 'apex-charts',
                            },
                            {
                                key: 'sparklines-apex',
                                label: 'Sparklines',
                                url: '/ui/charts/apex/sparklines',
                                parentKey: 'apex-charts',
                            },
                        ],
                    },
                    {
                        key: 'chartjs-charts',
                        label: 'ChartJS',
                        url: '/',
                        parentKey: 'charts',
                        children: [
                            {
                                key: 'area-chartjs',
                                label: 'Area',
                                url: '/ui/charts/chartjs/area',
                                parentKey: 'chartjs-charts',
                            },
                            {
                                key: 'bar-chartjs',
                                label: 'Bar',
                                url: '/ui/charts/chartjs/bar',
                                parentKey: 'chartjs-charts',
                            },
                            {
                                key: 'line-chartjs',
                                label: 'Line',
                                url: '/ui/charts/chartjs/line',
                                parentKey: 'chartjs-charts',
                            },
                            {
                                key: 'other-chartjs',
                                label: 'Other',
                                url: '/ui/charts/chartjs/other',
                                parentKey: 'chartjs-charts',
                            },
                        ],
                    },
                    {
                        key: 'sparklines-charts',
                        label: 'Sparklines Charts',
                        url: '/ui/charts/sparklines',
                        parentKey: 'charts',
                    },
                ],
            },
            {
                key: 'tables',
                label: 'Tables',
                parentKey: 'components',
                children: [
                    {
                        key: 'table-basic',
                        label: 'Basic Tables',
                        url: '/ui/tables/basic',
                        parentKey: 'tables',
                    },
                    {
                        key: 'table-advanced',
                        label: 'Advanced Tables',
                        url: '/ui/tables/advanced',
                        parentKey: 'tables',
                    },
                ],
            },
            {
                key: 'icons',
                label: 'Icons',
                parentKey: 'components',
                children: [
                    {
                        key: 'icon-remix',
                        label: 'Remix Icons',
                        url: '/ui/icons/remix',
                        parentKey: 'icons',
                    },
                    {
                        key: 'icon-mdiicons',
                        label: 'Material Design',
                        url: '/ui/icons/mdi',
                        parentKey: 'icons',
                    },
                    {
                        key: 'icon-unicons',
                        label: 'Unicons',
                        url: '/ui/icons/unicons',
                        parentKey: 'icons',
                    },
                    {
                        key: 'icon-lucide',
                        label: 'Lucide',
                        url: '/ui/icons/lucide',
                        parentKey: 'icons',
                    },
                ],
            },
            {
                key: 'maps',
                label: 'Maps',
                parentKey: 'components',
                children: [
                    {
                        key: 'maps-googlemaps',
                        label: 'Google Maps',
                        url: '/ui/maps/googlemaps',
                        parentKey: 'maps',
                    },
                    {
                        key: 'maps-vectormaps',
                        label: 'Vector Maps',
                        url: '/ui/maps/vectormaps',
                        parentKey: 'maps',
                    },
                ],
            },
        ],
    },
    {
        key: 'layouts',
        label: 'Layouts',
        isTitle: false,
        icon: 'uil-window',
        children: [
            {
                key: 'layouts-dark',
                label: 'Dark',
                url: '/layouts/dark',
                parentKey: 'layouts',
            },
            {
                key: 'layouts-horizontal',
                label: 'Horizontal',
                url: '/layouts/horizontal',
                parentKey: 'layouts',
            },
            {
                key: 'layouts-detached',
                label: 'Detached',
                url: '/layouts/detached',
                parentKey: 'layouts',
            },
            {
                key: 'layouts-hover',
                label: 'Hover',
                url: '/layouts/hover',
                parentKey: 'layouts',
            },
            {
                key: 'layouts-compact',
                label: 'Compact',
                url: '/layouts/compact',
                parentKey: 'layouts',
            },
            {
                key: 'layouts-icon-view',
                label: 'Icon View',
                url: '/layouts/icon-view',
                parentKey: 'layouts',
            },
            {
                key: 'layouts-full',
                label: 'Full',
                url: '/layouts/full',
                parentKey: 'layouts',
            },
            {
                key: 'layouts-fullscreen',
                label: 'Full Screen',
                url: '/layouts/fullscreen',
                parentKey: 'layouts',
            },
        ],
    },
];

const MENU_ITEMS = isProductionEnv ? filterMenuItemsByVisibleKeys(MENU_ITEMS_BASE, PRODUCTION_SIDEBAR_VISIBLE_KEYS) : MENU_ITEMS_BASE;
const HORIZONTAL_MENU_ITEMS = isProductionEnv
    ? filterMenuItemsByVisibleKeys(HORIZONTAL_MENU_ITEMS_BASE, PRODUCTION_HORIZONTAL_VISIBLE_KEYS)
    : HORIZONTAL_MENU_ITEMS_BASE;

export {MENU_ITEMS, HORIZONTAL_MENU_ITEMS};
