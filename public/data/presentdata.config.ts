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
        sections: [
            {
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
            {
                type: "PublicationsSection",
                enabled: true,
                title: "Selected Publications",
                view: "grid",
                columns: 2,
            },
            {
                type: "BlogSection",
                enabled: true,
                title: "Lab Notes",
                showExcerpt: true,
                maxPosts: 3,
            },
            {
                type: "ProjectsSection",
                enabled: true,
                title: "Experimental Work",
                display: "card",
            },
            {
                type: "TalksSection",
                enabled: false,
                title: "Guest Lectures",
            },
            {
                type: "ContactSection",
                enabled: true,
                email: "walter.white@unm.edu",
                links: {
                    GoogleScholar: "https://scholar.google.com/citations?user=Heisenberg",
                    GitHub: "https://github.com/heisenberglab",
                    LinkedIn: "https://linkedin.com/in/walterwhite",
                },
            },
        ],
    },

    pages: [
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
                    github: { type: "string", required: false },
                    tags: { type: "list", of: { type: "string" }, required: false },
                },
            },
        },
        {
            title: "Teaching",
            slug: "teaching",
            icon: "graduation-cap",
            layout: "stacked",
            sections: [
                {
                    sectionTitle: "Courses Taught",
                    sectionType: "list",
                    items: [
                        {
                            mainTitle: "CHEM101: General Chemistry",
                            secondaryTitle: "Fall 2004",
                            tertiaryTitle: "In-person",
                            url: "/syllabus/chem101",
                        },
                        {
                            mainTitle: "CHEM431: Advanced Organic Synthesis",
                            secondaryTitle: "Spring 2006",
                            tertiaryTitle: "In-person",
                            url: "/syllabus/chem431",
                        },
                        {
                            mainTitle: "CHEM500: Industrial Applications of Chemistry",
                            secondaryTitle: "Fall 2007",
                            tertiaryTitle: "Hybrid",
                            url: "/syllabus/chem500",
                        },
                    ],
                },
                {
                    sectionTitle: "Student Mentorship",
                    sectionType: "cards",
                    description:
                        "Mentorship on practical chemistry projects with industrial and experimental relevance.",
                    items: [
                        {
                            name: "Gale Boetticher",
                            level: "PhD",
                            project: "Microcrystalline Analysis and Purification",
                            status: "Ongoing",
                        },
                        {
                            name: "Jesse Pinkman",
                            level: "Independent Study",
                            project: "Thermochemical Process Optimization",
                            status: "Completed",
                        },
                    ],
                },
            ],
        },

        {
            title: "Talks",
            slug: "talks",
            icon: "mic",
            layout: "grid",
            pageType: {
                name: "Talk",
                path: "talks",
                fields: {
                    title: { type: "string", required: true },
                    event: { type: "string", required: false },
                    slidesLink: { type: "string", required: false },
                    videoUrl: { type: "string", required: false },
                    publishedAt: { type: "date", required: false },
                },
            },
            sections: [
                {
                    sectionTitle: "Guest Lectures",
                    sectionType: "media",
                    items: [
                        {
                            title: "Crystal Blue Persuasion: Chemical Purity in Synthesis",
                            event: "UNM Chemistry Colloquium",
                            videoUrl: "https://youtube.com/embed/wwlab001",
                            slidesLink: "/slides/blue_purity.pdf",
                        },
                        {
                            title: "Reactive Intermediates and Rapid Thermolysis",
                            event: "Southwest ChemCon 2006",
                            videoUrl: "https://youtube.com/embed/wwlab002",
                            slidesLink: "/slides/reactive_thermolysis.pdf",
                        },
                    ],
                },
            ],
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
            sections: [
                {
                    sectionTitle: "Academic Background",
                    sectionType: "timeline",
                    items: [
                        {
                            institution: "California Institute of Technology",
                            degree: "PhD in Chemistry",
                            years: "1985–1990",
                        },
                        {
                            institution: "University of New Mexico",
                            degree: "BS in Chemistry",
                            years: "1981–1985",
                        },
                    ],
                },
                {
                    sectionTitle: "Awards & Fellowships",
                    sectionType: "list",
                    items: [
                        {
                            name: "Southwest Chemist of the Year",
                            year: "2004",
                        },
                        {
                            name: "UNM Distinguished Educator Award",
                            year: "2007",
                        },
                        {
                            name: "Blue Crystal Award for Innovation",
                            year: "2009",
                        },
                    ],
                },
            ],
        },
    ],
};

export default config;
