
const getLanguageVersion = (lang) => {
    
    // JDoodle language configuration
    const languageConfig = {
        "c++": { language: "cpp", versionIndex: "5" }, // C++ 17
        "java": { language: "java", versionIndex: "4" }, // JDK 17
        "javascript": { language: "nodejs", versionIndex: "4" } // NodeJS 17
    };

    return languageConfig[lang.toLowerCase()] || null;
}

module.exports = { getLanguageVersion };
