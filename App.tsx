import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { BigFiveScores, BigFiveTrait, Checkin, EnergyLevel, PersonalizedMessage } from './types';
import { TIPI_QUESTIONS } from './constants';
import { HomeIcon, HistoryIcon, SettingsIcon, ArrowRightIcon, ArrowLeftIcon, MenuIcon } from './components/Icons';
import BigFiveRadarChart from './components/BigFiveRadarChart';
import CheckinModal from './components/CheckinModal';
import { getPersonalizedMessage } from './services/aiService';

// Mock data
const mockCheckinHistory: Checkin[] = [
    { id: 'c4', date: new Date(2025, 9, 13, 14, 30), mood: 8, energy: 'high', note: 'プロジェクトが順調に進んで嬉しい' },
    { id: 'c3', date: new Date(2025, 9, 12, 9, 15), mood: 6, energy: 'medium', note: '少し疲れ気味' },
    { id: 'c2', date: new Date(2025, 9, 11, 19, 45), mood: 7, energy: 'high' },
    { id: 'c1', date: new Date(2025, 9, 10, 10, 0), mood: 4, energy: 'low', note: '朝から調子が悪い' },
];
const mockMessageHistory: PersonalizedMessage[] = [
    { id: 'm2', date: new Date(2025, 9, 13), text: "あなたの高い協調性は素晴らしい強みです。今日は誰かの話をじっくり聴いてみてはいかがでしょうか？", rating: 5, personalizationInfo: { baseTrait: BigFiveTrait.Agreeableness, mood: 8, energy: 'high' } },
    { id: 'm1', date: new Date(2025, 9, 12), text: "時には休息も必要です。自分のペースで進めていきましょう。", rating: 4, personalizationInfo: { baseTrait: BigFiveTrait.Conscientiousness, mood: 6, energy: 'medium' } },
];


// --- Helper Components (defined outside main components to prevent re-renders) ---

const FeatureListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-center">
        <svg className="w-5 h-5 text-secondary mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
        <span>{children}</span>
    </li>
);

