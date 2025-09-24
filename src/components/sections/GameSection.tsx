import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Gamepad2, Trash2, Star, Trophy } from 'lucide-react';

interface GameItem {
  name: string;
  binType: 'wet' | 'dry' | 'hazardous';
}

const GameSection = () => {
  const { t, currentLang } = useTranslation();
  
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'completed'>('idle');
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [gameItems, setGameItems] = useState<GameItem[]>([]);
  const [feedback, setFeedback] = useState<string>('');

  const allItems: Record<string, GameItem[]> = {
    en: [
      { name: "Banana Peel", binType: "wet" },
      { name: "Plastic Bottle", binType: "dry" },
      { name: "Battery", binType: "hazardous" },
      { name: "Paper", binType: "dry" },
      { name: "Apple Core", binType: "wet" },
      { name: "Used Syringe", binType: "hazardous" },
      { name: "Glass Jar", binType: "dry" },
      { name: "Food Scraps", binType: "wet" },
      { name: "Old Phone", binType: "hazardous" },
      { name: "Cardboard", binType: "dry" },
      { name: "Tea Bags", binType: "wet" },
      { name: "Paint Can", binType: "hazardous" }
    ],
    hi: [
      { name: "केला छिलका", binType: "wet" },
      { name: "प्लास्टिक बोतल", binType: "dry" },
      { name: "बैटरी", binType: "hazardous" },
      { name: "कागज", binType: "dry" },
      { name: "सेब का केंद्र", binType: "wet" },
      { name: "उपयोग की हुई सिरिंज", binType: "hazardous" },
      { name: "कांच का जार", binType: "dry" },
      { name: "खाना बचा", binType: "wet" },
      { name: "पुराना फोन", binType: "hazardous" },
      { name: "गत्ता", binType: "dry" },
      { name: "चाय की पत्ती", binType: "wet" },
      { name: "पेंट का डिब्बा", binType: "hazardous" }
    ]
  };

  const binNames = {
    en: { wet: "Wet Waste", dry: "Dry Waste", hazardous: "Hazardous Waste" },
    hi: { wet: "गीला कचरा", dry: "सूखा कचरा", hazardous: "खतरनाक कचरा" }
  };

  const binColors = {
    wet: "bg-success hover:bg-success/80",
    dry: "bg-secondary hover:bg-secondary/80", 
    hazardous: "bg-destructive hover:bg-destructive/80"
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = () => {
    const items = allItems[currentLang] || allItems.en;
    const shuffledItems = shuffleArray(items).slice(0, 8);
    setGameItems(shuffledItems);
    setTotalItems(shuffledItems.length);
    setCurrentItemIndex(0);
    setScore(0);
    setGameState('playing');
    setFeedback('');
  };

  const handleBinChoice = (chosenBin: 'wet' | 'dry' | 'hazardous') => {
    const currentItem = gameItems[currentItemIndex];
    const isCorrect = currentItem.binType === chosenBin;
    
    if (isCorrect) {
      setScore(score + 10);
      setFeedback('🎉 Correct! +10 points');
    } else {
      const correctBin = binNames[currentLang]?.[currentItem.binType] || binNames.en[currentItem.binType];
      setFeedback(`❌ Wrong! ${currentItem.name} goes in ${correctBin}. -5 points`);
      setScore(Math.max(0, score - 5));
    }

    setTimeout(() => {
      if (currentItemIndex < gameItems.length - 1) {
        setCurrentItemIndex(currentItemIndex + 1);
        setFeedback('');
      } else {
        setGameState('completed');
      }
    }, 1500);
  };

  const resetGame = () => {
    setGameState('idle');
    setCurrentItemIndex(0);
    setScore(0);
    setTotalItems(0);
    setGameItems([]);
    setFeedback('');
  };

  const getScoreMessage = () => {
    const percentage = (score / (totalItems * 10)) * 100;
    if (percentage >= 80) return { message: "🏆 Waste Management Champion!", color: "text-success" };
    if (percentage >= 60) return { message: "⭐ Great job! Keep it up!", color: "text-secondary" };
    return { message: "💪 Good effort! Practice makes perfect!", color: "text-primary" };
  };

  if (gameState === 'idle') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="bg-gradient-card shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 animate-glow">
              <Gamepad2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              {t('game_zone')}
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Test your waste sorting skills! Drag items to the correct bins.
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={startGame} size="lg" className="bg-gradient-primary">
              {t('start_game')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'completed') {
    const scoreData = getScoreMessage();
    
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="bg-gradient-card shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              {t('game_over')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">{score} points</div>
              <div className={`text-lg font-semibold ${scoreData.color}`}>
                {scoreData.message}
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-2">Your Performance</div>
              <Progress value={(score / (totalItems * 10)) * 100} className="mb-2" />
              <div className="text-sm">
                {Math.round((score / (totalItems * 10)) * 100)}% accuracy
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={startGame} variant="outline">
                Play Again
              </Button>
              <Button onClick={resetGame}>
                Back to Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentItem = gameItems[currentItemIndex];
  const progress = ((currentItemIndex + 1) / totalItems) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="bg-gradient-card shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Gamepad2 className="w-6 h-6" />
              Waste Sorting Game
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Item {currentItemIndex + 1} of {totalItems}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-warning" />
                <span className="font-semibold">{score}</span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="bg-muted/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
              <Trash2 className="w-12 h-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground">
                {currentItem.name}
              </h3>
              <p className="text-muted-foreground">
                Which bin does this item belong to?
              </p>
            </div>
          </div>

          {feedback && (
            <div className="text-center p-4 rounded-lg bg-muted/30 border-l-4 border-primary">
              <p className="font-medium">{feedback}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['wet', 'dry', 'hazardous'] as const).map((binType) => (
              <Button
                key={binType}
                onClick={() => handleBinChoice(binType)}
                className={`${binColors[binType]} text-white font-semibold py-8 text-lg transition-transform hover:scale-105`}
                disabled={!!feedback}
              >
                {binNames[currentLang]?.[binType] || binNames.en[binType]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameSection;