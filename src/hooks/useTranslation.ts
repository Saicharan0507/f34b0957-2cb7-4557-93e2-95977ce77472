import { useState } from 'react';
import { Translations } from '@/types';

const translations: Translations = {
  en: {
    // Navigation
    home: "Home",
    worker_login: "Worker Login",
    authority_login: "Authority Login",
    learn: "Learn",
    play_quiz: "Play Quiz",
    game_zone: "Gamification Zone",
    live_tracking: "Live Vehicle Tracking",
    geo_upload: "Geo-Tagging Upload",
    purchase: "Purchase",
    
    // Common
    login_button: "Login",
    username: "Username",
    password: "Password",
    back: "Back",
    next: "Next",
    skip: "Skip",
    submit: "Submit",
    score: "Score",
    
    // Home
    welcome_msg: "Welcome to Smart Waste Management Portal",
    home_desc: "This is the home section. Please login as Worker or Authority, or explore resources below.",
    latest_notifications: "Latest Notifications",
    no_notifications: "No notifications yet.",
    
    // Learn
    source_segregation: "Source Segregation: Separate dry, wet, and hazardous waste sensibly.",
    composting: "Composting at Home: Turn kitchen scraps into compost.",
    reduce_reuse_recycle: "Reduce, Reuse, Recycle: Follow sustainable practices.",
    how_composting: "How Composting Works",
    compost_step1: "Collect wet waste in a bin.",
    compost_step2: "Layer with dry materials like leaves or paper.",
    compost_step3: "Add some soil or compost starter.",
    compost_step4: "Stir regularly and keep moist.",
    compost_step5: "Harvest after 4-8 weeks.",
    
    // Quiz
    review_later: "Review Later",
    question_of: "Question {current} of {total}",
    
    // Game
    start_game: "Start Game",
    game_over: "Game over!",
    try_again: "Try again!",
    correct_bin: "correctly placed in",
    wet_bin: "Wet",
    dry_bin: "Dry",
    hazardous_bin: "Hazardous",
    
    // Items
    banana_peel: "Banana Peel",
    plastic_bottle: "Plastic Bottle",
    battery: "Battery",
    paper: "Paper",
    apple_core: "Apple Core",
    used_syringe: "Used Syringe",
  },
  hi: {
    // Navigation
    home: "मुख पृष्ठ",
    worker_login: "कर्मचारी लॉगिन",
    authority_login: "अधिकारी लॉगिन",
    learn: "सीखें",
    play_quiz: "क्विज खेलें",
    game_zone: "गेम जोन",
    live_tracking: "लाइव वाहन ट्रैकिंग",
    geo_upload: "जियो-टैग अपलोड",
    purchase: "खरीदारी",
    
    // Common
    login_button: "लॉगिन करें",
    username: "उपयोगकर्ता नाम",
    password: "पासवर्ड",
    back: "पीछे",
    next: "अगला",
    skip: "स्किप करें",
    submit: "जमा करें",
    score: "स्कोर",
    
    // Home
    welcome_msg: "स्मार्ट वेस्ट मैनेजमेंट पोर्टल में आपका स्वागत है",
    home_desc: "यह होम सेक्शन है। कृपया कार्यकर्ता या अधिकारी के रूप में लॉगिन करें या नीचे संसाधन देखें।",
    latest_notifications: "ताज़ा सूचनाएं",
    no_notifications: "अभी तक कोई सूचना नहीं।",
    
    // Learn
    source_segregation: "सूत्र अलगाव: सूखे, गीले, और खतरनाक कचरे को सही तरीके से अलग करें।",
    composting: "घर पर कम्पोस्टिंग: रसोई के कचरे को खाद में बदलें।",
    reduce_reuse_recycle: "कम करें, पुन: उपयोग करें, पुन: चक्रित करें: सतत अभ्यास अपनाएं।",
    how_composting: "कम्पोस्टिंग कैसे काम करती है",
    compost_step1: "गीला कचरा एक डिब्बे में इकट्ठा करें।",
    compost_step2: "सूखे सामग्री जैसे पत्ते या कागज के साथ परत बनाएं।",
    compost_step3: "मिट्टी या कम्पोस्ट स्टार्टर डालें।",
    compost_step4: "नियमित रूप से हिलाएं और नम रखें।",
    compost_step5: "4-8 सप्ताह के बाद खाद निकालें।",
    
    // Quiz
    review_later: "बाद में समीक्षा करें",
    question_of: "प्रश्न {current} में से {total}",
    
    // Game
    start_game: "गेम शुरू करें",
    game_over: "गेम खत्म!",
    try_again: "फिर से कोशिश करें!",
    correct_bin: "सही डस्टबिन में रखा गया",
    wet_bin: "गीला",
    dry_bin: "सूखा",
    hazardous_bin: "खतरनाक",
    
    // Items
    banana_peel: "केला छिलका",
    plastic_bottle: "प्लास्टिक बोतल",
    battery: "बैटरी",
    paper: "कागज",
    apple_core: "सेब का केंद्र",
    used_syringe: "उपयोग की हुई सिरिंज",
  }
};

export const useTranslation = () => {
  const [currentLang, setCurrentLang] = useState<string>('en');

  const t = (key: string, replacements?: Record<string, string | number>) => {
    let translation = translations[currentLang]?.[key] || translations.en[key] || key;
    
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        translation = translation.replace(`{${placeholder}}`, String(value));
      });
    }
    
    return translation;
  };

  const changeLanguage = (lang: string) => {
    setCurrentLang(lang);
  };

  return { t, currentLang, changeLanguage };
};