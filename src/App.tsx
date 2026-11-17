import { AnimatePresence, motion } from 'motion/react';
import { BottomNav } from './components/BottomNav';
import { CreateView } from './components/CreateView';
import { HomeView } from './components/HomeView';
import { MyPhotosView } from './components/MyPhotosView';
import { PremiumView } from './components/PremiumView';
import { ProfileView } from './components/ProfileView';
import { Toast } from './components/Toast';
import { TopBar } from './components/TopBar';
import { useAppState } from './hooks/useAppState';

export default function App() {
  const {
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
  } = useAppState();

  return (
    <div className="relative min-h-dvh bg-[#06070B] text-slate-50 flex flex-col">
      {/* Subtle Ambient Background Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/4 h-[420px] w-[420px] rounded-full bg-violet-700/12 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-[380px] w-[380px] rounded-full bg-blue-700/10 blur-[120px]" />
      </div>

      <TopBar activeTab={activeTab} onNavigate={setActiveTab} user={user} />

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 md:px-6 pt-5 md:pt-8 pb-24 md:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'home' && (
              <HomeView
                user={user}
                onSelectFeature={openCreateWithFeature}
                onUploadPhoto={openCreateWithUploadedPhoto}
                onNavigate={setActiveTab}
                onNotify={showToast}
              />
            )}

            {activeTab === 'create' && (
              <CreateView
                selectedFeature={selectedFeature}
                onSelectFeature={setSelectedFeature}
                selectedStyleId={selectedStyleId}
                onSelectStyleId={setSelectedStyleId}
                pendingUploadUrl={pendingUploadUrl}
                onClearPendingUpload={() => setPendingUploadUrl(null)}
                userCredits={user.credits}
                onConsumeCredit={consumeCredit}
                onSavePhoto={savePhoto}
                onNavigate={setActiveTab}
                onNotify={showToast}
              />
            )}

            {activeTab === 'gallery' && (
              <MyPhotosView
                photos={savedPhotos}
                onDelete={deletePhoto}
                onNavigate={setActiveTab}
                onNotify={showToast}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                user={user}
                transactions={transactions}
                savedCount={savedPhotos.length}
                onRegister={registerUser}
                onLogout={logoutUser}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'premium' && (
              <PremiumView
                user={user}
                onActivatePlan={addCredits}
                onNavigate={setActiveTab}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} onNavigate={setActiveTab} />
      <Toast message={toastMessage} onDismiss={clearToast} />
    </div>
  );
}
