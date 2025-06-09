import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { useState, Fragment } from 'react';
import { LayoutSidebarLeft } from "@/components/Presentdata/Icons";

const navSections = [
    {
        items: [
            { href: '/get-started', title: 'Getting Started', type: 'simple' },
            { href: '/features', title: 'Features', type: 'simple' },
            { href: '/architectures', title: 'Architectures', type: 'simple' },
        ]
    },
    {
        heading: 'Operating Systems',
        items: [
            { href: '/installation', title: 'Installation' },
            { href: '/os/windows', title: 'Windows' },
            { href: '/os/linux', title: 'Linux' },
        ]
    },
    {
        heading: 'Firewall',
        items: [
            { href: '/firewall/installation', title: 'Installation' },
            { href: '/firewall/software', title: 'Software Firewall' },
            { href: '/firewall/apis', title: 'Firewall APIs' },
            { href: '/firewall/mfa', title: 'MFA' },
            { href: '/firewall/waf', title: 'WAF' },
        ]
    },
    {
        heading: 'Security Solutions',
        items: [
            { href: '/security/alerts', title: 'Alerts' },
            { href: '/security/encryption', title: 'Encryption' },
            { href: '/security/filtering', title: 'Filtering' },
            { href: '/security/scanning', title: 'Scanning' },
            { href: '/security/patching', title: 'Patching' },
            { href: '/security/ai-threat-detection', title: 'AI Threat Detection' },
            { href: '/security/behavioral-analytics', title: 'Behavioral Analytics' },
            { href: '/security/automated-response', title: 'Automated Incident Response' },
        ]
    },
    {
        heading: 'Products',
        items: [
            { href: '/products/decentralized-firewall', title: 'Decentralized Firewall' },
            { href: '/products/protected-vpns', title: 'Protected VPNs' },
            { href: '/products/secure-cloud', title: 'Secure Cloud Storage' },
            { href: '/products/data-encryption', title: 'Data Encryption Services' },
        ]
    },
    {
        heading: 'Solutions',
        items: [
            { href: '/solutions/network-security', title: 'Network Security' },
            { href: '/solutions/cloud-protection', title: 'Cloud Protection' },
            { href: '/solutions/endpoint-defense', title: 'Endpoint Defense' },
            { href: '/solutions/security-analytics', title: 'Security Analytics' },
        ]
    },
    {
        heading: 'Resources',
        items: [
            { href: '/resources/documentation', title: 'Documentation' },
            { href: '/resources/tutorials', title: 'Tutorials' },
            { href: '/resources/whitepapers', title: 'Whitepapers' },
            { href: '/resources/webinars', title: 'Webinars' },
            { href: '/resources/faqs', title: 'FAQs' },
        ]
    }
];

interface SideNavLinkProps {
    href: string;
    title: string;
    type?: string;
}

const SideNavLink: React.FC<SideNavLinkProps> = ({ href, title }) => {
    const router = useRouter();
    const currentPath = router.pathname;
    const lastSegment = currentPath.split('/').filter(Boolean).pop();

    return (
        <Link href={href} className={`flex group items-center gap-2.5 focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-foreground-accent focus-visible:outline-none focus-visible:rounded w-fit`}>
            <div className="flex flex-col">
                <span className={`flex gap-2 items-center group-hover:text-foreground tracking-wide font-sans text-sm smooth-animation ${title.toLowerCase().replaceAll(" ", "-") === (lastSegment) ? "text-primary" : "text-foreground-accent"}`}>
                    {title}
                </span>
            </div>
        </Link>
    );
}

const SimpleSideNavLink: React.FC<SideNavLinkProps> = ({ href, title }) => {
    const router = useRouter();
    const currentPath = router.pathname;
    const firstSegment = currentPath.split('/')[1];
    const hrefSegment = href.split('/')[1] || '';
    const lastSegment = currentPath.split('/').filter(Boolean).pop();

    return (
        <Link href={href} className={`flex group items-center gap-2.5 w-fit focus-visible:ring-foreground-accent focus-visible:ring-2 focus-visible:outline-none focus-visible:rounded ${currentPath === href ? "text-primary" : "foreground-accent"}`}>
            <div className="flex flex-col">
                <span className={`flex gap-2 items-center group-hover:text-foreground tracking-wide font-sans text-sm smooth-animation ${firstSegment === (hrefSegment || lastSegment) ? "text-primary" : "text-foreground-accent"}`}>
                    {title}
                </span>
            </div>
        </Link>
    );
}

const MobileSideNavLink = ({ href, title, toggleSidebar }: { href: string, title: string, toggleSidebar: () => void }) => {
    const router = useRouter();
    const currentPath = router.pathname;

    return (
        <li onClick={toggleSidebar}>
            <Link href={href} className={`flex group items-center gap-2.5 focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-foreground-accent focus-visible:outline-none focus-visible:rounded w-fit`} >
                <div className="flex flex-col">
                    <span className={`flex gap-2 items-center group-hover:text-foreground tracking-wide font-sans text-sm smooth-animation ${currentPath === href ? "text-primary" : "text-foreground-accent"}`}>
                        {title}
                    </span>
                </div>
            </Link>
        </li>
    );
}

