const config = {
    siteMetaData: {
        title: "Dr. Walter White",
        copyrightYearStart: 2008,
    },

    header: {
        navigation: [
            { label: "Home", href: "/" },
            { label: "Publications", href: "/publications" },
            { label: "Projects", href: "/projects" },
            { label: "Blog", href: "/blog" },
            { label: "Talks", href: "/talks" },
            { label: "Teaching", href: "/teaching" },
            { label: "CV", href: "/cv" },
            { label: "Contact", href: "/contact" },
        ],
        navigationEnable: false,
        searchEnable: true,
        darkLightToggle: true,
        defaultTheme: "dark",
    },

    landingPage: {
        heroSection: {
            type: "HeroSection",
            enabled: true,
            layout: "imageLeft",
            imageUrl: "walterwhite.jpg",
            name: "Dr. Walter White",
            designation: "Former Chemistry Teacher & Independent Chemical Researcher",
            summary:
                "Walter White is a brilliant chemist whose expertise in the field once held promise in both industry and academia. Formerly a high school chemistry teacher, his deep understanding of molecular science and synthesis techniques made him a master of precision and innovation. Driven by desperation and a desire to secure his family's future, Walter rechanneled his academic prowess into a darker enterprise—establishing one of the most sophisticated underground chemical operations in modern fiction. His journey is a striking narrative of how knowledge, when untethered from ethics, can lead to both genius and destruction.",
            socialLinks: [
                { type: "google-scholar", title: "Google Scholar", href: "#" },
                { type: "github", title: "GitHub", href: "#" },
                { type: "gitlab", title: "GitLab", href: "#" },
                { type: "linkedin", title: "LinkedIn", href: "#" },
            ]
        },
    },

    pages: [
        {
            title: "Blog",
            slug: "blogs",
            pageType: {
                name: "Blog",
                path: "blogs",
                fields: {
                    title: { type: "string", required: false },
                    preview: { type: "string", required: false },
                    publishedAt: { type: "date", required: false },
                    updatedAt: { type: "date", required: false },
                    description: { type: "string", required: false },
                    image: { type: "string", required: false },
                    isPublished: { type: "boolean", default: false },
                    author: { type: "string", required: false },
                    username: { type: "string", required: false },
                    github: { type: "string", required: false },
                    tags: { type: "list", of: { type: "string" }, required: false },
                },
            },
        },
        {
            title: "Publications",
            slug: "publications",
            pageType: {
                name: "Publication",
                path: "publications",
                fields: {
                    title: { type: "string", required: false },
                    preview: { type: "string", required: false },
                    publishedAt: { type: "date", required: false },
                    updatedAt: { type: "date", required: false },
                    description: { type: "string", required: false },
                    image: { type: "string", required: false },
                    isPublished: { type: "boolean", default: false },
                    author: { type: "string", required: false },
                    username: { type: "string", required: false },
                    links: { type: "json", required: false },
                    tags: { type: "list", of: { type: "string" }, required: false },
                },
            },
        },
        {
            title: "Teaching",
            slug: "teaching",
            icon: "graduation-cap",
            layout: "stacked",
            pageType: {
                name: "Teaching",
                path: "teaching",
                fields: {
                    title: { type: "string", required: false },
                    preview: { type: "string", required: false },
                    publishedAt: { type: "date", required: false },
                    updatedAt: { type: "date", required: false },
                    description: { type: "string", required: false },
                    image: { type: "string", required: false },
                    isPublished: { type: "boolean", default: false },
                    author: { type: "string", required: false },
                    username: { type: "string", required: false },
                    links: { type: "json", required: false },
                    tags: { type: "list", of: { type: "string" }, required: false },
                },
            },
        },
        {
            title: "CV",
            slug: "cv",
            icon: "file-text",
            layout: "accordion",
            sectionButton: {
                downloadable: true,
                title: "Download CV",
                link: "/cv/walterwhite_cv.pdf",
            },
            pageType: {
                name: "CV",
                path: "cv",
                fields: {
                    title: { type: "string", required: false },
                    preview: { type: "string", required: false },
                    publishedAt: { type: "date", required: false },
                    updatedAt: { type: "date", required: false },
                    description: { type: "string", required: false },
                    image: { type: "string", required: false },
                    isPublished: { type: "boolean", default: false },
                    author: { type: "string", required: false },
                    username: { type: "string", required: false },
                    links: { type: "json", required: false },
                    tags: { type: "list", of: { type: "string" }, required: false },
                },
            },
        },
    ],
};

export default config;