const AppHeader: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isNotHomePage = location.pathname !== '/app/home' && location.pathname !== '/app/';

    return (
        <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-neutral-200">
            <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
                <div className="w-8">
                    {isNotHomePage ? (
                        <button onClick={() => navigate(-1)} className="text-neutral-600 hover:text-primary">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                    ) : (
                        <button className="text-neutral-600">
                            <MenuIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>
                <h1 className="text-lg font-bold text-primary">🌟 Trait Flow</h1>
                <Link to="/app/settings" className="text-neutral-600 w-8 flex justify-end">
                    <SettingsIcon className="w-6 h-6" />
                </Link>
            </div>
        </header>
    );
};

const BottomNav: React.FC = () => {
    const location = useLocation();
    const navItems = [
        { path: '/app/home', icon: HomeIcon, label: 'ホーム' },
        { path: '/app/history', icon: HistoryIcon, label: '履歴' },
        { path: '/app/settings', icon: SettingsIcon, label: '設定' },
    ];

    return (
        <footer className="bg-white/80 backdrop-blur-sm sticky bottom-0 z-10 border-t border-neutral-200">
            <nav className="max-w-md mx-auto px-4 py-2 flex justify-around items-center">
                {navItems.map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center justify-center w-20 h-16 rounded-lg transition-colors ${location.pathname.startsWith(item.path) ? 'text-primary' : 'text-neutral-500 hover:text-primary hover:bg-blue-50'}`}
                    >
                        <item.icon className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </footer>
    );
};

// --- Dev Nav Component for easy screen access ---
const DevNav: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pages = [
        { path: '/', name: 'Landing' },
        { path: '/auth', name: 'Auth' },
        { path: '/onboarding', name: 'Onboarding' },
        { path: '/app/home', name: 'Home' },
        { path: '/app/history', name: 'History' },
        { path: '/app/settings', name: 'Settings' },
    ];

    return (
        <div className="fixed bottom-24 right-4 z-50 font-sans">
            {isOpen && (
                <div className="bg-white rounded-lg shadow-xl p-2 mb-2 flex flex-col items-start space-y-1 w-40">
                    <p className="px-3 py-1 text-xs text-neutral-400">Dev Navigation</p>
                    {pages.map(page => (
                        <Link key={page.path} to={page.path} onClick={() => setIsOpen(false)} className="w-full text-left px-3 py-1 rounded hover:bg-neutral-100 text-neutral-800">
                            {page.name}
                        </Link>
                    ))}
                </div>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-accent text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center focus:outline-none"
                aria-label="Developer Navigation"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </button>
        </div>
    );
};


// --- Page Components ---

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center items-center p-4 text-center">
            <div className="max-w-md w-full">
                <h1 className="text-5xl font-extrabold text-primary mb-2">🌟 Trait Flow</h1>
                <p className="text-lg text-neutral-600 mb-8">あなたの性格特性に寄り添う<br />パーソナライズされたメンタルヘルスサポート</p>

                <div className="space-y-4 mb-8">
                    <input
                        type="email"
                        placeholder="📧 メールアドレスを入力"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                    />
                    <button onClick={() => navigate('/auth')} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-200 shadow-sm flex items-center justify-center">
                        パイロット参加に申し込む
                        <ArrowRightIcon className="w-5 h-5 ml-2" />
                    </button>
                </div>
                
                <ul className="space-y-2 text-neutral-600">
                    <FeatureListItem>Big Five性格診断</FeatureListItem>
                    <FeatureListItem>毎日のパーソナライズドメッセージ</FeatureListItem>
                    <FeatureListItem>気分・エネルギーレベルのトラッキング</FeatureListItem>
                </ul>
            </div>
        </div>
    );
};

const AuthPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSendLink = () => {
        if (email) {
            setSent(true);
            setTimeout(() => {
                navigate('/onboarding');
            }, 2000);
        }
    };
    
    return (
        <div className="min-h-screen bg-neutral-100 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md relative">
                <button onClick={() => navigate(-1)} className="absolute top-4 left-4 text-neutral-500 hover:text-neutral-800 transition-colors" aria-label="Go Back">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-neutral-800 mb-2">🔐 ログイン</h1>
                    <p className="text-neutral-600 mb-6">メールアドレスにマジックリンクを送信します</p>

                    <div className="space-y-4">
                        <input
                            type="email"
                            placeholder="📧 your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                            disabled={sent}
                        />
                        <button onClick={handleSendLink} disabled={sent} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-200 shadow-sm flex items-center justify-center disabled:bg-neutral-400">
                            {sent ? '送信しました...' : 'マジックリンクを送信'}
                            {!sent && <ArrowRightIcon className="w-5 h-5 ml-2" />}
                        </button>
                    </div>
                    {sent && <p className="mt-6 text-secondary font-medium">受信箱を確認してリンクをクリックしてください</p>}
                </div>
            </div>
        </div>
    );
};

const OnboardingPage: React.FC = () => {
    const [step, setStep] = useState(0); // 0: welcome, 1: questions, 2: results
    const [answers, setAnswers] = useState<{[key: number]: number}>({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [scores, setScores] = useState<BigFiveScores | null>(null);
    const navigate = useNavigate();

    const handleNext = () => {
        if (currentQuestion < TIPI_QUESTIONS.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            calculateScores();
            setStep(2);
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };
    
    const handleAnswer = (questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const calculateScores = () => {
        const calculatedScores: BigFiveScores = {
            [BigFiveTrait.Extraversion]: 0,
            [BigFiveTrait.Agreeableness]: 0,
            [BigFiveTrait.Conscientiousness]: 0,
            [BigFiveTrait.Neuroticism]: 0,
            [BigFiveTrait.Openness]: 0,
        };
        const traitCounts = {...calculatedScores};

        TIPI_QUESTIONS.forEach(q => {
            const answer = answers[q.id] || 4; // Default to neutral if not answered
            const score = q.isReversed ? 8 - answer : answer;
            calculatedScores[q.trait] += score;
            traitCounts[q.trait] += 1;
        });

        for (const trait in calculatedScores) {
             const key = trait as BigFiveTrait;
             calculatedScores[key] /= traitCounts[key];
        }

        setScores(calculatedScores);
    };

    const q = TIPI_QUESTIONS[currentQuestion];
    
    if (step === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col justify-center items-center p-6">
                 <div className="max-w-md w-full relative">
                    <button onClick={() => navigate(-1)} className="absolute -top-16 left-0 text-neutral-500 hover:text-neutral-800 transition-colors" aria-label="Go Back">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-neutral-800 mb-4">👋 ようこそ Trait Flow へ</h1>
                        <p className="text-neutral-600 mb-6">まず、あなたの性格特性を理解するために<br />簡単な10問のアンケートに答えてください</p>
                        <div className="bg-blue-50 border-l-4 border-primary p-4 rounded-r-lg text-left mb-6">
                            <h2 className="font-bold text-primary">TIPI (Ten-Item Personality Inventory)</h2>
                            <p className="text-sm text-neutral-700">Big Five性格特性モデルに基づいた科学的に検証された質問票です。</p>
                        </div>
                        <p className="text-neutral-500 mb-8">所要時間: 約2分</p>
                        <button onClick={() => setStep(1)} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-200 shadow-sm flex items-center justify-center">
                            始める <ArrowRightIcon className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    if (step === 1) {
        return (
            <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
                <div className="max-w-md w-full">
                    <div className="px-2 mb-6">
                        <div className="text-right text-sm text-neutral-500 mb-1">{currentQuestion + 1} / {TIPI_QUESTIONS.length}</div>
                        <div className="w-full bg-neutral-200 rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${((currentQuestion + 1) / TIPI_QUESTIONS.length) * 100}%` }}></div>
                        </div>
                    </div>
                    
                    <div className="bg-neutral-50 p-6 rounded-xl shadow-sm text-center">
                        <p className="text-neutral-600 mb-4">私は自分自身を次のような人間だと思う:</p>
                        <p className="text-xl font-bold text-neutral-800 mb-8 h-14 flex items-center justify-center">「{q.text}」</p>
                        <div className="flex justify-between text-xs text-neutral-500 px-1 mb-2">
                            <span>全く当てはまらない</span>
                            <span>非常に当てはまる</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="7"
                            value={answers[q.id] || 4}
                            onChange={(e) => handleAnswer(q.id, Number(e.target.value))}
                            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                         <div className="flex justify-between text-xs text-neutral-500 px-1 mt-1">
                            {[1,2,3,4,5,6,7].map(n => <span key={n}>{n}</span>)}
                        </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                         <button onClick={handleBack} disabled={currentQuestion === 0} className="bg-neutral-200 text-neutral-700 font-bold py-3 px-6 rounded-lg hover:bg-neutral-300 transition-colors duration-200 flex items-center disabled:opacity-50">
                            <ArrowLeftIcon className="w-5 h-5 mr-2" /> 戻る
                        </button>
                         <button onClick={handleNext} disabled={!answers[q.id]} className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-200 flex items-center disabled:bg-neutral-400">
                            {currentQuestion === TIPI_QUESTIONS.length - 1 ? '完了' : '次へ'} <ArrowRightIcon className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    if (step === 2 && scores) {
        return (
            <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
                <div className="max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-neutral-800 mb-4">🎯 あなたの性格特性プロフィール</h1>
                    <div className="w-full h-80">
                        <BigFiveRadarChart scores={scores} />
                    </div>
                    <div className="text-left space-y-3 bg-neutral-50 p-4 rounded-lg mb-6">
                        <h2 className="font-bold text-lg mb-2">【あなたの特徴】</h2>
                        {Object.entries(scores).map(([trait, score]) => (
                            <div key={trait}>
                                <p className="font-bold text-primary">{trait}: <span className="text-neutral-800">{score.toFixed(1)}/7</span></p>
                                <p className="text-sm text-neutral-600">{trait}が{score > 4.5 ? '高い' : score < 3.5 ? '低い' : '中程度'}傾向にあります。</p>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => navigate('/app/home')} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-200 shadow-sm flex items-center justify-center">
                        ホームへ <ArrowRightIcon className="w-5 h-5 ml-2" />
                    </button>
                </div>
            </div>
        );
    }

    return <div>Loading...</div>;
};

const HomePage: React.FC = () => {
    const [isCheckinModalOpen, setCheckinModalOpen] = useState(false);
    const [message, setMessage] = useState<PersonalizedMessage | null>(null);
    const [loadingMessage, setLoadingMessage] = useState(true);

    const fetchMessage = useCallback(async () => {
        setLoadingMessage(true);
        // In a real app, you would fetch the user's actual scores and checkin data.
        const mockScores: BigFiveScores = {
            [BigFiveTrait.Extraversion]: 3.5, [BigFiveTrait.Agreeableness]: 5.8, [BigFiveTrait.Conscientiousness]: 6.2,
            [BigFiveTrait.Neuroticism]: 2.1, [BigFiveTrait.Openness]: 5.1
        };
        const msg = await getPersonalizedMessage(mockScores, mockCheckinHistory[0] || null);
        setMessage(msg);
        setLoadingMessage(false);
    }, []);

    useEffect(() => {
        fetchMessage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSaveCheckin = (checkinData: Omit<Checkin, 'id' | 'date'>) => {
        console.log("Saving check-in:", checkinData);
        // Here you would save the data to your backend.
    };
    
    return (
        <div className="p-4 space-y-6">
            <div className="text-left">
                <h2 className="text-2xl font-bold text-neutral-800">こんにちは、田中さん 👋</h2>
                <p className="text-neutral-600">今日も一日を大切に過ごしましょう</p>
            </div>
            
            {/* Today's Message Card */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-neutral-200">
                <h3 className="text-lg font-bold text-primary mb-3">📬 今日のメッセージ</h3>
                {loadingMessage ? (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                        <div className="h-4 bg-neutral-200 rounded w-4/6"></div>
                    </div>
                ) : (
                    <p className="text-neutral-700 mb-4">{message?.text}</p>
                )}
                <div className="border-t border-neutral-200 pt-3">
                    <p className="text-sm text-neutral-600 mb-2">💡 このメッセージは役立ちましたか？</p>
                    <div className="flex items-center text-2xl text-yellow-400 cursor-pointer">
                        {[1,2,3,4,5].map(star => <span key={star} className="hover:text-yellow-500 transition-colors">⭐</span>)}
                    </div>
                </div>
            </div>

            {/* Check-in Card */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-neutral-200">
                <h3 className="text-lg font-bold text-secondary mb-2">✍️ 今日のチェックイン</h3>
                <p className="text-neutral-600 mb-4">気分とエネルギーレベルを記録しましょう</p>
                <button onClick={() => setCheckinModalOpen(true)} className="w-full bg-secondary text-white font-bold py-3 px-4 rounded-lg hover:bg-secondary-dark transition-colors duration-200 shadow-sm flex items-center justify-center">
                    チェックインする <ArrowRightIcon className="w-5 h-5 ml-2" />
                </button>
            </div>
            
            <div className="bg-neutral-200 text-center py-3 px-4 rounded-lg">
                <p className="text-neutral-700 font-semibold">📊 連続チェックイン: 7日 | 今週: 5回</p>
            </div>
            
            <CheckinModal isOpen={isCheckinModalOpen} onClose={() => setCheckinModalOpen(false)} onSave={handleSaveCheckin} />
        </div>
    );
};

const HistoryPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'checkin' | 'message'>('checkin');
    
    const energyMap: {[key in EnergyLevel]: {emoji: string; label: string}} = {
      low: { emoji: '😴', label: '低い' },
      medium: { emoji: '😐', label: '普通' },
      high: { emoji: '🙂', label: '高い' },
      very_high: { emoji: '⚡️', label: '非常に高い' }
    };
    
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-neutral-800 mb-4">履歴</h1>
            <div className="flex border-b-2 border-neutral-200 mb-4">
                <button 
                  onClick={() => setActiveTab('checkin')}
                  className={`py-2 px-4 text-lg font-semibold transition-colors ${activeTab === 'checkin' ? 'text-primary border-b-2 border-primary' : 'text-neutral-500'}`}>
                  チェックイン
                </button>
                <button 
                  onClick={() => setActiveTab('message')}
                  className={`py-2 px-4 text-lg font-semibold transition-colors ${activeTab === 'message' ? 'text-primary border-b-2 border-primary' : 'text-neutral-500'}`}>
                  メッセージ
                </button>
            </div>
            
            <div className="space-y-4">
                {activeTab === 'checkin' && mockCheckinHistory.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border">
                        <p className="text-sm text-neutral-500 mb-1">{item.date.toLocaleString('ja-JP')}</p>
                        <p className="text-neutral-800 font-medium">気分: {item.mood}/10 | エネルギー: {energyMap[item.energy].emoji} {energyMap[item.energy].label}</p>
                        {item.note && <p className="text-sm text-neutral-600 mt-2 bg-neutral-100 p-2 rounded">メモ: {item.note}</p>}
                    </div>
                ))}
                
                {activeTab === 'message' && mockMessageHistory.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border">
                        <p className="text-sm text-neutral-500 mb-2">📬 {item.date.toLocaleDateString('ja-JP')}</p>
                        <p className="text-neutral-700 mb-3">{item.text}</p>
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center text-yellow-400">
                            {'⭐'.repeat(item.rating || 0)}{'☆'.repeat(5 - (item.rating || 0))}
                            <span className="ml-2 text-neutral-500">評価済み</span>
                          </div>
                          <button className="font-bold text-primary hover:underline">👉 詳細を見る</button>
                        </div>
                    </div>
                ))}

                <div className="text-center py-4">
                    <button className="text-primary font-semibold hover:underline">↓ もっと読み込む</button>
                </div>
            </div>
        </div>
    );
};

const SettingsPage: React.FC = () => {
    return (
        <div className="p-4 pb-16">
            <h1 className="text-2xl font-bold text-neutral-800 mb-6">設定</h1>
            <div className="space-y-8">
                {/* Account Info */}
                <section>
                    <h2 className="text-lg font-bold text-neutral-700 mb-3 border-b pb-2">👤 アカウント情報</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-neutral-500">📧 メールアドレス</label>
                            <p className="text-neutral-800">tanaka@example.com</p>
                        </div>
                        <div>
                            <label className="text-sm text-neutral-500">🎯 性格特性プロフィール</label>
                            <button className="w-full mt-1 text-left bg-neutral-100 p-3 rounded-lg flex justify-between items-center hover:bg-neutral-200">
                                プロフィールを見る <ArrowRightIcon className="w-5 h-5 text-neutral-500" />
                            </button>
                        </div>
                    </div>
                </section>
                
                 {/* Notifications */}
                <section>
                    <h2 className="text-lg font-bold text-neutral-700 mb-3 border-b pb-2">🔔 通知設定</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label>毎日のリマインダー</label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                          <input type="checkbox" name="toggle" id="toggle1" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                          <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <label>メッセージ受信時の通知</label>
                         <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                          <input type="checkbox" name="toggle2" id="toggle2" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked/>
                          <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                      </div>
                    </div>
                </section>

                {/* Data Management */}
                <section>
                    <h2 className="text-lg font-bold text-neutral-700 mb-3 border-b pb-2">⚠️ データ管理</h2>
                    <div className="space-y-3">
                        <button className="w-full text-left bg-neutral-100 p-3 rounded-lg flex justify-between items-center hover:bg-neutral-200">
                            データのエクスポート →
                        </button>
                        <button className="w-full text-left bg-red-50 p-3 rounded-lg flex justify-between items-center hover:bg-red-100 text-error">
                            データ削除リクエスト →
                        </button>
                    </div>
                </section>
                
                {/* Logout */}
                <section>
                     <button className="w-full bg-neutral-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-neutral-800 transition-colors duration-200">
                        🚪 ログアウト
                    </button>
                </section>

                <div className="text-center text-neutral-400 text-sm pt-4">
                    バージョン: 0.1.0
                </div>
            </div>
            <style>{`
              .toggle-checkbox:checked { right: 0; border-color: #10b981; }
              .toggle-checkbox:checked + .toggle-label { background-color: #10b981; }
            `}</style>
        </div>
    );
};

// --- Main App Layout & Router ---

const AppLayout: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className="max-w-md mx-auto bg-neutral-50 min-h-screen flex flex-col font-sans">
        <AppHeader />
        <main className="flex-grow">
            {children}
        </main>
        <BottomNav />
    </div>
);


const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/app/*" element={
            <AppLayout>
                <Routes>
                    <Route path="home" element={<HomePage />} />
                    <Route path="history" element={<HistoryPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="home" replace />} />
                </Routes>
            </AppLayout>
        }/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <DevNav />
    </HashRouter>
  );
};

export default App;