const MobileSimpleSideNavLink = ({ href, title, toggleSidebar }: { href: string, title: string, toggleSidebar: () => void }) => {
    const router = useRouter();
    const currentPath = router.pathname;

    return (
        <li onClick={toggleSidebar}>
            <Link href={href} className={`flex group items-center gap-2.5 w-fit focus-visible:ring-foreground-accent focus-visible:ring-2 focus-visible:outline-none focus-visible:rounded ${currentPath === href ? "text-primary" : "foreground-accent"}`} >
                <div className="flex flex-col">
                    <span className={`flex gap-2 items-center group-hover:text-foreground tracking-wide font-sans text-sm smooth-animation ${currentPath === href ? "text-primary" : "text-foreground-accent"}`}>
                        {title}
                    </span>
                </div>
            </Link>
        </li>
    );
}

const SideNavHeading = ({ title }: { title: string }) => {
    return (
        <li><span className="uppercase text-xs font-mono tracking-wider text-foreground-highlight">{title}</span></li>
    );
}

// const MobileSideNavHeading = ({ title, toggleSidebar }: { title: string, toggleSidebar: () => void }) => {
//     return (
//         <li onClick={toggleSidebar}><span className="uppercase text-xs font-mono tracking-wider text-foreground">{title}</span></li>
//     );
// }

const DocsSidebar = () => (
    <aside className="block sticky top-20 max-lg:hidden h-fit w-fit">
        <div className="h-4 w-full absolute bg-gradient-to-b from-background via-background to-transparent top-0" />
        <div className="h-4 w-full absolute bg-gradient-to-t from-background via-background to-transparent bottom-0" />

        <div className="w-60 py-4 smooth-animation text-foreground max-h-[85vh] overflow-y-auto overflow-x-hidden">
            <ul className="gap-4 flex flex-col items-start justify-center">
                {navSections.map((section, index) => (
                    <Fragment key={index}>
                        <div className="space-y-2">
                            {section.heading && <SideNavHeading title={section.heading} />}
                            {section.items.map(({ href, title, type }: SideNavLinkProps, i) => (
                                <li key={i}>
                                    {type === 'simple'
                                        ? <SimpleSideNavLink href={href} title={title} />
                                        : <SideNavLink href={href} title={title} />}
                                </li>
                            ))}
                        </div>
                        {index < navSections.length - 1 && (
                            <div className="h-[1px] border border-border rounded-full w-3/4" />
                        )}
                    </Fragment>
                ))}
            </ul>
        </div>
    </aside>
);

interface SidebarProps {
    children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const currPathText = router.pathname
        .replace(/[?#].*$/, '')
        .replace(/^\//, '')
        .replaceAll('/', ' / ')
        .replaceAll('-', ' ')
        .toUpperCase();

    const toggleSidebar = () => setIsOpen(prev => !prev);

    const Divider = () => <div className="h-px border border-border rounded-full w-3/4" />;

    return (
        <div className="bg-background">
            <div className="flex justify-center w-full mx-auto max-w-[1410px]">
                <DocsSidebar />
                <div className="w-full">
                    <div className="flex flex-col">

                        {/* Mobile Docs Sidebar */}
                        <div className="hidden w-full z-30 max-lg:flex items-center justify-between max-xl:justify-center">
                            <div className={`${isOpen ? 'fixed' : 'fixed'} top-[56px] left-0 w-full z-[35] border border-border py-3 bg-background-tertiary px-4`}>
                                <motion.div
                                    className="absolute inset-0 bg-background-tertiary z-0"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: isOpen ? 0 : '-100%' }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                />
                                <button onClick={toggleSidebar} className="hamburger flex items-center gap-4 relative z-10 cursor-pointer">
                                    <LayoutSidebarLeft className="w-5 h-5" />
                                    <div className="text-xs font-semibold text-primary-light tracking-wider capitalize">
                                        {currPathText}
                                    </div>
                                </button>
                            </div>

                            <motion.div
                                className="fixed top-[56px] left-0 w-full h-full pb-20 p-4 bg-background-tertiary shadow-lg z-30 overflow-y-auto"
                                initial={{ x: '-100%' }}
                                animate={{ x: isOpen ? 0 : '-100%' }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                                <ul className="space-y-2 mt-14 ml-2 text-font-light">
                                    {navSections.map((section, idx) => (
                                        <div key={idx} className="space-y-2">
                                            {section.heading && <SideNavHeading title={section.heading} />}
                                            {section.items.map(({ href, title, type }: SideNavLinkProps) =>
                                                type === 'simple' ? (
                                                    <MobileSimpleSideNavLink key={href} toggleSidebar={toggleSidebar} href={href} title={title} />
                                                ) : (
                                                    <MobileSideNavLink key={href} toggleSidebar={toggleSidebar} href={href} title={title} />
                                                )
                                            )}
                                            {idx !== navSections.length - 1 && <Divider />}
                                        </div>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>

                        {/* Children */}
                        <div className="smooth-scroll">{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;