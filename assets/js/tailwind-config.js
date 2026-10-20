window.tailwind = window.tailwind || {};

tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary-container": "#e2e2e2",
                "on-surface-variant": "#c4c7c8",
                "surface-tint": "#c6c6c7",
                "surface-container-lowest": "#0e0e0e",
                "on-secondary-fixed": "#1c1b1b",
                "on-surface": "#e5e2e1",
                "surface-bright": "#393939",
                "on-secondary": "#313030",
                "on-secondary-container": "#bab8b7",
                "secondary-container": "#4a4949",
                "on-error": "#690005",
                "inverse-primary": "#5d5f5f",
                "on-error-container": "#ffdad6",
                "primary": "#ffffff",
                "tertiary-fixed-dim": "#3de273",
                "on-tertiary-container": "#007433",
                "on-tertiary-fixed": "#002109",
                "secondary-fixed-dim": "#c9c6c5",
                "primary-fixed": "#e2e2e2",
                "tertiary": "#ffffff",
                "tertiary-container": "#66ff8e",
                "on-primary": "#2f3131",
                "secondary-fixed": "#e5e2e1",
                "on-primary-fixed": "#1a1c1c",
                "inverse-surface": "#e5e2e1",
                "surface-variant": "#353535",
                "surface-dim": "#131313",
                "secondary": "#c9c6c5",
                "on-tertiary": "#003915",
                "tertiary-fixed": "#66ff8e",
                "error-container": "#93000a",
                "surface-container": "#20201f",
                "surface-container-highest": "#353535",
                "surface-container-low": "#1c1b1b",
                "inverse-on-surface": "#313030",
                "primary-fixed-dim": "#c6c6c7",
                "on-primary-container": "#636565",
                "outline-variant": "#444748",
                "on-secondary-fixed-variant": "#474646",
                "surface-container-high": "#2a2a2a",
                "on-tertiary-fixed-variant": "#005322",
                "on-primary-fixed-variant": "#454747",
                "background": "#131313",
                "outline": "#8e9192",
                "error": "#ffb4ab",
                "surface": "#131313",
                "on-background": "#e5e2e1"
            },
            borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "0.75rem",
                full: "9999px"
            },
            spacing: {
                "margin-desktop": "64px",
                unit: "8px",
                "margin-mobile": "20px",
                gutter: "24px",
                "container-max": "1440px"
            },
            fontFamily: {
                "headline-lg-mobile": ["Anton"],
                "display-hero": ["Anton"],
                "body-lg": ["Be Vietnam Pro"],
                "label-caps": ["Be Vietnam Pro"],
                "headline-lg": ["Anton"],
                "headline-md": ["Anton"],
                "body-md": ["Be Vietnam Pro"],
                "arabic-support": ["Be Vietnam Pro"]
            },
            fontSize: {
                "headline-lg-mobile": ["48px", { lineHeight: "52px", letterSpacing: "-0.01em", fontWeight: "400" }],
                "display-hero": ["120px", { lineHeight: "110px", letterSpacing: "-0.02em", fontWeight: "400" }],
                "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
                "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.1em", fontWeight: "700" }],
                "headline-lg": ["64px", { lineHeight: "72px", letterSpacing: "-0.01em", fontWeight: "400" }],
                "headline-md": ["32px", { lineHeight: "40px", letterSpacing: "0em", fontWeight: "400" }],
                "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
                "arabic-support": ["18px", { lineHeight: "32px", fontWeight: "500" }]
            }
        }
    }
};