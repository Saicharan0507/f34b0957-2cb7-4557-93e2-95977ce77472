import compostingGuide from '@/assets/composting-guide.jpg';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Leaf, Recycle, BookOpen } from 'lucide-react';

const LearnSection = () => {
  const { t } = useTranslation();

  const tips = [
    {
      icon: Leaf,
      text: t('source_segregation'),
      color: 'text-success'
    },
    {
      icon: Recycle,
      text: t('composting'),
      color: 'text-primary'
    },
    {
      icon: BookOpen,
      text: t('reduce_reuse_recycle'),
      color: 'text-secondary'
    }
  ];

  const compostSteps = [
    t('compost_step1'),
    t('compost_step2'),
    t('compost_step3'),
    t('compost_step4'),
    t('compost_step5')
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">
          {t('learn')} Waste Management
        </h2>
        <p className="text-muted-foreground">
          Essential knowledge for sustainable waste management practices
        </p>
      </div>

      <Card className="bg-gradient-card shadow-lg">
        <CardHeader>
          <CardTitle className="text-primary">Key Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                <div className={`p-2 rounded-full bg-background ${tip.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-foreground leading-relaxed">{tip.text}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-lg">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Leaf className="w-6 h-6" />
            {t('how_composting')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <img
              src={compostingGuide}
              alt="Composting process illustration"
              className="w-full max-w-md mx-auto rounded-xl shadow-md"
            />
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-primary">Step-by-Step Process:</h4>
            <ol className="space-y-3">
              {compostSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <p className="text-foreground leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearnSection;