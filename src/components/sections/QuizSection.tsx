import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, Brain, CheckCircle, XCircle } from 'lucide-react';

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

  const quizQuestions: Record<string, QuizQuestion[]> = {
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
      }
    ]
  };

  const questions = quizQuestions[currentLang] || quizQuestions.en;

  useEffect(() => {
    // Reset quiz when language changes
    setCurrentQuestion(0);
    setAnswers(Array(questions.length).fill(null));
    setReviewFlags(Array(questions.length).fill(false));
    setIsCompleted(false);
    setScore(0);
    setSelectedAnswer('');
  }, [currentLang, questions.length]);

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = parseInt(value);
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]?.toString() || '');
    } else {
      submitQuiz();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]?.toString() || '');
    }
  };

  const handleSkip = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = null;
    setAnswers(newAnswers);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]?.toString() || '');
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
      if (answer === questions[index].correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setIsCompleted(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers(Array(questions.length).fill(null));
    setReviewFlags(Array(questions.length).fill(false));
    setIsCompleted(false);
    setScore(0);
    setSelectedAnswer('');
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
              {score}/{questions.length}
            </div>
            <p className="text-lg text-muted-foreground">
              {score >= questions.length * 0.8 ? '🏆 Excellent!' : 
               score >= questions.length * 0.6 ? '👍 Good job!' : 
               '💪 Keep learning!'}
            </p>
            
            <div className="space-y-4 text-left">
              {questions.map((q, index) => {
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
              Take Quiz Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="bg-gradient-card shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Brain className="w-6 h-6" />
              {t('play_quiz')}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {t('question_of', { current: currentQuestion + 1, total: questions.length })}
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
              {currentQuestion === questions.length - 1 ? t('submit') : t('next')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizSection;