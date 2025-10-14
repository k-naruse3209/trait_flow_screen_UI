import React, { useEffect, useState } from 'react';
import { EnergyLevel, Checkin, PersonalizedMessage } from '../types';
import { CloseIcon, ArrowRightIcon } from './Icons';

interface CheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (checkin: Omit<Checkin, 'id' | 'date'>) => Promise<PersonalizedMessage>;
}

const energyLevels: { level: EnergyLevel; emoji: string; label: string }[] = [
  { level: 'low', emoji: '😴', label: '低い' },
  { level: 'medium', emoji: '😐', label: '普通' },
  { level: 'high', emoji: '🙂', label: '高い' },
];

const CheckinModal: React.FC<CheckinModalProps> = ({ isOpen, onClose, onSave }) => {
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState<EnergyLevel>('medium');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'form' | 'loading' | 'result'>('form');
  const [resultMessage, setResultMessage] = useState<PersonalizedMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setMood(3);
    setEnergy('medium');
    setNote('');
    setStatus('form');
    setResultMessage(null);
    setError(null);
  };

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getMoodEmoji = (value: number) => {
    if (value <= 1) return '😢';
    if (value === 2) return '😟';
    if (value === 3) return '😐';
    if (value === 4) return '🙂';
    return '😊';
  };

  const handleSave = async () => {
    if (status === 'loading') return;
    setStatus('loading');
    setError(null);

    try {
      const trimmedNote = note.trim();
      const payload: Omit<Checkin, 'id' | 'date'> = {
        mood,
        energy,
        ...(trimmedNote ? { note: trimmedNote } : {}),
      };
      const message = await onSave(payload);
      setResultMessage(message);
      setStatus('result');
    } catch (err) {
      console.error(err);
      setError('送信に失敗しました。しばらくしてからもう一度お試しください。');
      setStatus('form');
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-end z-50">
      <div className="bg-white rounded-t-3xl shadow-lg w-full max-w-md p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-neutral-800">✍️ チェックイン</h2>
          <button onClick={handleClose} disabled={status === 'loading'} className="text-neutral-500 hover:text-neutral-800 disabled:opacity-40">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {status === 'form' && (
          <div className="space-y-6">
            <div>
              <label className="block text-md font-medium text-neutral-700 mb-2">今日の気分はどうですか？</label>
              <div className="flex items-center space-x-4">
                <span className="text-2xl">😢</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="text-2xl">😊</span>
              </div>
              <div className="text-center mt-2 text-neutral-600 font-semibold">{getMoodEmoji(mood)} {mood}/5</div>
            </div>

            <div className="border-t border-neutral-200 pt-6">
              <label className="block text-md font-medium text-neutral-700 mb-3">エネルギーレベルは？</label>
              <div className="grid grid-cols-3 gap-3">
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
                placeholder="気になった出来事や感情を記録しましょう"
                className="w-full p-3 border-2 border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
          </div>
        )}

        {status === 'loading' && (
          <div className="py-12 flex flex-col items-center space-y-4 text-neutral-600">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p>メッセージを生成しています...</p>
          </div>
        )}

        {status === 'result' && resultMessage && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-neutral-500 mb-2">今日のおすすめ</p>
              <p className="text-neutral-700 leading-relaxed">{resultMessage.text}</p>
            </div>
            <p className="text-sm text-neutral-500">このフィードバックは、直近のチェックイン内容とパーソナリティプロフィールに基づいています。</p>
          </div>
        )}

        <div className="mt-8">
          {status === 'form' && (
            <button
              onClick={handleSave}
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-200 shadow-sm flex items-center justify-center"
            >
              記録する
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
          )}

          {status === 'result' && (
            <button
              onClick={handleClose}
              className="w-full bg-secondary text-white font-bold py-3 px-4 rounded-lg hover:bg-secondary-dark transition-colors duration-200 shadow-sm"
            >
              OK
            </button>
          )}
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
