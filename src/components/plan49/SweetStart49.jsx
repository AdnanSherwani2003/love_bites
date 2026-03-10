import React, { useState, useRef, useEffect } from "react";

/**
 * Sweet Start ₹49 Plan Component
 * Features 5 steps, inline styles, maroon & rose theme.
 */

const SweetStart49 = ({ onComplete }) => {
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

  // --- DATA ---
  const MOODS = [
    { id: "deeply_in_love", emoji: "❤️", label: "Deeply in Love", sub: "I feel completely in love with you", cat: "Romantic" },
    { id: "adoring", emoji: "🥰", label: "Adoring", sub: "I adore everything about you", cat: "Romantic" },
    { id: "affectionate", emoji: "💞", label: "Affectionate", sub: "I feel warm and affectionate toward you", cat: "Romantic" },
    { id: "hopelessly_romantic", emoji: "💘", label: "Hopelessly Romantic", sub: "You make me believe in love stories", cat: "Romantic" },
    { id: "grateful", emoji: "💓", label: "Grateful", sub: "I'm thankful to have you in my life", cat: "Emotional" },
    { id: "cherishing", emoji: "🌹", label: "Cherishing", sub: "I cherish every moment with you", cat: "Emotional" },
    { id: "devoted", emoji: "💗", label: "Devoted", sub: "My heart belongs to you", cat: "Emotional" },
    { id: "comforted", emoji: "🤍", label: "Comforted", sub: "You make me feel safe and calm", cat: "Emotional" },
    { id: "obsessed", emoji: "😍", label: "Obsessed with You", sub: "I can't get enough of you", cat: "Fun" },
    { id: "playful", emoji: "😘", label: "Playful Love", sub: "Loving you is fun and exciting", cat: "Fun" },
    { id: "happy", emoji: "😄", label: "Happy with You", sub: "You make my life joyful", cat: "Fun" },
    { id: "forever_yours", emoji: "💍", label: "Forever Yours", sub: "I want a lifetime with you", cat: "Deep" },
    { id: "soulmate", emoji: "🌙", label: "Soulmate Feeling", sub: "You feel like my other half", cat: "Deep" },
    { id: "passionate", emoji: "🔥", label: "Passionate", sub: "My love for you burns intensely", cat: "Deep" },
    { id: "birthday_love", emoji: "🎂", label: "Birthday Love", sub: "Celebrating you today", cat: "Occasion" },
    { id: "proposal", emoji: "💍", label: "Proposal Mood", sub: "Ready to ask you forever", cat: "Occasion" },
    { id: "missing_you", emoji: "💌", label: "Missing You", sub: "I wish you were here", cat: "Occasion" },
    { id: "celebrating", emoji: "🎉", label: "Celebrating Us", sub: "Celebrating our love", cat: "Occasion" },
  ];

  const OCCASIONS = [
    { id: "anniversary", label: "Anniversary", emoji: "💑" },
    { id: "birthday", label: "Birthday", emoji: "🎂" },
    { id: "valentines", label: "Valentine's Day", emoji: "💝" },
    { id: "just_because", label: "Just Because", emoji: "🌸" },
    { id: "proposal", label: "Proposal", emoji: "💍" },
    { id: "long_distance", label: "Long Distance", emoji: "✈️" },
  ];


  // --- STATE ---
  const [step, setStep] = useState(0);
  const [selectedMood, setSelectedMood] = useState(null); // only 1 mood
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [theirStory, setTheirStory] = useState("");
  const [photos, setPhotos] = useState([null, null, null, null, null]);
  const [activePhotoSlot, setActivePhotoSlot] = useState(null);
  const [selectedFrame] = useState(0);
  const [unlockCode, setUnlockCode] = useState("");
  const [hintMessage, setHintMessage] = useState("");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state for editing message
  const [activeTab, setActiveTab] = useState("Romantic");
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const photoRef = useRef(null);

  // --- HELPERS ---
  const canProceed = () => {
    if (step === 0) return selectedMood !== null;
    if (step === 1) return selectedOccasion !== null;
    if (step === 2) return yourName.trim() && partnerName.trim() && theirStory.trim().length > 10;
    if (step === 3) return photos.some(p => p !== null);
    if (step === 4) return generatedMessage.length > 0;
    if (step === 5) return unlockCode.length === 4;
    return true;
  };

  const toggleMood = (id) => {
    setSelectedMood(prev => prev === id ? null : id);
  };

  const handleNext = () => {
    if (step === 5 && canProceed()) {
      if (onComplete) {
        onComplete({
          selectedMood, selectedOccasion, yourName, partnerName, theirStory,
          photos, selectedFrame, unlockCode, hintMessage,
          generatedMessage
        });
      }
      return;
    }
    if (canProceed()) setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => Math.max(0, s - 1));

  const handleFileUpload = (index) => {
    setActivePhotoSlot(index);
    photoRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const newPhotos = [...photos];
      newPhotos[activePhotoSlot] = event.target.result;
      setPhotos(newPhotos);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  const generateMessage = async () => {
    setIsGenerating(true);
    const moodLabel = MOODS.find(m => m.id === selectedMood)?.label;
    const occasionLabel = OCCASIONS.find(o => o.id === selectedOccasion)?.label;
    
    const prompt = `You are a romantic message writer for LoveBites Sweet Start plan.
Write a short, sweet, heartfelt love message (2-3 paragraphs).
From: ${yourName}
To: ${partnerName}
Mood: ${moodLabel}
Occasion: ${occasionLabel}
Their story: ${theirStory}
Keep it simple, genuine, warm. Not too long. Sign from ${yourName}.`;

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 400,
          temperature: 0.9
        })
      });
      
      const data = await res.json();
      
      if (data.error) {
         throw new Error(data.error.message || "Unknown API error");
      }
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        setGeneratedMessage(data.choices[0].message.content);
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (e) {
      console.error("AI Error:", e);
      setGeneratedMessage("My love, every moment with you is a gift. Even a simple Sweet Start doesn't fully capture how much you mean to me, but I hope this brings a smile to your face today. You are my everything.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- STYLES ---
  const styles = {
    wrapper: {
      minHeight: "100vh", background: THEME.bg, color: THEME.cream,
      fontFamily: THEME.sans, position: "relative", padding: "20px",
      display: "flex", flexDirection: "column", alignItems: "center", overflowX: "hidden",
    },
    orbTop: {
      position: "fixed", top: 0, right: 0, width: "300px", height: "300px",
      background: THEME.orbTopRight, pointerEvents: "none", zIndex: 0
    },
    orbBottom: {
      position: "fixed", bottom: 0, left: 0, width: "300px", height: "300px",
      background: THEME.orbBottomLeft, pointerEvents: "none", zIndex: 0
    },
    sideTextLeft: {
      position: "fixed", left: "16px", top: "50%", transform: "translateY(-50%) rotate(-90deg)",
      fontSize: "10px", letterSpacing: "6px", color: "rgba(196,48,79,0.3)", fontStyle: "italic",
      pointerEvents: "none", zIndex: 2, whiteSpace: "nowrap"
    },
    sideTextRight: {
      position: "fixed", right: "16px", top: "50%", transform: "translateY(-50%) rotate(90deg)",
      fontSize: "10px", letterSpacing: "6px", color: "rgba(196,48,79,0.3)", fontStyle: "italic",
      pointerEvents: "none", zIndex: 2, whiteSpace: "nowrap"
    },
    container: { width: "100%", maxWidth: "800px", zIndex: 1, position: "relative" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", width: "100%" },
    logo: { fontFamily: THEME.serif, fontStyle: "italic", fontSize: "24px", color: THEME.rose, fontWeight: "bold" },
    pill: {
      background: "linear-gradient(135deg, #9b1a3a, #c4304f)", padding: "4px 12px", borderRadius: "20px",
      fontSize: "11px", fontWeight: "bold", letterSpacing: "1px", color: "white"
    },
    progressBox: { marginBottom: "40px", width: "100%" },
    progressGrid: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "6px", marginBottom: "8px" },
    stepBar: (idx) => ({
      height: "4px", borderRadius: "2px",
      background: idx <= step ? "linear-gradient(90deg, #9b1a3a, #c4304f)" : "rgba(255,255,255,0.08)",
      transition: "0.5s"
    }),
    stepCounter: { textAlign: "right", fontSize: "12px", color: "rgba(255,248,240,0.5)", textTransform: "uppercase", letterSpacing: "1px" },
    stepHeader: { textAlign: "center", marginBottom: "32px" },
    stepTag: { color: THEME.rose, letterSpacing: "3px", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px" },
    heading: { fontFamily: THEME.serif, fontSize: "clamp(24px, 5vw, 40px)", margin: "0 0 8px", fontWeight: "normal" },
    input: {
      width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "10px", padding: "13px 16px", color: "#fff8f0", fontSize: "15px",
      fontFamily: THEME.serif, outline: "none", boxSizing: "border-box",
    },
    footer: {
      position: "fixed", bottom: 0, left: 0, width: "100%", padding: "20px",
      display: "flex", justifyContent: "center", pointerEvents: "none", zIndex: 10
    },
    navInner: { width: "100%", maxWidth: "800px", display: "flex", justifyContent: "space-between", pointerEvents: "auto" },
    btnBack: {
      padding: "14px 28px", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.12)",
      background: "transparent", color: "rgba(255,255,255,0.6)", cursor: "pointer", transition: "0.2s"
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
      <style>{`
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        button:hover { filter: brightness(1.08); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(155,26,58,0.3); border-radius: 2px; }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(0.3); cursor: pointer; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0; transform:translateY(10px)} to{opacity:1; transform:translateY(0)} }
      `}</style>

      <div style={styles.orbTop} />
      <div style={styles.orbBottom} />
      <div style={styles.sideTextLeft}>love · devotion · forever · yours</div>
      <div style={styles.sideTextRight}>crafted with heart · lovebites</div>

      <div style={styles.container}>
        {/* HEADER */}
        <header style={styles.header}>
          <div style={styles.logo}>💗 LoveBites</div>
          <div style={styles.pill}>SWEET START ₹49</div>
        </header>

        {/* PROGRESS */}
        <div style={styles.progressBox}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ fontSize: "11px", fontFamily: THEME.sans, color: "rgba(255,255,255,0.3)", letterSpacing: "2px" }}>PROGRESS</div>
            <div style={styles.stepCounter}>{step + 1} of 6 steps</div>
          </div>
          <div style={styles.progressGrid}>
            {Array(6).fill(0).map((_, i) => (
              <div key={i} style={styles.stepBar(i)} />
            ))}
          </div>
        </div>

        {/* STEPS */}
        <main style={{ paddingBottom: "100px" }}>
          
          {/* STEP 0: MOOD */}
          {step === 0 && (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepTag}>STEP ONE</div>
                <h1 style={styles.heading}>How does your heart <i style={{ color: THEME.rose }}>feel right now?</i></h1>
                <p style={{ color: "rgba(255,248,240,0.5)", fontSize: "16px" }}>Choose 1 mood that captures this moment</p>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: "8px", overflowX: "auto", marginBottom: "24px", paddingBottom: "8px" }}>
                {["Romantic", "Emotional", "Fun", "Deep", "Occasion"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "10px 20px", borderRadius: "20px", whiteSpace: "nowrap", border: "1px solid",
                      borderColor: activeTab === tab ? THEME.rose : "rgba(255,255,255,0.1)",
                      background: activeTab === tab ? "rgba(155,26,58,0.15)" : "transparent",
                      color: activeTab === tab ? THEME.rose : "rgba(255,255,255,0.4)",
                      cursor: "pointer", transition: "0.2s", fontSize: "13px"
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Mood Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "12px" }}>
                {MOODS.filter(m => m.cat === activeTab).map(mood => {
                  const isSelected = selectedMood === mood.id;
                  return (
                    <div
                      key={mood.id}
                      onClick={() => toggleMood(mood.id)}
                      style={{
                        padding: "16px 18px", borderRadius: "14px", cursor: "pointer", transition: "0.2s",
                        background: isSelected ? "linear-gradient(135deg, rgba(155,26,58,0.25), rgba(196,48,79,0.12))" : "rgba(255,255,255,0.03)",
                        border: isSelected ? `1px solid rgba(196,48,79,0.6)` : "1px solid rgba(255,255,255,0.07)",
                        transform: isSelected ? "scale(1.02)" : "scale(1)",
                        position: "relative"
                      }}
                    >
                      <div style={{ fontSize: "24px", marginBottom: "8px" }}>{mood.emoji}</div>
                      <div style={{ fontWeight: "bold", fontSize: "13px", color: isSelected ? THEME.rose : "white" }}>{mood.label}</div>
                      <div style={{ fontSize: "11px", color: "rgba(255,248,240,0.4)", fontStyle: "italic", marginTop: "2px" }}>{mood.sub}</div>
                      {isSelected && (
                         <div style={{ 
                           position: "absolute", bottom: "12px", right: "12px", width: "18px", height: "18px", 
                           borderRadius: "50%", background: "linear-gradient(135deg, #9b1a3a, #c4304f)",
                           display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px"
                         }}>✓</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {selectedMood && (
                <div style={{ marginTop: "24px", display: "flex", justifyContent: "center" }}>
                   <div style={{ 
                     padding: "6px 14px", borderRadius: "20px", background: THEME.maroon, color: "white", 
                     fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" 
                   }}>
                     {MOODS.find(m => m.id === selectedMood)?.emoji} {MOODS.find(m => m.id === selectedMood)?.label}
                     <span onClick={() => setSelectedMood(null)} style={{ cursor: "pointer", opacity: 0.6 }}>✕</span>
                   </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 1: OCCASION */}
          {step === 1 && (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepTag}>STEP TWO</div>
                <h1 style={styles.heading}>What's the <i style={{ color: THEME.rose }}>occasion?</i></h1>
                <p style={{ color: "rgba(255,248,240,0.5)", fontSize: "16px" }}>Pick one occasion for your Love Code</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                {OCCASIONS.map(occ => {
                  const isSelected = selectedOccasion === occ.id;
                  return (
                    <div
                      key={occ.id}
                      onClick={() => setSelectedOccasion(occ.id)}
                      style={{
                        padding: "32px", borderRadius: "20px", textAlign: "center", cursor: "pointer", transition: "0.2s",
                        border: isSelected ? `1px solid rgba(196,48,79,0.6)` : "1px solid rgba(255,255,255,0.05)",
                        background: isSelected ? "rgba(155,26,58,0.2)" : "rgba(255,255,255,0.03)",
                      }}
                    >
                      <div style={{ fontSize: "36px", marginBottom: "12px" }}>{occ.emoji}</div>
                      <div style={{ 
                        fontWeight: isSelected ? "600" : "500", fontSize: "16px",
                        color: isSelected ? "#fff8f0" : "rgba(255,248,240,0.7)"
                      }}>{occ.label}</div>
                      {isSelected && <div style={{ fontSize: "18px", marginTop: "8px" }}>💗</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: STORY */}
          {step === 2 && (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepTag}>STEP THREE</div>
                <h1 style={styles.heading}>Tell us your <i style={{ color: THEME.rose }}>love story</i></h1>
                <p style={{ color: "rgba(255,248,240,0.5)", fontSize: "16px" }}>The more you share, the more personal your AI message will be</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,248,240,0.4)", marginBottom: "8px", display: "block", textTransform: "uppercase", letterSpacing: "1px" }}>Your Name</label>
                  <input 
                    type="text" value={yourName} onChange={(e) => setYourName(e.target.value)}
                    placeholder="From..." style={styles.input}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,248,240,0.4)", marginBottom: "8px", display: "block", textTransform: "uppercase", letterSpacing: "1px" }}>Their Name</label>
                  <input 
                    type="text" value={partnerName} onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="To..." style={styles.input}
                  />
                </div>
              </div>

              <div style={{ position: "relative" }}>
                <label style={{ fontSize: "11px", color: "rgba(255,248,240,0.4)", marginBottom: "8px", display: "block", textTransform: "uppercase", letterSpacing: "1px" }}>What do they mean to you?</label>
                <textarea 
                  value={theirStory} onChange={(e) => setTheirStory(e.target.value)}
                  placeholder="Tell us about a favorite memory or what makes them special..."
                  style={{ ...styles.input, height: "180px", resize: "none", lineHeight: "1.8" }}
                />
                <div style={{ position: "absolute", bottom: "12px", right: "12px", fontSize: "11px", color: "rgba(255,248,240,0.3)" }}>
                  {theirStory.length} chars
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PHOTOS */}
          {step === 3 && (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepTag}>STEP FOUR</div>
                <h1 style={styles.heading}>Your <i style={{ color: THEME.rose }}>precious moments</i></h1>
                <p style={{ color: "rgba(255,248,240,0.5)", fontSize: "16px" }}>Upload up to 5 photos</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", marginBottom: "24px" }}>
                {photos.map((photo, i) => (
                  <div 
                    key={i} 
                    onClick={() => handleFileUpload(i)}
                    style={{ 
                      aspectRatio: "1", borderRadius: "16px", cursor: "pointer", position: "relative",
                      background: photo ? "none" : "rgba(255,255,255,0.06)",
                      border: photo ? `2px solid ${THEME.maroon}` : "none",
                      boxShadow: photo ? `0 0 16px rgba(155,26,58,0.3)` : "none",
                      overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                      flexDirection: "column", gap: "8px"
                    }}
                  >
                    {photo ? (
                      <>
                        <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div style={{ 
                          position: "absolute", bottom: 0, left: 0, width: "100%", height: "30%", 
                          background: "linear-gradient(to top, rgba(155,26,58,0.4), transparent)",
                          border: "3px solid rgba(155,26,58,0.4)", pointerEvents: "none"
                        }} />
                        <div onClick={(e) => { e.stopPropagation(); removePhoto(i); }} style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.5)", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px" }}>✕</div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: "22px", color: "rgba(255,255,255,0.3)" }}>+</div>
                        <div style={{ fontSize: "10px", letterSpacing: "1.5px", fontFamily: THEME.sans, color: "rgba(255,255,255,0.25)", fontWeight: "600" }}>PHOTO {i+1}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <input type="file" ref={photoRef} onChange={handleFileChange} style={{ display: "none" }} accept="image/*" />
            </div>
          )}

          {/* STEP 4: MESSAGE */}
          {step === 4 && (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepTag}>STEP FIVE</div>
                <h1 style={{ ...styles.heading, fontSize: "clamp(28px, 5vw, 48px)" }}>
                  Words written <i style={{ color: THEME.rose, fontStyle: "italic" }}>by the heart</i>
                </h1>
                <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: THEME.sans, fontSize: "14px" }}>
                  AI crafts a message based on your mood, occasion & story
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
                  <div style={{ 
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "20px", padding: "5px 14px", fontSize: "13px", color: "white"
                  }}>
                    {MOODS.find(m => m.id === selectedMood)?.emoji} {MOODS.find(m => m.id === selectedMood)?.label}
                  </div>
                  <div style={{ 
                    background: "rgba(155,26,58,0.15)", border: "1px solid rgba(155,26,58,0.3)",
                    borderRadius: "20px", padding: "5px 14px", fontSize: "13px", color: THEME.rose
                  }}>
                    {OCCASIONS.find(o => o.id === selectedOccasion)?.emoji} {OCCASIONS.find(o => o.id === selectedOccasion)?.label}
                  </div>
                </div>

                {!generatedMessage ? (
                  <div style={{ textAlign: 'center' }}>
                    <button 
                      onClick={generateMessage}
                      disabled={isGenerating}
                      style={{ 
                        background: isGenerating ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #9b1a3a, #c4304f)",
                        borderRadius: "50px", padding: "16px 44px", color: "white", fontSize: "15px", 
                        fontFamily: THEME.serif, fontStyle: "italic", cursor: isGenerating ? "not-allowed" : "pointer",
                        boxShadow: isGenerating ? "none" : "0 6px 24px rgba(155,26,58,0.4)", border: "none", transition: "0.3s"
                      }}
                    >
                      {isGenerating ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>✨</span>
                          Writing your message...
                        </span>
                      ) : "✨ Generate My Message"}
                    </button>
                    <p style={{ marginTop: "16px", color: "rgba(255,255,255,0.3)", fontSize: "12px", fontStyle: "italic" }}>
                      Powered by AI — crafted for your love story
                    </p>
                  </div>
                ) : (
                  <div style={{ width: '100%', maxWidth: '600px' }}>
                    <div style={{ 
                      background: "linear-gradient(135deg, rgba(155,26,58,0.08), rgba(196,48,79,0.04))",
                      border: "1px solid rgba(155,26,58,0.2)", borderRadius: "20px", padding: "32px", 
                      position: "relative", marginBottom: "20px", animation: "fadeIn 0.5s ease"
                    }}>
                      <div style={{ position: "absolute", top: "16px", left: "22px", fontSize: "48px", opacity: 0.12, color: THEME.rose, fontFamily: THEME.serif }}>“</div>
                      {isEditing ? (
                        <textarea
                          value={generatedMessage}
                          onChange={(e) => setGeneratedMessage(e.target.value)}
                          onBlur={() => setIsEditing(false)}
                          autoFocus
                          style={{ 
                            width: "100%", minHeight: "200px", background: "transparent", border: "none", 
                            color: "rgba(255,248,240,0.85)", fontSize: "15px", lineHeight: "1.9", fontFamily: THEME.serif, 
                            outline: "none", resize: "none", whiteSpace: "pre-wrap", paddingTop: "10px"
                          }}
                        />
                      ) : (
                        <div style={{ 
                          color: "rgba(255,248,240,0.85)", fontSize: "15px", lineHeight: "1.9", 
                          fontFamily: THEME.serif, whiteSpace: "pre-wrap", paddingTop: "10px"
                        }}>
                          {generatedMessage}
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                      <button 
                        onClick={generateMessage}
                        style={{ 
                          padding: "8px 18px", borderRadius: "20px", background: "rgba(255,255,255,0.05)", 
                          border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: "12px", cursor: "pointer" 
                        }}
                      >
                        ↻ Regenerate
                      </button>
                      <button 
                        onClick={() => setIsEditing(!isEditing)}
                        style={{ 
                          padding: "8px 18px", borderRadius: "20px", background: "rgba(255,255,255,0.05)", 
                          border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: "12px", cursor: "pointer" 
                        }}
                      >
                        ✏️ {isEditing ? "Done Editing" : "Edit Message"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: DELIVER */}
          {step === 5 && (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
              <div style={styles.stepHeader}>
                <div style={styles.stepTag}>FINAL STEP</div>
                <h1 style={styles.heading}>How shall we <i style={{ color: THEME.rose }}>deliver your love?</i></h1>
              </div>

              {/* Section 1: Code */}
              <div style={{ marginBottom: "32px" }}>
                <label style={{ fontSize: "11px", color: THEME.rose, fontWeight: "bold", letterSpacing: "1px", marginBottom: "8px", display: "block" }}>SECRET 4-DIGIT UNLOCK CODE</label>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                   <input 
                    type="text" maxLength="4" value={unlockCode} onChange={(e) => setUnlockCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="1234"
                    style={{ ...styles.input, width: "120px", fontSize: "22px", textAlign: "center", letterSpacing: "8px", fontFamily: "monospace" }}
                   />
                   <span style={{ fontSize: "13px", color: "rgba(255,248,240,0.4)" }}>Only your partner can unlock it with this code</span>
                </div>
              </div>

              {/* Section 2: Hint */}
              <div style={{ marginBottom: "32px" }}>
                <label style={{ fontSize: "11px", color: THEME.rose, fontWeight: "bold", letterSpacing: "1px", marginBottom: "8px", display: "block" }}>CUSTOM UNLOCK HINT (optional)</label>
                <input 
                  type="text" value={hintMessage} onChange={(e) => setHintMessage(e.target.value)}
                  placeholder="e.g. The date we first met... 💫" style={styles.input}
                />
              </div>



              {/* Summary Card */}
              <div style={{ 
                padding: "24px", borderRadius: "16px", background: "rgba(255,255,255,0.02)", 
                border: "1px solid rgba(255,255,255,0.05)", marginBottom: "20px"
              }}>
                <div style={{ fontSize: "12px", color: "rgba(255,248,240,0.4)", marginBottom: "16px", textAlign: "center" }}>PLAN SUMMARY</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <div style={{ fontSize: "10px", color: "rgba(255,248,240,0.3)", marginBottom: "4px" }}>MOOD</div>
                    <div style={{ fontSize: "14px" }}>
                      {selectedMood && MOODS.find(m => m.id === selectedMood) && (
                        <>{MOODS.find(m => m.id === selectedMood).emoji} {MOODS.find(m => m.id === selectedMood).label}</>
                      )}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "rgba(255,248,240,0.3)", marginBottom: "4px" }}>OCCASION</div>
                    <div style={{ fontSize: "14px" }}>
                      {selectedOccasion && OCCASIONS.find(o => o.id === selectedOccasion) && (
                        <>{OCCASIONS.find(o => o.id === selectedOccasion).emoji} {OCCASIONS.find(o => o.id === selectedOccasion).label}</>
                      )}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "rgba(255,248,240,0.3)", marginBottom: "4px" }}>PHOTOS</div>
                    <div style={{ fontSize: "14px" }}>{photos.filter(p => p !== null).length} uploaded</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "rgba(255,248,240,0.3)", marginBottom: "4px" }}>MESSAGE</div>
                    <div style={{ fontSize: "14px", color: THEME.rose }}>✓ Ready</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ fontSize: "14px", fontWeight: "bold" }}>Sweet Start ₹49</div>
                  <div style={{ fontSize: "20px", fontWeight: "bold", color: THEME.rose }}>₹49</div>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* FOOTER NAV */}
        <footer style={styles.footer}>
          <div style={styles.navInner}>
            <button 
              onClick={handleBack} 
              style={{ ...styles.btnBack, visibility: step === 0 ? "hidden" : "visible" }}
            >
              ← Back
            </button>
            <button 
              onClick={handleNext}
              disabled={!canProceed()}
              onMouseEnter={() => setHoveredBtn("next")}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                ...styles.btnNext(canProceed()),
                ...(hoveredBtn === "next" && canProceed() && { filter: "brightness(1.1)", transform: "scale(1.02)" })
              }}
            >
              {step === 5 ? "Preview & Pay ₹49 💗" : "Continue →"}
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default SweetStart49;
