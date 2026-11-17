import { useCallback, useEffect, useState } from 'react';
import { CreditTransaction, FeatureId, SavedPhotoItem, TabId, UserProfile } from '../types/app';

const STORAGE_KEYS = {
  USER: 'photo_ai_user_v1',
  PHOTOS: 'photo_ai_saved_photos_v1',
  TRANSACTIONS: 'photo_ai_transactions_v1',
};

const DEFAULT_USER: UserProfile = {
  isRegistered: false,
  name: 'სტუმარი',
  email: '',
  plan: 'free',
  credits: 10,
  joinedAt: new Date().toLocaleDateString('ka-GE'),
};

const DEFAULT_TRANSACTIONS: CreditTransaction[] = [
  {
    id: 'tx-welcome',
    label: 'საწყისი დემო კრედიტები',
    amount: 10,
    timestamp: 'დღეს',
  },
];

function safeReadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWriteStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function useAppState() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [selectedFeature, setSelectedFeature] = useState<FeatureId>('enhance');
  const [selectedStyleId, setSelectedStyleId] = useState<string>('studio-violet');
  const [pendingUploadUrl, setPendingUploadUrl] = useState<string | null>(null);

  const [user, setUser] = useState<UserProfile>(() => safeReadStorage(STORAGE_KEYS.USER, DEFAULT_USER));
  const [savedPhotos, setSavedPhotos] = useState<SavedPhotoItem[]>(() =>
    safeReadStorage(STORAGE_KEYS.PHOTOS, [])
  );
  const [transactions, setTransactions] = useState<CreditTransaction[]>(() =>
    safeReadStorage(STORAGE_KEYS.TRANSACTIONS, DEFAULT_TRANSACTIONS)
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    safeWriteStorage(STORAGE_KEYS.USER, user);
  }, [user]);

  useEffect(() => {
    safeWriteStorage(STORAGE_KEYS.PHOTOS, savedPhotos);
  }, [savedPhotos]);

  useEffect(() => {
    safeWriteStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
  }, [transactions]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const registerUser = useCallback(
    (name: string, email: string) => {
      const bonus = user.isRegistered ? 0 : 10;
      setUser((prev) => ({
        ...prev,
        isRegistered: true,
        name: name.trim(),
        email: email.trim(),
        credits: prev.credits + bonus,
        joinedAt: new Date().toLocaleDateString('ka-GE'),
      }));

      if (bonus > 0) {
        setTransactions((prev) => [
          {
            id: `tx-${Date.now()}`,
            label: 'რეგისტრაციის ბონუს კრედიტები',
            amount: bonus,
            timestamp: new Date().toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' }),
          },
          ...prev,
        ]);
        showToast('რეგისტრაცია წარმატებით დასრულდა · +10 კრედიტი დაგემატათ');
      } else {
        showToast('პროფილის მონაცემები განახლდა');
      }
    },
    [user.isRegistered, showToast]
  );

  const logoutUser = useCallback(() => {
    setUser(DEFAULT_USER);
    showToast('ანგარიშიდან გამოხვედით');
  }, [showToast]);

  const consumeCredit = useCallback(
    (cost: number, actionLabel: string): boolean => {
      if (user.credits < cost) {
        showToast('კრედიტები ამოიწურა — გადადით Premium გვერდზე შესავსებად');
        return false;
      }

      setUser((prev) => ({
        ...prev,
        credits: Math.max(0, prev.credits - cost),
      }));

      setTransactions((prev) => [
        {
          id: `tx-${Date.now()}`,
          label: `${actionLabel} (დემო)`,
          amount: -cost,
          timestamp: new Date().toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev.slice(0, 19),
      ]);

      return true;
    },
    [user.credits, showToast]
  );

  const addCredits = useCallback(
    (amount: number, label: string, newPlan?: 'free' | 'pro' | 'studio') => {
      setUser((prev) => ({
        ...prev,
        credits: prev.credits + amount,
        plan: newPlan ?? prev.plan,
      }));

      if (amount > 0) {
        setTransactions((prev) => [
          {
            id: `tx-${Date.now()}`,
            label,
            amount,
            timestamp: new Date().toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' }),
          },
          ...prev.slice(0, 19),
        ]);
      }

      showToast(`${label} გააქტიურდა (დემო რეჟიმი)`);
    },
    [showToast]
  );

  const savePhoto = useCallback(
    (item: Omit<SavedPhotoItem, 'id' | 'createdAt' | 'isDemo'>) => {
      const newEntry: SavedPhotoItem = {
        ...item,
        id: `photo-${Date.now()}`,
        createdAt: new Date().toLocaleDateString('ka-GE'),
        isDemo: true,
      };
      setSavedPhotos((prev) => [newEntry, ...prev].slice(0, 18));
      showToast('ფოტო შეინახა „ჩემი ფოტოები“-ში');
    },
    [showToast]
  );

  const deletePhoto = useCallback(
    (id: string) => {
      setSavedPhotos((prev) => prev.filter((p) => p.id !== id));
      showToast('ფოტო წაიშალა გალერეიდან');
    },
    [showToast]
  );

  const openCreateWithFeature = useCallback((featureId: FeatureId, styleId?: string) => {
    setSelectedFeature(featureId);
    if (styleId) {
      setSelectedStyleId(styleId);
    }
    setActiveTab('create');
  }, []);

  const openCreateWithUploadedPhoto = useCallback((dataUrl: string) => {
    setPendingUploadUrl(dataUrl);
    setActiveTab('create');
  }, []);

  return {
    activeTab,
    setActiveTab,
    selectedFeature,
    setSelectedFeature,
    selectedStyleId,
    setSelectedStyleId,
    pendingUploadUrl,
    setPendingUploadUrl,
    user,
    savedPhotos,
    transactions,
    toastMessage,
    showToast,
    clearToast,
    registerUser,
    logoutUser,
    consumeCredit,
    addCredits,
    savePhoto,
    deletePhoto,
    openCreateWithFeature,
    openCreateWithUploadedPhoto,
  };
}
