import { Section } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Home, 
  User, 
  Shield, 
  BookOpen, 
  Brain, 
  Gamepad2, 
  MapPin, 
  Upload,
  ShoppingCart
} from 'lucide-react';

interface NavigationProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

const Navigation = ({ activeSection, onSectionChange }: NavigationProps) => {
  const { t } = useTranslation();

  const navItems = [
    { 
      id: 'home' as Section, 
      icon: Home, 
      label: t('home'),
      variant: 'primary'
    },
    { 
      id: 'worker-login' as Section, 
      icon: User, 
      label: t('worker_login'),
      variant: 'secondary'
    },
    { 
      id: 'authority-login' as Section, 
      icon: Shield, 
      label: t('authority_login'),
      variant: 'primary'
    },
    { 
      id: 'learn' as Section, 
      icon: BookOpen, 
      label: t('learn'),
      variant: 'secondary'
    },
    { 
      id: 'quiz' as Section, 
      icon: Brain, 
      label: t('play_quiz'),
      variant: 'primary'
    },
    { 
      id: 'game' as Section, 
      icon: Gamepad2, 
      label: t('game_zone'),
      variant: 'secondary'
    },
    { 
      id: 'tracking' as Section, 
      icon: MapPin, 
      label: t('live_tracking'),
      variant: 'primary'
    },
    { 
      id: 'geo-upload' as Section, 
      icon: Upload, 
      label: t('geo_upload'),
      variant: 'secondary'
    },
    { 
      id: 'purchase' as Section, 
      icon: ShoppingCart, 
      label: t('purchase'),
      variant: 'primary'
    },
  ];

  return (
    <nav className="bg-card border-b-2 border-secondary shadow-md">
      <div className="flex justify-center flex-wrap">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const baseClasses = "flex-1 min-w-[120px] flex items-center justify-center gap-2 py-4 px-3 font-semibold text-sm transition-all duration-300 border-r border-card-foreground/10 last:border-r-0 hover:brightness-110";
          
          const variantClasses = item.variant === 'primary' 
            ? "bg-primary text-primary-foreground hover:bg-primary-light" 
            : "bg-secondary text-secondary-foreground hover:bg-secondary-light";

          const activeClasses = isActive 
            ? "shadow-[inset_0_-4px_0_0] shadow-warning scale-105" 
            : "";

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`${baseClasses} ${variantClasses} ${activeClasses}`}
              aria-pressed={isActive}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;