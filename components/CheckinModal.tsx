import React, { useState } from 'react';
import { EnergyLevel, Checkin } from '../types';
// FIX: Import `ArrowRightIcon` to resolve reference error.
import { CloseIcon, ArrowRightIcon } from './Icons';

interface CheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (checkin: Omit<Checkin, 'id' | 'date'>) => void;
}

const energyLevels: { level: EnergyLevel; emoji: string; label: string }[] = [
  { level: 'low', emoji: '😴', label: '低い' },
  { level: 'medium', emoji: '😐', label: '普通' },
  { level: 'high', emoji: '🙂', label: '高い' },
  { level: 'very_high', emoji: '⚡️', label: '非常に高い' },
];

const CheckinModal: React.FC<CheckinModalProps> = ({ isOpen, onClose, onSave }) => {
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState<EnergyLevel>('medium');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ mood, energy, note });
    // Reset state for next time
    setMood(5);
    setEnergy('medium');
    setNote('');
    onClose();
  };
  
  const getMoodEmoji = (value: number) => {
    if (value <= 2) return '😢';
    if (value <= 4) return '😟';
    if (value <= 6) return '😐';
    if (value <= 8) return '🙂';
    return '😊';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-end z-50">
      <div className="bg-white rounded-t-3xl shadow-lg w-full max-w-md p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-neutral-800">✍️ チェックイン</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-800">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-md font-medium text-neutral-700 mb-2">今日の気分はどうですか？</label>
            <div className="flex items-center space-x-4">
              <span className="text-2xl">😢</span>
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-2xl">😊</span>
            </div>
            <div className="text-center mt-2 text-neutral-600 font-semibold">{getMoodEmoji(mood)} {mood}/10</div>
          </div>
          
          <div className="border-t border-neutral-200 pt-6">
            <label className="block text-md font-medium text-neutral-700 mb-3">エネルギーレベルは？</label>
            <div className="grid grid-cols-4 gap-3">
              {energyLevels.map(({ level, emoji, label }) => (
                <button
                  key={level}
                  onClick={() => setEnergy(level)}
                  className={`p-3 border-2 rounded-lg flex flex-col items-center justify-center space-y-1 transition-all ${
                    energy === level ? 'bg-blue-100 border-primary' : 'bg-neutral-100 border-transparent hover:border-neutral-300'
                  }`}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-sm text-neutral-700">{label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="border-t border-neutral-200 pt-6">
            <label htmlFor="note" className="block text-md font-medium text-neutral-700 mb-2">メモ（任意）</label>
            <textarea
              id="note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="今日は少し疲れたけど、プロジェクトが進んで嬉しい"
              className="w-full p-3 border-2 border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSave}
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-200 shadow-sm flex items-center justify-center"
          >
            記録する
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
       <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default CheckinModal;