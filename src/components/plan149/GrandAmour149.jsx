import React, { useState, useRef, useEffect } from "react";
import LoveBitesLogo from "../LoveBitesLogo";
import { trackEvent } from "../../lib/analytics";

/**
 * Grand Amour ₹149 Plan Component
 * Features 9 steps, inline styles, maroon & rose theme.
 */

const GrandAmour149 = ({ 
    onComplete, 
    features = { ai_magic: true },
    moods: externalMoods = [],
    occasions: externalOccasions = []
}) => {
  // --- THEME ---
  const THEME = {
    bg: "linear-gradient(160deg, #0d0008 0%, #1a0010 40%, #0d0005 100%)",
    maroon: "#9b1a3a",
    rose: "#c4304f",
    cream: "#fff8f0",
    serif: "Georgia, serif",
    sans: "sans-serif",
    orbTopRight: "radial-gradient(circle, rgba(155,26,58,0.2) 0%, transparent 70%)",
    orbBottomLeft: "radial-gradient(circle, rgba(196,48,79,0.15) 0%, transparent 70%)",
  };

  // --- STATE VARIABLES ---
  const [step, setStep] = useState(0);
  const [createFor, setCreateFor] = useState(null); // 'her' or 'him'
  const [selectedMoods, setSelectedMoods] = useState([]); // max 5
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [theirStory, setTheirStory] = useState("");
  const [photos, setPhotos] = useState(Array(10).fill(null));
  const [videoPhotos, setVideoPhotos] = useState(Array(5).fill(null));
  const [activePhotoSlot, setActivePhotoSlot] = useState(null);
  const [activeVideoSlot, setActiveVideoSlot] = useState(null);
  const [selectedFrame] = useState(0);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [musicTab, setMusicTab] = useState("playlist"); // "playlist" | "upload"
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [uploadedMusic, setUploadedMusic] = useState(null);
  const [destructMode, setDestructMode] = useState("1h");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [unlockCode, setUnlockCode] = useState(["", "", "", ""]);
  const codeRefs = [useRef(), useRef(), useRef(), useRef()];
  const [hintMessage, setHintMessage] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState(null);
  const [recipientContact, setRecipientContact] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifOpen, setNotifOpen] = useState(true);
  const [notifView, setNotifView] = useState(true);
  const [notifReply, setNotifReply] = useState(true);
  const [activeTab, setActiveTab] = useState("Romantic");
  const [previewImage, setPreviewImage] = useState(null);

  const [hoveredBtn, setHoveredBtn] = useState(null);

  const photoRef = useRef(null);
  const videoPhotoRef = useRef(null);
  const musicRef = useRef(null);

  // --- DATA ---
  const moodsData = externalMoods.length > 0 ? externalMoods : [
    { id: "deeply_in_love", label: "Deeply in Love", subtitle: "I feel completely in love with you", emoji: "❤️", category: "Romantic" },
    { id: "adoring", label: "Adoring", subtitle: "I adore everything about you", emoji: "🥰", category: "Romantic" },
    { id: "affectionate", label: "Affectionate", subtitle: "I feel warm and affectionate toward you", emoji: "💞", category: "Romantic" },
    { id: "hopelessly_romantic", label: "Hopelessly Romantic", subtitle: "You make me believe in love stories", emoji: "💘", category: "Romantic" },
    { id: "cherishing", label: "Cherishing", subtitle: "I cherish every moment with you", emoji: "🌹", category: "Romantic" },
    { id: "obsessed", label: "Obsessed with You", subtitle: "I can't get enough of you", emoji: "😍", category: "Romantic" },
    { id: "grateful", label: "Grateful", subtitle: "I'm thankful to have you in my life", emoji: "💓", category: "Emotional" },
    { id: "tender", label: "Tender Hearted", subtitle: "You soften my world", emoji: "🥺", category: "Emotional" },
    { id: "vulnerable", label: "Vulnerable", subtitle: "I can be myself with you", emoji: "🩹", category: "Emotional" },
    { id: "playful", label: "Playful Love", subtitle: "Loving you is fun and exciting", emoji: "😘", category: "Fun" },
    { id: "happy", label: "Happy with You", subtitle: "You make my life joyful", emoji: "😄", category: "Fun" },
    { id: "silly", label: "Silly & Wild", subtitle: "We are weird together", emoji: "🤪", category: "Fun" },
    { id: "devoted", label: "Devoted", subtitle: "My heart belongs to you", emoji: "💗", category: "Deep" },
    { id: "comforted", label: "Comforted", subtitle: "You make me feel safe and calm", emoji: "🤍", category: "Deep" },
    { id: "forever", label: "Forever Yours", subtitle: "I want a lifetime with you", emoji: "💍", category: "Deep" },
    { id: "soulmate", label: "Soulmate Feeling", subtitle: "You feel like my other half", emoji: "🌙", category: "Deep" },
    { id: "passionate", label: "Passionate", subtitle: "My love for you burns intensely", emoji: "🔥", category: "Deep" },
    { id: "birthday", label: "Birthday Love", subtitle: "Celebrating you today", emoji: "🎂", category: "Occasion" },
    { id: "proposal", label: "Proposal Mood", subtitle: "Ready to ask you forever", emoji: "💍", category: "Occasion" },
    { id: "missing", label: "Missing You", subtitle: "I wish you were here", emoji: "💌", category: "Occasion" },
    { id: "celebrating", label: "Celebrating Us", subtitle: "Celebrating our love", emoji: "🎉", category: "Occasion" },
    { id: "anniversary_occ", label: "Anniversary", subtitle: "Another year of us", emoji: "🥂", category: "Occasion" },
  ];

  const occasions = externalOccasions.length > 0 ? externalOccasions : [
    { id: "anniversary", label: "Anniversary", emoji: "💑" },
    { id: "birthday", label: "Birthday", emoji: "🎂" },
    { id: "valentine", label: "Valentine's Day", emoji: "💝" },
    { id: "just_because", label: "Just Because", emoji: "🌸" },
    { id: "proposal", label: "Proposal", emoji: "💍" },
    { id: "long_distance", label: "Long Distance", emoji: "✈️" },
  ];

  const tracks = [
    { id: 1, title: "River Flows in You", artist: "Yiruma", mood: "Calm & Tender 🤍", duration: "3:42" },
    { id: 2, title: "Perfect", artist: "Ed Sheeran", mood: "Romantic 💕", duration: "4:23" },
    { id: 3, title: "A Thousand Years", artist: "Christina Perri", mood: "Deeply in Love ❤️", duration: "4:45" },
    { id: 4, title: "Comptine d'un autre été", artist: "Yann Tiersen", mood: "Nostalgic 🌙", duration: "2:31" },
    { id: 5, title: "All of Me", artist: "John Legend", mood: "Devoted 💗", duration: "4:29" },
    { id: 6, title: "Turning Page", artist: "Sleeping At Last", mood: "Soulmate 🌙", duration: "4:10" },
  ];

  const destructOptions = [
    { id: "1h", icon: "⏰", title: "Expires in 1 Hour", desc: "The link dies exactly 1 hour after it's first opened", tag: "Quick" },
    { id: "burn", icon: "🔥", title: "Burn After Reading", desc: "Vanishes the moment they close it — read once, gone forever", tag: "Most Dramatic" },
    { id: "12h", icon: "⏳", title: "Expires in 12 Hours", desc: "The link dies exactly 12 hours after it's first opened", tag: "Time-Limited" },
    { id: "24h", icon: "📅", title: "Expires in 24 Hours", desc: "A full day to open and cherish — then it's gone", tag: "Extended" },
  ];

  const frames = [
    { id: "classic", label: "Classic Maroon", border: THEME.maroon, shadow: `0 0 15px ${THEME.maroon}` },
    { id: "gold", label: "Golden Glimmer", border: "#d4af37", shadow: "0 0 15px rgba(212,175,55,0.4)" },
    { id: "floral", label: "Rose Petal", border: "#c4304f", shadow: "0 0 15px rgba(196,48,79,0.4)" },
    { id: "glass", label: "Frosted Glass", border: "rgba(255,255,255,0.3)", shadow: "0 0 10px rgba(255,255,255,0.1)" },
    { id: "royal", label: "Royal Velvet", border: "#4a0404", shadow: "0 0 20px rgba(74,4,4,0.6)" },
  ];

  // --- HELPERS ---
  const canProceed = () => {
    if (step === 0) return createFor !== null;
    if (step === 1) return selectedMoods.length > 0;
    if (step === 2) return selectedOccasion !== null;
    if (step === 3) return theirStory.trim().length > 10;
    if (step === 4) return photos.some(p => p !== null);
    if (step === 5) return true; // video skippable
    if (step === 6) return true; // music optional
    if (step === 7) return destructMode !== null;
    if (step === 8) return generatedMessage.length > 0;
    if (step === 9) return unlockCode.every(c => c !== "") && deliveryMethod !== null && notifyEmail.length > 0;
    return true;
  };

  const handleCodeChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...unlockCode];
    next[i] = val;
    setUnlockCode(next);
    if (val && i < 3) codeRefs[i + 1].current.focus();
  };

  const handleCodeKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !unlockCode[i] && i > 0) {
      codeRefs[i - 1].current.focus();
    }
  };

  const handleNext = () => {
    if (step === 9 && canProceed()) {
      if (onComplete) {
        onComplete({
          createFor,
          step, 
          selectedMoods: selectedMoods.map(id => moodsData.find(m => m.id === id) || { id, label: id, emoji: "❤️" }), 
          selectedOccasion: occasions.find(o => o.id === selectedOccasion) || { id: "anniversary", label: "Anniversary", emoji: "💑" },
          yourName, partnerName, theirStory,
          photos, videoPhotos, selectedFrame, musicEnabled, musicTab, selectedTrack,
          uploadedMusic, destructMode, generatedMessage, unlockCode: unlockCode.join(""), hintMessage,
          deliveryMethod, recipientContact, deliveryDate, deliveryTime, notifyEmail,
          notifOpen, notifView, notifReply
        });
      }
      return;
    }
    if (canProceed()) setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => Math.max(0, s - 1));

  const toggleMood = (moodId) => {
    if (selectedMoods.includes(moodId)) {
      setSelectedMoods(selectedMoods.filter(id => id !== moodId));
    } else if (selectedMoods.length < 5) {
      setSelectedMoods([...selectedMoods, moodId]);
    }
  };

  const handleFileUpload = (index, type) => {
    if (type === 'photo') {
      setActivePhotoSlot(index);
      photoRef.current.click();
    } else {
      setActiveVideoSlot(index);
      videoPhotoRef.current.click();
    }
  };

  const handleFileChange = async (e, type) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (type === 'music') {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedMusic({ name: file.name, url: event.target.result });
      };
      reader.readAsDataURL(file);
      return;
    }

    const processFiles = async (fileList, currentList, setList, maxSlots, activeSlot) => {
      const newList = [...currentList];
      let filesToProcess = fileList;
      
      // Calculate how many slots are actually available total
      const emptySlotsCount = newList.filter(p => p === null).length;
      if (emptySlotsCount === 0 && newList[activeSlot] !== null) return; // No room at all unless overwriting active

      const fileDataPromises = filesToProcess.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      });

      const results = await Promise.all(fileDataPromises);
      
      let resultIdx = 0;
      // First, try to fill from the active slot
      if (newList[activeSlot] === null) {
        newList[activeSlot] = results[resultIdx++];
      } else {
        // If active slot is full, we overwrite it with the FIRST file selected
        newList[activeSlot] = results[resultIdx++];
      }

      // Then fill remaining available slots
      for (let i = 0; i < maxSlots && resultIdx < results.length; i++) {
        if (newList[i] === null) {
          newList[i] = results[resultIdx++];
        }
      }
      setList(newList);
    };

    if (type === 'photo') {
      await processFiles(files, photos, setPhotos, 10, activePhotoSlot);
    } else if (type === 'video') {
      await processFiles(files, videoPhotos, setVideoPhotos, 5, activeVideoSlot);
    }

    // Reset input
    e.target.value = "";
  };

  const removeFile = (index, type) => {
    if (type === 'photo') {
      const newPhotos = [...photos];
      newPhotos[index] = null;
      setPhotos(newPhotos);
    } else if (type === 'video') {
      const newVideoPhotos = [...videoPhotos];
      newVideoPhotos[index] = null;
      setVideoPhotos(newVideoPhotos);
    } else if (type === 'music') {
      setUploadedMusic(null);
    }
  };

  const generateAI = async () => {
    setIsGenerating(true);
    const moodLabels = selectedMoods.map(id => moodsData.find(m => m.id === id)?.label).join(", ");
    const occasionLabel = occasions.find(o => o.id === selectedOccasion)?.label;
    
    try {
      const response = await fetch("/api/generate-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moods: selectedMoods.map(id => moodsData.find(m => m.id === id)?.label),
          occasion: occasionLabel,
          yourName,
          partnerName,
          partnerDesc: theirStory
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
         throw new Error(data.details || data.error);
      }
      
      if (data.message) {
        setGeneratedMessage(data.message);
        trackEvent('ai_generate', { tier: '149' }, '149');
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error) {
      console.error("AI Error:", error);
      setGeneratedMessage("My love, words often fall short of the depth I feel for you. You are the light in my quietest moments and the joy in my loudest laughs. Being with you feels like finally coming home. Forever isn't enough, but it's a start.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- STYLES ---
  const styles = {
    wrapper: {
      minHeight: "100vh",
      background: THEME.bg,
      color: THEME.cream,
      fontFamily: THEME.sans,
      position: "relative",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      overflowX: "hidden",
    },
    orbTop: {
      position: "fixed", top: 0, right: 0, width: "300px", height: "300px",
      background: THEME.orbTopRight, pointerEvents: "none", zIndex: 0
    },
    orbBottom: {
      position: "fixed", bottom: 0, left: 0, width: "300px", height: "300px",
      background: THEME.orbBottomLeft, pointerEvents: "none", zIndex: 0
    },
    container: {
      width: "100%", maxWidth: "800px", zIndex: 1, display: "flex", flexDirection: "column",
    },
    header: {
      display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", width: "100%"
    },
    logo: {
      fontFamily: THEME.serif, fontStyle: "italic", fontSize: "24px", color: THEME.rose, fontWeight: "bold", cursor: "pointer"
    },
    pill: {
      background: "linear-gradient(135deg, #9b1a3a, #c4304f)", padding: "6px 16px", borderRadius: "20px",
      fontSize: "12px", fontWeight: "bold", letterSpacing: "1px", color: "white", boxShadow: "0 4px 15px rgba(155,26,58,0.3)"
    },
    progressBox: {
      marginBottom: "40px", width: "100%"
    },
    progressGrid: {
      display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: "6px", marginBottom: "8px"
    },
    stepBar: (idx) => ({
      height: "4px", borderRadius: "2px",
      background: idx <= step ? "linear-gradient(90deg, #9b1a3a, #c4304f)" : "rgba(255,255,255,0.1)",
      transition: "all 0.5s ease"
    }),
    stepCounter: {
      textAlign: "right", fontSize: "12px", color: "rgba(255,248,240,0.5)", textTransform: "uppercase", letterSpacing: "1px"
    },
    main: {
      flex: 1, paddingBottom: "100px"
    },
    stepHeader: {
      textAlign: "center", marginBottom: "32px"
    },
    stepTag: {
      color: THEME.rose, letterSpacing: "3px", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px"
    },
    heading: {
      fontFamily: THEME.serif, fontSize: "clamp(24px, 5vw, 40px)", margin: "0 0 8px"
    },
    subheading: {
      color: "rgba(255,248,240,0.5)", fontSize: "16px"
    },
    footer: {
      position: "fixed", bottom: 0, left: 0, width: "100%", padding: "20px",
      display: "flex", justifyContent: "center", pointerEvents: "none"
    },
    navInner: {
      width: "100%", maxWidth: "800px", display: "flex", justifyContent: "space-between", pointerEvents: "auto"
    },
    btnBack: {
      padding: "14px 28px", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.1)",
      background: "rgba(13,0,8,0.5)", color: "rgba(255,255,255,0.6)", cursor: "pointer", transition: "0.2s"
    },
    btnNext: (isEnabled) => ({
      padding: "14px 40px", borderRadius: "30px", border: "none",
      background: isEnabled ? "linear-gradient(135deg, #9b1a3a, #c4304f)" : "rgba(255,255,255,0.05)",
      color: isEnabled ? "white" : "rgba(255,255,255,0.2)",
      cursor: isEnabled ? "pointer" : "not-allowed",
      fontWeight: "bold", fontSize: "16px",
      boxShadow: isEnabled ? "0 8px 30px rgba(155,26,58,0.5)" : "none",
      transition: "0.3s"
    })
  };

  return (
    <div style={styles.wrapper}>
      {/* Global Animations Style Tag */}
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        button:hover { filter: brightness(1.08); }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(155,26,58,0.3); border-radius: 2px; }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(0.8); cursor: pointer; }
        @media (max-width: 768px) {
          .lb149-side-text { display: none !important; }
          .lb149-container { max-width: 100% !important; padding: 0 12px !important; }
          .lb149-progress { gap: 4px !important; }
          .lb149-footer { padding: 14px !important; }
          .lb149-btn-next, .lb149-btn-back { padding: 12px 20px !important; font-size: 0.88rem !important; }
        }
        @media (max-width: 480px) {
          .lb149-container { padding: 0 8px !important; }
          .lb149-btn-next, .lb149-btn-back { padding: 10px 14px !important; font-size: 0.8rem !important; }
        }
      `}</style>

      <div style={styles.orbTop} />
      <div style={styles.orbBottom} />

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
            background: "rgba(0,0,0,0.9)", zIndex: 9999, display: "flex", 
            alignItems: "center", justifyContent: "center", padding: "20px",
            backdropFilter: "blur(10px)", animation: "fadeIn 0.3s ease"
          }}
        >
          <div 
            style={{
              position: "absolute", top: "30px", right: "30px", 
              background: "rgba(255,255,255,0.1)", borderRadius: "50%", 
              width: "44px", height: "44px", display: "flex", alignItems: "center", 
              justifyContent: "center", color: "white", fontSize: "24px", cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(5px)"
            }}
            onClick={() => setPreviewImage(null)}
          >
            ✕
          </div>
          <img 
            src={previewImage} 
            alt="Preview" 
            style={{ 
              maxWidth: "95vw", maxHeight: "85vh", borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", objectFit: "contain",
              border: "1px solid rgba(255,255,255,0.1)"
            }} 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      <div style={styles.container}>
        {/* HEADER */}
        <header style={styles.header}>
          <div style={styles.logo} onClick={() => window.location.href = "/"}>
            <LoveBitesLogo size={24} />
          </div>
          <div style={styles.pill}>GRAND AMOUR ₹149</div>
        </header>

        {/* PROGRESS BAR */}
        <div style={styles.progressBox}>
          <div style={styles.progressGrid}>
            {Array(10).fill(0).map((_, i) => (
              <div key={i} style={styles.stepBar(i)} />
            ))}
          </div>
          <div style={styles.stepCounter}>{step + 1} of 10 steps</div>
        </div>

        {/* MAIN STEPS */}
        <main style={styles.main}>
          
          {/* STEP 0: CREATE FOR */}
          {step === 0 && (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepTag}>Beginning</div>
                <h1 style={styles.heading}>Who are you <i style={{ color: THEME.rose }}>creating this for?</i></h1>
                <p style={styles.subheading}>Let's personalize the experience</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "340px", margin: "0 auto" }}>
                {[
                  { id: 'her', label: 'Create for Her' },
                  { id: 'him', label: 'Create for Him' }
                ].map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => setCreateFor(opt.id)}
                    style={{
                      padding: "20px 24px", borderRadius: "16px", textAlign: "center", cursor: "pointer", transition: "0.3s",
                      border: createFor === opt.id ? `2px solid ${THEME.rose}` : "1px solid rgba(255,255,255,0.1)",
                      background: createFor === opt.id ? "rgba(155,26,58,0.2)" : "rgba(255,255,255,0.03)",
                      transform: createFor === opt.id ? "translateY(-2px)" : "translateY(0)",
                      boxShadow: createFor === opt.id ? `0 8px 24px rgba(155,26,58,0.3)` : "none"
                    }}
                  >
                    <div style={{ 
                      fontWeight: "bold", fontSize: "16px", letterSpacing: "0.5px",
                      fontFamily: THEME.sans,
                      color: createFor === opt.id ? "white" : "rgba(255,255,255,0.8)" 
                    }}>{opt.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: MOOD */}
          {step === 1 && (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepTag}>Step One</div>
                <h1 style={styles.heading}>How does your heart feel?</h1>
                <p style={styles.subheading}>Select up to 5 moods that capture your feelings</p>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: "8px", overflowX: "auto", marginBottom: "24px", paddingBottom: "8px" }}>
                {["Romantic", "Emotional", "Fun", "Deep"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "10px 20px", borderRadius: "20px", whiteSpace: "nowrap",
                      border: activeTab === tab ? `1px solid ${THEME.rose}` : "1px solid rgba(255,255,255,0.1)",
                      background: activeTab === tab ? "rgba(155,26,58,0.2)" : "transparent",
                      color: activeTab === tab ? THEME.rose : "rgba(255,255,255,0.4)",
                      cursor: "pointer", transition: "0.2s"
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
                {moodsData.filter(m => m.category === activeTab).map(mood => {
                  const isSelected = selectedMoods.includes(mood.id);
                  return (
                    <button
                      key={mood.id}
                      onClick={() => toggleMood(mood.id)}
                      style={{
                        padding: "20px", borderRadius: "16px", textAlign: "left", cursor: "pointer",
                        border: isSelected ? `1px solid ${THEME.rose}` : "1px solid rgba(255,255,255,0.05)",
                        background: isSelected ? "rgba(155,26,58,0.15)" : "rgba(255,255,255,0.03)",
                        transition: "0.2s", display: "flex", flexDirection: "column", gap: "4px"
                      }}
                    >
                      <span style={{ fontSize: "24px" }}>{mood.emoji}</span>
                      <span style={{ fontWeight: "bold", color: isSelected ? THEME.rose : "white" }}>{mood.label}</span>
                      <span style={{ fontSize: "11px", color: "rgba(255,248,240,0.4)" }}>{mood.subtitle}</span>
                    </button>
                  );
                })}
              </div>

              {/* Chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "32px", minHeight: "40px" }}>
                {selectedMoods.map(id => {
                  const mood = moodsData.find(m => m.id === id);
                  return (
                    <div key={id} style={{
                      padding: "6px 14px", borderRadius: "20px", background: THEME.maroon, color: "white",
                      fontSize: "12px", display: "flex", alignItems: "center", gap: "6px"
                    }}>
                      {mood.emoji} {mood.label} 
                      <span onClick={() => toggleMood(id)} style={{ cursor: "pointer", opacity: 0.6 }}>✕</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: OCCASION */}
          {step === 2 && (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepTag}>Step Two</div>
                <h1 style={styles.heading}>What's the occasion?</h1>
                <p style={styles.subheading}>This helps us curate the frames and video style</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                {occasions.map(occ => {
                  const isSelected = selectedOccasion === occ.id;
                  return (
                    <button
                      key={occ.id}
                      onClick={() => setSelectedOccasion(occ.id)}
                      style={{
                        padding: "32px", borderRadius: "20px", textAlign: "center", cursor: "pointer",
                        border: isSelected ? `1px solid ${THEME.rose}` : "1px solid rgba(255,255,255,0.05)",
                        background: isSelected ? "rgba(155,26,58,0.2)" : "rgba(255,255,255,0.03)",
                        transition: "0.2s"
                      }}
                    >
                      <div style={{ fontSize: "40px", marginBottom: "12px" }}>{occ.emoji}</div>
                      <div style={{ 
                        fontWeight: isSelected ? "600" : "500", 
                        fontSize: "16px",
                        color: isSelected ? "#fff8f0" : "rgba(255,248,240,0.7)"
                      }}>
                        {occ.label}
                      </div>
                      {isSelected && <div style={{ fontSize: "18px", marginTop: "8px" }}>💗</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: STORY */}
          {step === 3 && (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepTag}>Step Three</div>
                <h1 style={styles.heading}>Tell us your story</h1>
                <p style={styles.subheading}>The more we know, the better the AI message</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,248,240,0.4)", marginBottom: "8px", display: "block" }}>Your Name</label>
                    <input 
                      type="text" value={yourName} onChange={(e) => setYourName(e.target.value)}
                      placeholder="Ayden"
                      style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "16px", color: "white", outline: "none" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,248,240,0.4)", marginBottom: "8px", display: "block" }}>Partner's Name</label>
                    <input 
                      type="text" value={partnerName} onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="Sarah"
                      style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "16px", color: "white", outline: "none" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,248,240,0.4)", marginBottom: "8px", display: "block" }}>A favorite memory or description</label>
                  <textarea 
                    value={theirStory} onChange={(e) => setTheirStory(e.target.value)}
                    placeholder="We first met at the little bookstore on 5th street. She was holding a copy of Pride and Prejudice..."
                    style={{ width: "100%", height: "160px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "16px", color: "white", outline: "none", resize: "none", fontFamily: THEME.serif }}
                  />
                  <div style={{ textAlign: "right", fontSize: "11px", color: "rgba(255,248,240,0.3)", marginTop: "4px" }}>Min 10 characters</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PHOTOS */}
          {step === 4 && (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepTag}>Step Four</div>
                <h1 style={styles.heading}>Your precious memories</h1>
                <p style={styles.subheading}>Upload up to 10 photos — more moments, more love</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gridTemplateRows: "repeat(2, 1fr)", gap: "10px", marginBottom: "20px" }}>
                {photos.map((photo, i) => (
                  <div 
                    key={i} 
                    onClick={() => photo ? setPreviewImage(photo) : handleFileUpload(i, 'photo')}
                    style={{ 
                      aspectRatio: "1/1", borderRadius: "12px", background: photo ? "none" : "rgba(255,255,255,0.03)",
                      border: photo ? `2px solid ${frames[i % 5].border}` : "1px dashed rgba(255,255,255,0.1)",
                      cursor: "pointer", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: photo ? frames[i % 5].shadow : "none"
                    }}
                  >
                    {photo ? (
                      <>
                        <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div onClick={(e) => { e.stopPropagation(); removeFile(i, 'photo'); }} style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.5)", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px" }}>✕</div>
                      </>
                    ) : (
                      <span style={{ fontSize: "20px", opacity: 0.2 }}>+</span>
                    )}
                  </div>
                ))}
              </div>
              <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,248,240,0.3)", fontStyle: "italic" }}>
                * Frames are automatically curated based on your mood & occasion
              </p>
              <input type="file" ref={photoRef} onChange={(e) => handleFileChange(e, 'photo')} style={{ display: "none" }} accept="image/*" multiple />
            </div>
          )}

          {/* STEP 5: VIDEO */}
          {step === 5 && (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepTag}>Step Five</div>
                <h1 style={styles.heading}>Cinematic Tribute</h1>
                <p style={styles.subheading}>Upload 5 specific clips or photos for your video</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", marginBottom: "32px" }}>
                {videoPhotos.map((photo, i) => (
                  <div 
                    key={i} 
                    onClick={() => photo ? setPreviewImage(photo) : handleFileUpload(i, 'video')}
                    style={{ 
                      aspectRatio: "1/1", borderRadius: "12px", background: photo ? "none" : "rgba(255,255,255,0.03)",
                      border: "1px dashed rgba(255,255,255,0.1)",
                      cursor: "pointer", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"
                    }}
                  >
                    {photo ? (
                      <>
                        <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div onClick={(e) => { e.stopPropagation(); removeFile(i, 'video'); }} style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.5)", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px" }}>✕</div>
                      </>
                    ) : (
                      <span style={{ fontSize: "20px", opacity: 0.2 }}>🎬</span>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(155,26,58,0.06)", border: "1px solid rgba(155,26,58,0.15)", borderRadius: "16px", padding: "24px", display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{ fontSize: "32px" }}>🎬</div>
                <div>
                  <h4 style={{ margin: "0 0 4px", color: THEME.rose }}>Your video is in good hands</h4>
                  <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,248,240,0.5)", lineHeight: "1.5" }}>Our team crafts it based on your mood & occasion to ensure it's absolutely perfect.</p>
                </div>
              </div>
              <input type="file" ref={videoPhotoRef} onChange={(e) => handleFileChange(e, 'video')} style={{ display: "none" }} accept="image/*,video/*" multiple />
            </div>
          )}

          {/* STEP 6: BACKGROUND MUSIC */}
          {step === 6 && (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepTag}>Step Six</div>
                <h1 style={styles.heading}>Set the mood with music</h1>
                <p style={styles.subheading}>Choose a track that plays when they open your Love Code</p>
              </div>

              <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
                <div onClick={() => setMusicEnabled(!musicEnabled)} style={{ 
                  width: "60px", height: "30px", background: musicEnabled ? THEME.rose : "rgba(255,255,255,0.1)", 
                  borderRadius: "15px", position: "relative", cursor: "pointer", transition: "0.3s"
                }}>
                  <div style={{ 
                    width: "24px", height: "24px", background: "white", borderRadius: "50%", 
                    position: "absolute", top: "3px", left: musicEnabled ? "33px" : "3px", transition: "0.3s"
                  }} />
                </div>
                <span style={{ marginLeft: "12px", fontSize: "14px", color: musicEnabled ? "white" : "rgba(255,255,255,0.4)" }}>Add background music</span>
              </div>

              <div style={{ opacity: musicEnabled ? 1 : 0.3, pointerEvents: musicEnabled ? "auto" : "none", transition: "0.3s" }}>
                <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", borderRadius: "12px", overflow: "hidden", marginBottom: "24px" }}>
                  <button onClick={() => setMusicTab("playlist")} style={{ flex: 1, padding: "14px", border: "none", background: musicTab === "playlist" ? "rgba(155,26,58,0.2)" : "transparent", color: musicTab === "playlist" ? THEME.rose : "white", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}>Our Playlist</button>
                  <button onClick={() => setMusicTab("upload")} style={{ flex: 1, padding: "14px", border: "none", background: musicTab === "upload" ? "rgba(155,26,58,0.2)" : "transparent", color: musicTab === "upload" ? THEME.rose : "white", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}>Upload My Own</button>
                </div>

                {musicTab === "playlist" ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {tracks.map(track => {
                      const isSelected = selectedTrack === track.id;
                      return (
                        <div 
                          key={track.id} 
                          onClick={() => setSelectedTrack(track.id)}
                          style={{ 
                            padding: "16px", borderRadius: "14px", background: isSelected ? "rgba(155,26,58,0.18)" : "rgba(155,26,58,0.08)",
                            border: isSelected ? "1px solid rgba(196,48,79,0.6)" : "1px solid rgba(155,26,58,0.2)",
                            cursor: "pointer", position: "relative"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
                            <span style={{ fontSize: "20px" }}>🎵</span>
                            <span style={{ fontSize: "11px", opacity: 0.5 }}>{track.duration}</span>
                          </div>
                          <div style={{ fontWeight: "bold", fontSize: "14px", color: isSelected ? THEME.rose : "white" }}>{track.title}</div>
                          <div style={{ fontSize: "12px", opacity: 0.5, marginBottom: "8px" }}>{track.artist}</div>
                          <div style={{ fontSize: "10px", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "10px", display: "inline-block", color: THEME.rose }}>{track.mood}</div>
                          <button style={{ position: "absolute", bottom: "16px", right: "16px", background: "none", border: "none", color: THEME.rose, fontSize: "12px", cursor: "pointer" }}>▶</button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div 
                    onClick={() => musicRef.current.click()}
                    style={{ border: "2px dashed rgba(255,255,255,0.1)", borderRadius: "16px", padding: "40px", textAlign: "center", cursor: "pointer" }}
                  >
                    <div style={{ fontSize: "32px", marginBottom: "12px" }}>🎵</div>
                    {uploadedMusic ? (
                      <div>
                        <div style={{ fontWeight: "bold", color: THEME.rose }}>{uploadedMusic.name} ✓</div>
                        <div onClick={(e) => { e.stopPropagation(); removeFile(null, 'music'); }} style={{ marginTop: "12px", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Remove file</div>
                      </div>
                    ) : (
                      <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>Upload MP3 or M4A (max 10MB)</div>
                    )}
                  </div>
                )}
              </div>
              <input type="file" ref={musicRef} onChange={(e) => handleFileChange(e, 'music')} style={{ display: "none" }} accept="audio/*" />
            </div>
          )}

          {/* STEP 7: SELF-DESTRUCT */}
          {step === 7 && (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepTag}>Step Seven</div>
                <h1 style={styles.heading}>How long should this last?</h1>
                <p style={styles.subheading}>Choose the lifetime of your Love Code</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {destructOptions.map(opt => {
                  const isSelected = destructMode === opt.id;
                  const isBurn = opt.id === "burn";
                  return (
                    <div 
                      key={opt.id} 
                      onClick={() => setDestructMode(opt.id)}
                      style={{ 
                        padding: "24px", borderRadius: "16px", cursor: "pointer", position: "relative",
                        background: isSelected ? "rgba(155,26,58,0.2)" : "rgba(155,26,58,0.06)",
                        border: isSelected ? "1px solid rgba(196,48,79,0.6)" : "1px solid rgba(155,26,58,0.15)",
                        transition: "0.2s", transform: isSelected ? "scale(1.02)" : "scale(1)",
                        display: "flex", flexDirection: "column", gap: "12px"
                      }}
                    >
                      <div style={{ position: "absolute", top: "12px", right: "12px", fontSize: "10px", background: "rgba(155,26,58,0.3)", padding: "2px 8px", borderRadius: "10px", color: THEME.rose, fontWeight: "bold" }}>{opt.tag}</div>
                      <div style={{ fontSize: "40px" }}>{opt.icon}</div>
                      <div>
                        <div style={{ fontWeight: "bold", fontSize: "15px", color: THEME.cream }}>{opt.title}</div>
                        <div style={{ fontSize: "12px", color: "rgba(255,248,240,0.5)", marginTop: "4px", lineHeight: "1.4" }}>{opt.desc}</div>
                        {isBurn && (
                          <div style={{ color: "rgba(255,120,80,0.6)", fontSize: "11px", fontStyle: "italic", marginTop: "8px" }}>
                            ⚠️ {isSelected ? "This cannot be undone. Once they close it, it's gone." : "Vanish on close."}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 8: AI MESSAGE */}
          {step === 8 && (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepTag}>Step Eight</div>
                <h1 style={styles.heading}>Your Love Message</h1>
                <p style={styles.subheading}>Crafted by AI, inspired by your heart</p>
              </div>

              {generatedMessage ? (
                <div style={{ position: "relative", background: "rgba(233, 69, 96, 0.05)", border: "1px solid rgba(233, 69, 96, 0.2)", padding: "40px", borderRadius: "32px" }}>
                  <div style={{ position: "absolute", top: "10px", left: "20px", fontSize: "60px", color: "rgba(155,26,58,0.1)", fontFamily: THEME.serif }}>“</div>
                  <textarea 
                    value={generatedMessage} onChange={(e) => setGeneratedMessage(e.target.value)}
                    style={{ width: "100%", minHeight: "300px", background: "transparent", border: "none", color: "white", fontSize: "17px", lineHeight: "1.8", fontFamily: THEME.serif, outline: "none", resize: "none" }}
                  />
                  <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                    <button onClick={generateAI} style={{ padding: "10px 20px", borderRadius: "20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}>Regenerate</button>
                    <div style={{ flex: 1 }} />
                    <span style={{ fontSize: "11px", color: "rgba(255,248,240,0.3)", alignSelf: "center" }}>You can edit this message directly</span>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "60px" }}>
                   {isGenerating ? (
                     <div>
                       <div style={{ width: "40px", height: "40px", border: `3px solid ${THEME.maroon}`, borderTopColor: "white", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" }} />
                       <div style={{ color: THEME.rose, fontWeight: "bold" }}>Generating your message...</div>
                     </div>
                   ) : (
                    <>
                      {features.ai_magic ? (
                        <>
                          <button 
                            onClick={generateAI} 
                            style={{ padding: "20px 48px", borderRadius: "40px", background: "linear-gradient(135deg, #9b1a3a, #c4304f)", border: "none", color: "white", fontWeight: "bold", cursor: "pointer", fontSize: "18px", boxShadow: "0 8px 30px rgba(155,26,58,0.5)" }}
                          >
                            Generate AI Message ✨
                          </button>
                          <p style={{ marginTop: "24px", fontSize: "12px", color: "rgba(255,248,240,0.3)" }}>Powered by Groq LLAMA-3</p>
                        </>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '30px', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', border: '1px dashed rgba(255,107,138,0.3)', maxWidth: '400px', margin: '0 auto' }}>
                          <p style={{ color: '#ff6b8a', fontSize: '16px', marginBottom: '12px', fontWeight: 'bold' }}>✨ AI Magic is currently resting.</p>
                          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6' }}>The Grand Amour AI is offline for maintenance. Please pen your beautiful message manually.</p>
                          <button 
                            onClick={() => setGeneratedMessage("My Dearest, ")}
                            style={{ marginTop: '20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '10px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            Write Manually
                          </button>
                        </div>
                      )}
                    </>
                   )}
                </div>
              )}
            </div>
          )}

          {/* STEP 9: DELIVERY */}
          {step === 9 && (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepTag}>Step Nine</div>
                <h1 style={styles.heading}>How shall we deliver your love?</h1>
              </div>

              {/* Section 1: Unlock Code */}
              <div style={{ marginBottom: "40px" }}>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: THEME.rose, marginBottom: "12px", display: "block" }}>UNLOCK CODE</label>
                <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                   {unlockCode.map((num, i) => (
                     <input 
                      key={i}
                      ref={codeRefs[i]}
                      type="text" maxLength="1" value={num} 
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(i, e)}
                      placeholder="•"
                      style={{ width: "50px", height: "60px", textAlign: "center", background: "rgba(255,255,255,0.04)", border: num ? `1px solid ${THEME.rose}` : "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "20px", outline: "none", transition: "0.2s" }}
                     />
                   ))}
                   <div style={{ flex: 1, marginLeft: "12px" }}>
                     <input 
                      type="text" value={hintMessage} onChange={(e) => setHintMessage(e.target.value)}
                      placeholder="Hint for them: Our first anniversary..."
                      style={{ width: "100%", height: "60px", padding: "16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none" }}
                     />
                   </div>
                </div>
              </div>

              {/* Section 2: Method */}
              <div style={{ marginBottom: "40px" }}>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: THEME.rose, marginBottom: "16px", display: "block" }}>DELIVERY METHOD</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "16px" }}>
                  {["Email", "WhatsApp", "Instagram"].map(method => (
                    <button 
                      key={method}
                      onClick={() => setDeliveryMethod(method)}
                      style={{ 
                        padding: "16px", borderRadius: "16px", border: deliveryMethod === method ? `1px solid ${THEME.rose}` : "1px solid rgba(255,255,255,0.05)",
                        background: deliveryMethod === method ? "rgba(155,26,58,0.2)" : "rgba(255,255,255,0.03)", color: "white", cursor: "pointer"
                      }}
                    >
                      {method}
                    </button>
                  ))}
                </div>
                {deliveryMethod && (
                  <input 
                    type="text" value={recipientContact} onChange={(e) => setRecipientContact(e.target.value)}
                    placeholder={`Enter recipient's ${deliveryMethod}...`}
                    style={{ width: "100%", padding: "16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", outline: "none" }}
                  />
                )}
              </div>

              {/* Section 3: Date/Time */}
              <div style={{ marginBottom: "40px" }}>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: THEME.rose, marginBottom: "16px", display: "block" }}>DELIVERY DATE & TIME</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <input 
                    type="date" value={deliveryDate} 
                    onChange={(e) => setDeliveryDate(e.target.value)} 
                    onClick={(e) => e.target.showPicker()}
                    style={{ padding: "16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", outline: "none", cursor: "pointer" }} 
                  />
                  <input 
                    type="time" value={deliveryTime} 
                    onChange={(e) => setDeliveryTime(e.target.value)} 
                    onClick={(e) => e.target.showPicker()}
                    style={{ padding: "16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", outline: "none", cursor: "pointer" }} 
                  />
                </div>
              </div>

              {/* Section 4: Email Notifications */}
              <div style={{ marginBottom: "40px" }}>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: THEME.rose, marginBottom: "16px", display: "block" }}>EMAIL NOTIFICATIONS</label>
                <div style={{ background: "rgba(155,26,58,0.06)", border: "1px solid rgba(155,26,58,0.12)", borderRadius: "14px", padding: "20px" }}>
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                     <div>
                        <div style={{ fontSize: "13px", color: "white" }}>📬 Opening notification</div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>"When they open your Love Code"</div>
                     </div>
                     <div onClick={() => setNotifOpen(!notifOpen)} style={{ width: "40px", height: "20px", background: notifOpen ? THEME.rose : "rgba(255,255,255,0.1)", borderRadius: "10px", position: "relative", cursor: "pointer" }}>
                       <div style={{ width: "16px", height: "16px", background: "white", borderRadius: "50%", position: "absolute", top: "2px", left: notifOpen ? "22px" : "2px", transition: "0.2s" }} />
                     </div>
                   </div>
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                     <div>
                        <div style={{ fontSize: "13px", color: "white" }}>⏱ View time report</div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>"How long they spent with it"</div>
                     </div>
                     <div onClick={() => setNotifView(!notifView)} style={{ width: "40px", height: "20px", background: notifView ? THEME.rose : "rgba(255,255,255,0.1)", borderRadius: "10px", position: "relative", cursor: "pointer" }}>
                       <div style={{ width: "16px", height: "16px", background: "white", borderRadius: "50%", position: "absolute", top: "2px", left: notifView ? "22px" : "2px", transition: "0.2s" }} />
                     </div>
                   </div>
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                     <div>
                        <div style={{ fontSize: "13px", color: "white" }}>💌 Reply notifications</div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>"When they send you a reply"</div>
                     </div>
                     <div onClick={() => setNotifReply(!notifReply)} style={{ width: "40px", height: "20px", background: notifReply ? THEME.rose : "rgba(255,255,255,0.1)", borderRadius: "10px", position: "relative", cursor: "pointer" }}>
                       <div style={{ width: "16px", height: "16px", background: "white", borderRadius: "50%", position: "absolute", top: "2px", left: notifReply ? "22px" : "2px", transition: "0.2s" }} />
                     </div>
                   </div>
                   <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", pt: "16px" }}>
                     <label style={{ fontSize: "10px", color: "rgba(255,248,240,0.4)", display: "block", marginBottom: "8px" }}>WHERE SHOULD WE NOTIFY YOU?</label>
                     <input 
                      type="email" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)}
                      placeholder="ayden636363@gmail.com"
                      style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white", outline: "none" }}
                     />
                   </div>
                </div>
              </div>

              {/* Section 5: Warning */}
              {destructMode !== "forever" && (
                <div style={{ background: "rgba(255,80,50,0.06)", border: "1px solid rgba(255,80,50,0.2)", borderRadius: "12px", padding: "16px", color: "rgba(255,120,80,0.8)", fontSize: "13px", fontStyle: "italic", display: "flex", gap: "12px" }}>
                   <span>⚠️</span>
                   <span>
                      {destructMode === "burn" && "This Love Code will vanish after being read once."}
                      {destructMode === "1h" && "This Love Code expires 1 hour after first open."}
                      {destructMode === "12h" && "This Love Code expires 12 hours after first open."}
                      {destructMode === "24h" && "This Love Code expires 24 hours after first open."}
                   </span>
                </div>
              )}
            </div>
          )}

        </main>

        <footer style={styles.footer}>
          <div style={styles.navInner}>
            <button onClick={handleBack} style={{ ...styles.btnBack, visibility: step === 0 ? "hidden" : "visible" }}>← Back</button>
            <div style={{ flex: 1 }} />
            
            {/* Conditional Skip Label */}
            {(step === 5 || (step === 6 && !musicEnabled)) && (
              <button 
                onClick={handleNext} 
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", marginRight: "20px", fontWeight: "bold" }}
              >
                Skip →
              </button>
            )}

            <button 
              onClick={handleNext} 
              onMouseEnter={() => setHoveredBtn("next")}
              onMouseLeave={() => setHoveredBtn(null)}
              style={styles.btnNext(canProceed())}
            >
                {step === 9 ? "Review Grand Amour ₹149 💗" : "Continue Checkout →"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GrandAmour149;
