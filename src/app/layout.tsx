import type {Metadata} from 'next';
import Image from 'next/image';
import logoDark from '@/assets/images/logo-dark.png';
import AppProvidersWrapper from '@/components/wrappers/AppProvidersWrapper';
import NextTopLoader from 'nextjs-toploader';

import '@smastrom/react-rating/style.css'
import 'react-quill-new/dist/quill.snow.css';
import 'react-quill-new/dist/quill.bubble.css';
import 'jsvectormap/dist/css/jsvectormap.min.css'
import '@/assets/scss/Saas.scss';

import logoSm from '@/assets/images/logo-sm.png';

export const metadata: Metadata = {
    title: {
        template: '%s | SoftFlow',
        default: 'SoftFlow',
    },
    description: 'A fully responsive admin theme which can be used to build CRM, CMS,ERP etc.',
    icons: {icon: logoSm.src}
};

const splashScreenStyles = `
#splash-screen {
  position: fixed;
  top: 50%;
  left: 50%;
  background: white;
  display: flex;
  height: 100%;
  width: 100%;
  transform: translate(-50%, -50%);
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 1;
  transition: all 15s linear;
  overflow: hidden;
}

#splash-screen.remove {
  animation: fadeout 0.7s forwards;
  z-index: 0;
}

@keyframes fadeout {
  to {
    opacity: 0;
    visibility: hidden;
  }
}
`;

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <style suppressHydrationWarning>{splashScreenStyles}</style>
        </head>
        <body>
        <div id="splash-screen">
            <Image alt="Logo" width={355} height={83} src={logoDark} style={{height: '5%', width: 'auto'}} priority/>
        </div>
        <NextTopLoader color="#4A5568" showSpinner={false}/>
        <div id="__next_splash">
            <AppProvidersWrapper>{children}</AppProvidersWrapper>
        </div>
        </body>
        </html>
    );
}
