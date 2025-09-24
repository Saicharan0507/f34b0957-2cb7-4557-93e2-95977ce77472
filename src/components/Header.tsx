import { useTranslation } from '@/hooks/useTranslation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Header = () => {
  const { t, currentLang, changeLanguage } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'bn', name: 'Bengali' },
    { code: 'mr', name: 'Marathi' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'ka', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'pa', name: 'Punjabi' },
  ];

  return (
    <div>
      <header className="bg-card border-b-4 border-primary py-4 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-primary tracking-wider uppercase font-mono">
          Smart Waste Management Portal
        </h1>
      </header>
      
      <div className="max-w-6xl mx-auto px-6 py-2 flex justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Language:</span>
          <Select value={currentLang} onValueChange={changeLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Header;