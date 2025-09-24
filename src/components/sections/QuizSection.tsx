import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, Brain, CheckCircle, XCircle, Timer } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QuizSection = () => {
  const { t, currentLang } = useTranslation();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [reviewFlags, setReviewFlags] = useState<boolean[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [usedQuestions, setUsedQuestions] = useState<Set<number>>(new Set());

  const allQuizQuestions: Record<string, QuizQuestion[]> = {
    en: [
      {
        question: "Which waste is compostable?",
        options: ["Plastic", "Banana Peel", "Battery", "Styrofoam"],
        correctAnswer: 1,
        explanation: "Banana peel is organic wet waste that can be composted."
      },
      {
        question: "Where do batteries belong?",
        options: ["Dry waste", "Wet waste", "Hazardous waste", "Recyclable"],
        correctAnswer: 2,
        explanation: "Batteries contain harmful chemicals and are hazardous waste."
      },
      {
        question: "Which bin is typically for dry waste?",
        options: ["Green", "Blue", "Red", "Yellow"],
        correctAnswer: 1,
        explanation: "Blue bins are commonly used for dry recyclable waste."
      },
      {
        question: "What does the first R in '3Rs' stand for?",
        options: ["Recycle", "Reduce", "Reuse", "Remove"],
        correctAnswer: 1,
        explanation: "The 3Rs stand for Reduce, Reuse, Recycle - in that order."
      },
      {
        question: "How long does composting usually take?",
        options: ["4-8 weeks", "1 day", "1 year", "4 months"],
        correctAnswer: 0,
        explanation: "Home composting typically takes 4 to 8 weeks under proper conditions."
      },
      {
        question: "What color bin is used for wet waste?",
        options: ["Blue", "Green", "Red", "Yellow"],
        correctAnswer: 1,
        explanation: "Green bins are typically used for wet/organic waste."
      },
      {
        question: "Which material takes longest to decompose?",
        options: ["Paper", "Glass", "Apple core", "Leaves"],
        correctAnswer: 1,
        explanation: "Glass can take over 1 million years to decompose naturally."
      },
      {
        question: "What is the main benefit of recycling?",
        options: ["Saves money", "Reduces landfill waste", "Creates jobs", "All of the above"],
        correctAnswer: 3,
        explanation: "Recycling provides all these benefits and more."
      },
      {
        question: "Which waste should never go in compost?",
        options: ["Fruit peels", "Meat scraps", "Vegetable waste", "Leaves"],
        correctAnswer: 1,
        explanation: "Meat scraps attract pests and create odors in compost."
      },
      {
        question: "How much of household waste can be composted?",
        options: ["10-20%", "30-40%", "50-60%", "70-80%"],
        correctAnswer: 1,
        explanation: "About 30-40% of household waste is organic and compostable."
      },
      {
        question: "What is biogas made from?",
        options: ["Plastic waste", "Organic waste", "Metal waste", "Paper waste"],
        correctAnswer: 1,
        explanation: "Biogas is produced from decomposing organic waste."
      },
      {
        question: "Which is the most environmentally friendly disposal method?",
        options: ["Landfill", "Incineration", "Recycling", "Ocean dumping"],
        correctAnswer: 2,
        explanation: "Recycling reduces environmental impact and conserves resources."
      },
      {
        question: "What does 'Zero Waste' mean?",
        options: ["No waste production", "100% recycling", "Waste reduction goal", "Perfect waste management"],
        correctAnswer: 2,
        explanation: "Zero Waste is a goal to reduce waste through better design and consumption."
      },
      {
        question: "Which country is leading in waste management?",
        options: ["USA", "Germany", "India", "China"],
        correctAnswer: 1,
        explanation: "Germany has one of the world's most advanced waste management systems."
      },
      {
        question: "How often should you empty compost?",
        options: ["Daily", "Weekly", "Monthly", "When ready"],
        correctAnswer: 3,
        explanation: "Compost is ready when it's dark, crumbly, and earthy-smelling."
      },
      {
        question: "What is e-waste?",
        options: ["Electronic waste", "Energy waste", "Edible waste", "Expensive waste"],
        correctAnswer: 0,
        explanation: "E-waste refers to discarded electronic devices and components."
      },
      {
        question: "Which waste management method produces energy?",
        options: ["Landfill", "Composting", "Incineration", "Recycling"],
        correctAnswer: 2,
        explanation: "Waste-to-energy incineration produces electricity and heat."
      },
      {
        question: "What percentage of plastic is actually recycled globally?",
        options: ["Less than 10%", "25%", "50%", "75%"],
        correctAnswer: 0,
        explanation: "Less than 10% of all plastic ever made has been recycled."
      },
      {
        question: "Which is the fastest growing waste stream?",
        options: ["Food waste", "Plastic waste", "E-waste", "Paper waste"],
        correctAnswer: 2,
        explanation: "E-waste is the fastest growing waste stream globally."
      },
      {
        question: "What is the main component of landfill gas?",
        options: ["Oxygen", "Nitrogen", "Methane", "Carbon dioxide"],
        correctAnswer: 2,
        explanation: "Methane is the primary component of landfill gas and a potent greenhouse gas."
      },
      {
        question: "How long does it take for an aluminum can to decompose?",
        options: ["1 year", "10 years", "100 years", "400+ years"],
        correctAnswer: 3,
        explanation: "Aluminum cans take 400+ years to decompose naturally."
      },
      {
        question: "What is the circular economy?",
        options: ["Round waste bins", "Recycling loops", "Economic model minimizing waste", "Waste collection routes"],
        correctAnswer: 2,
        explanation: "Circular economy is a model focused on eliminating waste through design."
      },
      {
        question: "Which waste sorting method is most effective?",
        options: ["Source separation", "Central sorting", "AI sorting", "Manual sorting"],
        correctAnswer: 0,
        explanation: "Source separation at homes/businesses is most effective."
      },
      {
        question: "What happens to organic waste in landfills?",
        options: ["Composts naturally", "Produces methane", "Disappears quickly", "Becomes fertile soil"],
        correctAnswer: 1,
        explanation: "Organic waste in landfills produces methane due to anaerobic conditions."
      },
      {
        question: "Which country has the highest recycling rate?",
        options: ["Japan", "Germany", "South Korea", "Sweden"],
        correctAnswer: 2,
        explanation: "South Korea has one of the highest recycling rates in the world."
      }
    ],
    hi: [
      {
        question: "कौन सा कचरा कम्पोस्टेबल है?",
        options: ["प्लास्टिक", "केला छिलका", "बैटरी", "स्टायरोफोम"],
        correctAnswer: 1,
        explanation: "केला छिलका जैविक गीला कचरा है जो कम्पोस्ट किया जा सकता है।"
      },
      {
        question: "बैटरी कहाँ फेंकनी चाहिए?",
        options: ["सूखा कचरा", "गीला कचरा", "खतरनाक कचरा", "पुनर्चक्रण"],
        correctAnswer: 2,
        explanation: "बैटरी में हानिकारक रसायन होते हैं और यह खतरनाक कचरा है।"
      },
      {
        question: "कौन सा डस्टबिन सूखे कचरे के लिए है?",
        options: ["हरा", "नीला", "लाल", "पीला"],
        correctAnswer: 1,
        explanation: "नीला डस्टबिन सामान्यतः सूखे पुनर्चक्रण योग्य कचरे के लिए होता है।"
      },
      {
        question: "3R में पहला R का क्या मतलब है?",
        options: ["पुनर्चक्रण", "कम करना", "पुनः उपयोग", "निकालना"],
        correctAnswer: 1,
        explanation: "3R का मतलब है कम करना, पुनः उपयोग और पुनर्चक्रण - इसी क्रम में।"
      },
      {
        question: "कम्पोस्टिंग में कितना समय लगता है?",
        options: ["4-8 सप्ताह", "1 दिन", "1 साल", "4 महीने"],
        correctAnswer: 0,
        explanation: "घरेलू कम्पोस्टिंग में सही स्थितियों में आमतौर पर 4 से 8 सप्ताह लगते हैं।"
      },
      {
        question: "गीले कचरे के लिए किस रंग का डस्टबिन प्रयोग होता है?",
        options: ["नीला", "हरा", "लाल", "पीला"],
        correctAnswer: 1,
        explanation: "हरे डस्टबिन आमतौर पर गीले/जैविक कचरे के लिए उपयोग होते हैं।"
      },
      {
        question: "कौन सी सामग्री सबसे अधिक समय तक नष्ट नहीं होती?",
        options: ["कागज", "कांच", "सेब का छिलका", "पत्ते"],
        correctAnswer: 1,
        explanation: "कांच को प्राकृतिक रूप से नष्ट होने में 10 लाख साल से अधिक समय लग सकता है।"
      },
      {
        question: "पुनर्चक्रण का मुख्य फायदा क्या है?",
        options: ["पैसे की बचत", "लैंडफिल कचरा कम करना", "नौकरियां बनाना", "उपरोक्त सभी"],
        correctAnswer: 3,
        explanation: "पुनर्चक्रण ये सभी फायदे और भी कई लाभ प्रदान करता है।"
      },
      {
        question: "कम्पोस्ट में कौन सा कचरा कभी नहीं डालना चाहिए?",
        options: ["फलों के छिलके", "मांस के टुकड़े", "सब्जी का कचरा", "पत्ते"],
        correctAnswer: 1,
        explanation: "मांस के टुकड़े कीड़े आकर्षित करते हैं और कम्पोस्ट में बदबू पैदा करते हैं।"
      },
      {
        question: "घरेलू कचरे का कितना प्रतिशत कम्पोस्ट किया जा सकता है?",
        options: ["10-20%", "30-40%", "50-60%", "70-80%"],
        correctAnswer: 1,
        explanation: "घरेलू कचरे का लगभग 30-40% जैविक होता है और कम्पोस्ट किया जा सकता है।"
      },
      {
        question: "बायोगैस किससे बनती है?",
        options: ["प्लास्टिक कचरा", "जैविक कचरा", "धातु कचरा", "कागज कचरा"],
        correctAnswer: 1,
        explanation: "बायोगैस सड़ते हुए जैविक कचरे से उत्पन्न होती है।"
      },
      {
        question: "कौन सा निपटान तरीका सबसे पर्यावरण अनुकूल है?",
        options: ["लैंडफिल", "जलाना", "पुनर्चक्रण", "समुद्र में फेंकना"],
        correctAnswer: 2,
        explanation: "पुनर्चक्रण पर्यावरणीय प्रभाव कम करता है और संसाधनों का संरक्षण करता है।"
      },
      {
        question: "'शून्य अपशिष्ट' का क्या मतलब है?",
        options: ["कोई कचरा नहीं", "100% पुनर्चक्रण", "कचरा कमी का लक्ष्य", "परफेक्ट कचरा प्रबंधन"],
        correctAnswer: 2,
        explanation: "शून्य अपशिष्ट बेहतर डिज़ाइन और उपभोग के माध्यम से कचरा कम करने का लक्ष्य है।"
      },
      {
        question: "कौन सा देश कचरा प्रबंधन में अग्रणी है?",
        options: ["अमेरिका", "जर्मनी", "भारत", "चीन"],
        correctAnswer: 1,
        explanation: "जर्मनी के पास दुनिया की सबसे उन्नत कचरा प्रबंधन प्रणालियों में से एक है।"
      },
      {
        question: "कम्पोस्ट कितनी बार खाली करना चाहिए?",
        options: ["रोज", "साप्ताहिक", "मासिक", "जब तैयार हो"],
        correctAnswer: 3,
        explanation: "कम्पोस्ट तब तैयार होता है जब वह गहरा, भुरभुरा और मिट्टी जैसी महक वाला हो।"
      },
      {
        question: "ई-वेस्ट क्या है?",
        options: ["इलेक्ट्रॉनिक कचरा", "ऊर्जा कचरा", "खाने योग्य कचरा", "महंगा कचरा"],
        correctAnswer: 0,
        explanation: "ई-वेस्ट का मतलब है फेंके गए इलेक्ट्रॉनिक उपकरण और पुर्जे।"
      },
      {
        question: "कौन सी कचरा प्रबंधन विधि ऊर्जा उत्पन्न करती है?",
        options: ["लैंडफिल", "कम्पोस्टिंग", "जलाना", "पुनर्चक्रण"],
        correctAnswer: 2,
        explanation: "कचरे से ऊर्जा बनाने वाली भट्टियां बिजली और गर्मी उत्पन्न करती हैं।"
      },
      {
        question: "वैश्विक स्तर पर कितना प्रतिशत प्लास्टिक वास्तव में पुनर्चक्रित होता है?",
        options: ["10% से कम", "25%", "50%", "75%"],
        correctAnswer: 0,
        explanation: "अब तक बने सभी प्लास्टिक का 10% से भी कम पुनर्चक्रित हुआ है।"
      },
      {
        question: "कौन सा कचरा धारा सबसे तेज़ी से बढ़ रहा है?",
        options: ["खाद्य कचरा", "प्लास्टिक कचरा", "ई-वेस्ट", "कागज कचरा"],
        correctAnswer: 2,
        explanation: "ई-वेस्ट वैश्विक स्तर पर सबसे तेज़ी से बढ़ने वाला कचरा धारा है।"
      },
      {
        question: "लैंडफिल गैस का मुख्य घटक क्या है?",
        options: ["ऑक्सीजन", "नाइट्रोजन", "मीथेन", "कार्बन डाइऑक्साइड"],
        correctAnswer: 2,
        explanation: "मीथेन लैंडफिल गैस का प्राथमिक घटक है और एक प्रबल ग्रीनहाउस गैस है।"
      },
      {
        question: "एल्यूमिनियम कैन को प्राकृतिक रूप से नष्ट होने में कितना समय लगता है?",
        options: ["1 साल", "10 साल", "100 साल", "400+ साल"],
        correctAnswer: 3,
        explanation: "एल्यूमिनियम कैन को प्राकृतिक रूप से नष्ट होने में 400+ साल लगते हैं।"
      },
      {
        question: "वृत्तीय अर्थव्यवस्था क्या है?",
        options: ["गोल कचरा डिब्बे", "पुनर्चक्रण लूप", "कचरा कम करने वाला आर्थिक मॉडल", "कचरा संग्रह मार्ग"],
        correctAnswer: 2,
        explanation: "वृत्तीय अर्थव्यवस्था डिज़ाइन के माध्यम से कचरा समाप्त करने पर केंद्रित मॉडल है।"
      },
      {
        question: "कौन सी कचरा छंटाई विधि सबसे प्रभावी है?",
        options: ["स्रोत पृथक्करण", "केंद्रीय छंटाई", "AI छंटाई", "मैनुअल छंटाई"],
        correctAnswer: 0,
        explanation: "घरों/व्यवसायों में स्रोत पृथक्करण सबसे प्रभावी है।"
      },
      {
        question: "लैंडफिल में जैविक कचरे का क्या होता है?",
        options: ["प्राकृतिक कम्पोस्ट", "मीथेन उत्पादन", "जल्दी गायब", "उपजाऊ मिट्टी बनना"],
        correctAnswer: 1,
        explanation: "लैंडफिल में जैविक कचरा अवायवीय स्थितियों के कारण मीथेन पैदा करता है।"
      },
      {
        question: "किस देश की पुनर्चक्रण दर सबसे अधिक है?",
        options: ["जापान", "जर्मनी", "दक्षिण कोरिया", "स्वीडन"],
        correctAnswer: 2,
        explanation: "दक्षिण कोरिया की दुनिया में सबसे उच्च पुनर्चक्रण दरों में से एक है।"
      }
    ]
  };

  // Randomize 20 unique questions for each user
  const shuffleArray = <T extends any>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeQuiz = useCallback(() => {
    const availableQuestions = allQuizQuestions[currentLang] || allQuizQuestions.en;
    const randomizedQuestions = shuffleArray(availableQuestions).slice(0, 20);
    setQuizQuestions(randomizedQuestions);
    setCurrentQuestion(0);
    setAnswers(Array(20).fill(null));
    setReviewFlags(Array(20).fill(false));
    setIsCompleted(false);
    setScore(0);
    setSelectedAnswer('');
    setTimeLeft(60);
    setUsedQuestions(new Set());
  }, [currentLang]);

  useEffect(() => {
    initializeQuiz();
  }, [initializeQuiz]);

  // Timer effect
  useEffect(() => {
    if (!isCompleted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      // Auto-submit when time runs out
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer('');
        setTimeLeft(60);
      } else {
        submitQuiz();
      }
    }
  }, [timeLeft, isCompleted, currentQuestion, quizQuestions.length]);

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = parseInt(value);
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]?.toString() || '');
      setTimeLeft(60); // Reset timer for next question
    } else {
      submitQuiz();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]?.toString() || '');
      setTimeLeft(60); // Reset timer when going back
    }
  };

  const handleSkip = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = null;
    setAnswers(newAnswers);
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]?.toString() || '');
      setTimeLeft(60); // Reset timer for next question
    } else {
      submitQuiz();
    }
  };

  const toggleReview = () => {
    const newReviewFlags = [...reviewFlags];
    newReviewFlags[currentQuestion] = !newReviewFlags[currentQuestion];
    setReviewFlags(newReviewFlags);
  };

  const submitQuiz = () => {
    let correctCount = 0;
    answers.forEach((answer, index) => {
      if (answer === quizQuestions[index].correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setIsCompleted(true);
  };

  const resetQuiz = () => {
    initializeQuiz(); // This will generate new random questions
  };

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="bg-gradient-card shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              Quiz Completed!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-4xl font-bold text-primary">
              {score}/{quizQuestions.length}
            </div>
            <p className="text-lg text-muted-foreground">
              {score >= quizQuestions.length * 0.8 ? '🏆 Excellent!' : 
               score >= quizQuestions.length * 0.6 ? '👍 Good job!' : 
               '💪 Keep learning!'}
            </p>
            
            <div className="space-y-4 text-left">
              {quizQuestions.map((q, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === q.correctAnswer;
                return (
                  <div key={index} className="p-4 rounded-lg bg-muted/30 border-l-4 border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                      <span className="font-medium">Question {index + 1}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{q.explanation}</p>
                  </div>
                );
              })}
            </div>
            
            <Button onClick={resetQuiz} className="w-full">
              Take Quiz Again (New Questions)
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const currentQ = quizQuestions[currentQuestion];

  if (!currentQ) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="bg-gradient-card shadow-xl">
          <CardContent className="text-center p-6">
            Loading quiz questions...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="bg-gradient-card shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Brain className="w-6 h-6" />
              {t('play_quiz')} - 20 Questions
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-warning" />
                <span className={`text-sm font-bold ${timeLeft <= 10 ? 'text-destructive animate-pulse' : 'text-warning'}`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {currentQuestion + 1}/20
              </div>
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {currentQ.question}
            </h3>
            
            <RadioGroup value={selectedAnswer} onValueChange={handleAnswerChange}>
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="flex justify-between gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentQuestion === 0}
            >
              {t('back')}
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSkip}>
                {t('skip')}
              </Button>
              
              <Button
                variant="outline"
                onClick={toggleReview}
                className={reviewFlags[currentQuestion] ? 'bg-warning text-warning-foreground' : ''}
              >
                {reviewFlags[currentQuestion] ? 'Unmark' : t('review_later')}
              </Button>
            </div>
            
            <Button
              onClick={handleNext}
              disabled={!selectedAnswer && answers[currentQuestion] === null}
            >
              {currentQuestion === quizQuestions.length - 1 ? t('submit') : t('next')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizSection;