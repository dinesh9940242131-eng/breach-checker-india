// ====================================
// BREACH DATABASE (Sample Data)
// All entries are SHA-256 hashed for privacy
// This is a DEMONSTRATION / EDUCATIONAL dataset
// ====================================

const breachDatabase = [
    {
        hash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        breach: "Domino's India",
        year: 2021,
        dataExposedKey: "dominosData",
        severity: "high",
        recommendationKey: "dominosRec"
    },
    {
        hash: "6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090",
        breach: "Domino's India",
        year: 2021,
        dataExposedKey: "dominosData",
        severity: "high",
        recommendationKey: "dominosRec"
    },
    {
        hash: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
        breach: "Domino's India",
        year: 2021,
        dataExposedKey: "dominosData",
        severity: "high",
        recommendationKey: "dominosRec"
    },
    {
        hash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        breach: "JustDial",
        year: 2019,
        dataExposedKey: "justdialData",
        severity: "medium",
        recommendationKey: "justdialRec"
    },
    {
        hash: "b3a8e0e1f9b0e0f9b0e0f9b0e0f9b0e0f9b0e0f9b0e0f9b0e0f9b0e0f9b0e0",
        breach: "JustDial",
        year: 2019,
        dataExposedKey: "justdialData",
        severity: "medium",
        recommendationKey: "justdialRec"
    },
    {
        hash: "6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090",
        breach: "BigBasket",
        year: 2020,
        dataExposedKey: "bigbasketData",
        severity: "high",
        recommendationKey: "bigbasketRec"
    },
    {
        hash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        breach: "MobiKwik",
        year: 2021,
        dataExposedKey: "mobikwikData",
        severity: "critical",
        recommendationKey: "mobikwikRec"
    },
    {
        hash: "c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2",
        breach: "Air India",
        year: 2021,
        dataExposedKey: "airindiaData",
        severity: "critical",
        recommendationKey: "airindiaRec"
    },
    {
        hash: "6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090",
        breach: "Facebook India",
        year: 2021,
        dataExposedKey: "facebookData",
        severity: "medium",
        recommendationKey: "facebookRec"
    }
];

// Helper: Convert string to SHA-256 hash
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
