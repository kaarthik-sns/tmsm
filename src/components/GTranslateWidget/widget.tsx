import { useEffect } from "react"

declare global {
    interface Window {
        gtranslateSettings?: {
            default_language: string;
            native_language_names: boolean;
            detect_browser_language: boolean;
            languages: string[];
            wrapper_selector: string;
            switcher_horizontal_position: string;
            alt_flags: Record<string, string>;
        };
    }
}

const GTranslateWidget: React.FC = () => {

    useEffect(() => {
        const scriptId = 'gtranslate-script';
        const existingScript = document.getElementById(scriptId);
    
        if (!existingScript) {
            // Create and append the new script
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://cdn.gtranslate.net/widgets/latest/dropdown.js';
            script.defer = true;
    
            script.onload = () => {
                window.gtranslateSettings = {
                    default_language: "en",
                    native_language_names: true,
                    detect_browser_language: true,
                    languages: ["en", "ta"],
                    wrapper_selector: ".gtranslate_wrapper",
                    switcher_horizontal_position: "inline",
                    alt_flags: { "en": "usa" },
                };
            };
    
            document.body.appendChild(script);
        }
    
        // Clean up script on unmount (optional)
        return () => {
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []);
    

    return <div className="gtranslate_wrapper"></div>;
};

export default GTranslateWidget;
