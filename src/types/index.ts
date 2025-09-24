export interface User {
  id: string;
  username: string;
  type: 'worker' | 'authority';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface GameItem {
  name: string;
  binType: 'wet' | 'dry' | 'hazardous';
}

export interface Notification {
  id: string;
  message: string;
  date: Date;
  type: 'info' | 'warning' | 'success';
}

export interface Translation {
  [key: string]: string;
}

export interface Translations {
  [lang: string]: Translation;
}

export type Section = 'home' | 'worker-login' | 'authority-login' | 'learn' | 'quiz' | 'game' | 'tracking' | 'geo-upload' | 'purchase';