import { useState, useRef } from "react";

const TrueLovePlan = ({ onComplete }) => {
    // --- STATE VARIABLES ---
    const [step, setStep] = useState(0);
    const [selectedMoods, setSelectedMoods] = useState([]); // max 3
    const [selectedOccasion, setSelectedOccasion] = useState(null);
    const [yourName, setYourName] = useState("");
    const [partnerName, setPartnerName] = useState("");
    const [theirStory, setTheirStory] = useState("");
    const [photos, setPhotos] = useState([null, null, null, null, null]);
    const [videoPhotos, setVideoPhotos] = useState([null, null, null, null, null]);
    const [activePhotoSlot, setActivePhotoSlot] = useState(null);
    const [activeVideoSlot, setActiveVideoSlot] = useState(null);
    const [selectedFrame] = useState(0); // read-only, auto-curated
    const [unlockCode, setUnlockCode] = useState("");
    const [hintMessage, setHintMessage] = useState("");
    const [deliveryMethod, setDeliveryMethod] = useState(null);
    const [recipientContact, setRecipientContact] = useState("");
    const [generatedMessage, setGeneratedMessage] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [videoGenerating, setVideoGenerating] = useState(false);
    const [videoReady, setVideoReady] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState("");
    const [deliveryTime, setDeliveryTime] = useState("");
    const [activeTab, setActiveTab] = useState("Romantic");
    const [hoveredBtn, setHoveredBtn] = useState(null);
    const photoRef = useRef(null);
    const videoPhotoRef = useRef(null);

    // --- DATA ---
    const frames = [
        { id: "rose_garden", label: "Rose Garden", gradient: "linear-gradient(135deg, #ff6b8a, #ff9a9e)", border: "#ff6b8a" },
        { id: "midnight_romance", label: "Midnight Romance", gradient: "linear-gradient(135deg, #1a1a2e, #e94560)", border: "#e94560" },
        { id: "golden_hour", label: "Golden Hour", gradient: "linear-gradient(135deg, #f7971e, #ffd200)", border: "#f7971e" },
        { id: "velvet_dream", label: "Velvet Dream", gradient: "linear-gradient(135deg, #667eea, #f093fb)", border: "#a855f7" },
        { id: "cherry_blossom", label: "Cherry Blossom", gradient: "linear-gradient(135deg, #f8a5c2, #f78fb3)", border: "#f78fb3" },
    ];

    const moodsData = [
        { id: "deeply_in_love", label: "Deeply in Love", subtitle: "I feel completely in love with you", emoji: "❤️", category: "Romantic" },
        { id: "adoring", label: "Adoring", subtitle: "I adore everything about you", emoji: "🥰", category: "Romantic" },
        { id: "affectionate", label: "Affectionate", subtitle: "I feel warm and affectionate toward you", emoji: "💞", category: "Romantic" },
        { id: "hopelessly_romantic", label: "Hopelessly Romantic", subtitle: "You make me believe in love stories", emoji: "💘", category: "Romantic" },
        { id: "grateful", label: "Grateful", subtitle: "I'm thankful to have you in my life", emoji: "💓", category: "Emotional" },
        { id: "cherishing", label: "Cherishing", subtitle: "I cherish every moment with you", emoji: "🌹", category: "Romantic" },
        { id: "devoted", label: "Devoted", subtitle: "My heart belongs to you", emoji: "💗", category: "Deep" },
        { id: "comforted", label: "Comforted", subtitle: "You make me feel safe and calm", emoji: "🤍", category: "Deep" },
        { id: "obsessed", label: "Obsessed with You", subtitle: "I can't get enough of you", emoji: "😍", category: "Romantic" },
        { id: "playful", label: "Playful Love", subtitle: "Loving you is fun and exciting", emoji: "😘", category: "Fun" },
        { id: "happy", label: "Happy with You", subtitle: "You make my life joyful", emoji: "😄", category: "Fun" },
        { id: "forever", label: "Forever Yours", subtitle: "I want a lifetime with you", emoji: "💍", category: "Deep" },
        { id: "soulmate", label: "Soulmate Feeling", subtitle: "You feel like my other half", emoji: "🌙", category: "Deep" },
        { id: "passionate", label: "Passionate", subtitle: "My love for you burns intensely", emoji: "🔥", category: "Deep" },
        { id: "birthday", label: "Birthday Love", subtitle: "Celebrating you today", emoji: "🎂", category: "Occasion" },
        { id: "proposal", label: "Proposal Mood", subtitle: "Ready to ask you forever", emoji: "💍", category: "Occasion" },
        { id: "missing", label: "Missing You", subtitle: "I wish you were here", emoji: "💌", category: "Occasion" },
        { id: "celebrating", label: "Celebrating Us", subtitle: "Celebrating our love", emoji: "🎉", category: "Occasion" },
    ];

    const occasions = [
        { id: "anniversary", label: "Anniversary", emoji: "💑" },
        { id: "birthday", label: "Birthday", emoji: "🎂" },
        { id: "valentine", label: "Valentine's Day", emoji: "💝" },
        { id: "just_because", label: "Just Because", emoji: "🌸" },
        { id: "proposal", label: "Proposal", emoji: "💍" },
        { id: "long_distance", label: "Long Distance", emoji: "✈️" },
    ];

    const deliveryMethods = [
        { id: "email", label: "Email", icon: "✉️", description: "Delivered via LoveBites branded email" },
        { id: "whatsapp", label: "WhatsApp", icon: "💬", description: "Sent from our LoveBites account" },
        { id: "instagram", label: "Instagram", icon: "📸", description: "DM from @LoveBites official" },
    ];

    // --- HELPERS ---
    const canProceed = () => {
        switch (step) {
            case 0: return selectedMoods.length > 0;
            case 1: return selectedOccasion !== null;
            case 2: return theirStory.trim().length > 10;
            case 3: return photos.some(p => p !== null);
            case 4: return true; // skippable
            case 5: return generatedMessage.length > 0;
            case 6: return unlockCode.length === 4 && deliveryMethod !== null;
            default: return false;
        }
    };

    const handleNext = () => {
        if (step === 6 && canProceed()) {
            if (onComplete) {
                onComplete({
                    recipientName: partnerName,
                    senderName: yourName,
                    selectedMoods: selectedMoods.map(id => moodsData.find(m => m.id === id)),
                    occasion: occasions.find(o => o.id === selectedOccasion),
                    hintMessage: hintMessage,
                    unlockCode: unlockCode,
                    generatedMessage: generatedMessage,
                    photos: photos,
                });
            }
            return;
        }
        if (canProceed()) setStep(s => s + 1);
    };

    const handleBack = () => {
        setStep(s => Math.max(0, s - 1));
    };

    const toggleMood = (mood) => {
        if (selectedMoods.includes(mood.id)) {
            setSelectedMoods(selectedMoods.filter(id => id !== mood.id));
        } else if (selectedMoods.length < 3) {
            setSelectedMoods([...selectedMoods, mood.id]);
        }
    };

    const handlePhotoUpload = (index, type) => {
        if (type === 'photo') {
            setActivePhotoSlot(index);
            photoRef.current.click();
        } else {
            setActiveVideoSlot(index);
            videoPhotoRef.current.click();
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            if (type === 'photo') {
                const newPhotos = [...photos];
                newPhotos[activePhotoSlot] = event.target.result;
                setPhotos(newPhotos);
            } else {
                const newVideoPhotos = [...videoPhotos];
                newVideoPhotos[activeVideoSlot] = event.target.result;
                setVideoPhotos(newVideoPhotos);
            }
        };
        reader.readAsDataURL(file);
    };

    const removePhoto = (index, type) => {
        if (type === 'photo') {
            const newPhotos = [...photos];
            newPhotos[index] = null;
            setPhotos(newPhotos);
        } else {
            const newVideoPhotos = [...videoPhotos];
            newVideoPhotos[index] = null;
            setVideoPhotos(newVideoPhotos);
        }
    };

    const generateVideo = () => {
        setVideoGenerating(true);
        setTimeout(() => {
            setVideoGenerating(false);
            setVideoReady(true);
        }, 3000);
    };

    const generateAIByGroq = async () => {
        setIsGenerating(true);
        const moodsStr = selectedMoods.map(id => moodsData.find(m => m.id === id)?.label).join(", ");
        const occasionLabel = occasions.find(o => o.id === selectedOccasion)?.label;

        try {
            const response = await fetch('/api/generate-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
                console.error('Server error:', data);
                throw new Error(data.details || data.error);
            }

            setGeneratedMessage(data.message);
        } catch (error) {
            console.error("Error generating message:", error);
            setGeneratedMessage("My dearest, words cannot fully capture the depth of my love for you, but please know that you are my heart's greatest joy and my soul's eternal partner. Every moment with you is a gift I cherish more than words can say. (Error generating message, but our love remains true!)");
        } finally {
            setIsGenerating(false);
        }
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    // --- STYLES OBJECT ---
    const s = {
        wrapper: {
            minHeight: "100vh",
            background: "linear-gradient(160deg, #0d0d1a 0%, #1a0a14 50%, #0d0d1a 100%)",
            color: "#fff",
            fontFamily: "sans-serif",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%"
        },
        header: {
            width: "100%",
            maxWidth: "780px",
            padding: "32px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10
        },
        logo: {
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontStyle: "italic",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#ff6b8a"
        },
        badge: {
            background: "rgba(233, 69, 96, 0.2)",
            border: "1px solid rgba(233, 69, 96, 0.4)",
            padding: "4px 12px",
            borderRadius: "9999px",
            fontSize: "10px",
            letterSpacing: "2px",
            fontWeight: "bold",
            color: "#ff6b8a"
        },
        progressContainer: {
            width: "100%",
            maxWidth: "780px",
            padding: "0 20px",
            marginBottom: "40px",
            zIndex: 10
        },
        progressHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px"
        },
        progressLabel: {
            fontSize: "11px",
            color: "rgba(255, 255, 255, 0.4)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: "semibold"
        },
        progressStepCount: {
            fontSize: "11px",
            color: "rgba(255, 255, 255, 0.6)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: "semibold"
        },
        progressBarGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "8px"
        },
        main: {
            width: "100%",
            maxWidth: "780px",
            padding: "0 20px 128px 20px",
            flex: 1,
            zIndex: 10
        },
        orb: {
            position: "fixed",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            filter: "blur(120px)",
            pointerEvents: "none",
            zIndex: 0
        },
        stepLabel: {
            color: "#ff6b8a",
            letterSpacing: "3px",
            fontSize: "11px",
            fontWeight: "bold",
            marginBottom: "12px",
            display: "block",
            textTransform: "uppercase"
        },
        heading: {
            fontSize: "clamp(2rem, 8vw, 3rem)",
            marginBottom: "16px",
            lineHeight: 1.2,
            color: "#fff",
            fontFamily: "'Georgia', 'Times New Roman', serif"
        },
        subtext: {
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "18px",
            marginBottom: "32px"
        },
        tabContainer: {
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "32px"
        },
        tabButton: (isActive) => ({
            padding: "8px 24px",
            borderRadius: "9999px",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.3s",
            background: isActive ? "rgba(233, 69, 96, 0.15)" : "transparent",
            border: isActive ? "1px solid #e94560" : "1px solid rgba(255, 255, 255, 0.1)",
            color: isActive ? "#ff6b8a" : "rgba(255, 255, 255, 0.4)",
            cursor: "pointer",
            fontFamily: "inherit"
        }),
        gridMood: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "14px",
            marginBottom: "32px"
        },
        cardMood: (isSelected) => ({
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
            padding: "20px",
            borderRadius: "16px",
            border: isSelected ? "1px solid rgba(233, 69, 96, 0.6)" : "1px solid rgba(255, 255, 255, 0.05)",
            textAlign: "left",
            transition: "all 0.3s",
            position: "relative",
            overflow: "hidden",
            background: isSelected ? "linear-gradient(to bottom right, rgba(233, 69, 96, 0.2), rgba(255, 107, 138, 0.1))" : "rgba(255, 255, 255, 0.05)",
            transform: isSelected ? "scale(1.02)" : "scale(1)",
            cursor: "pointer",
            width: "100%",
            color: "#fff",
            fontFamily: "inherit"
        }),
        chipMood: {
            background: "rgba(233, 69, 96, 0.2)",
            border: "1px solid rgba(233, 69, 96, 0.4)",
            padding: "8px 16px",
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
        },
        footer: {
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            zIndex: 50,
            padding: "24px",
            pointerEvents: "none"
        },
        footerInner: {
            width: "100%",
            maxWidth: "780px",
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            pointerEvents: "auto"
        },
        btnBack: {
            padding: "16px 32px",
            borderRadius: "9999px",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "rgba(255, 255, 255, 0.1)",
            background: "rgba(0, 0, 0, 0.2)",
            color: "rgba(255, 255, 255, 0.6)",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.25s ease",
            fontFamily: "inherit"
        },
        btnNext: (isEnabled) => ({
            padding: "16px 40px",
            borderRadius: "9999px",
            fontWeight: "bold",
            fontSize: "18px",
            transition: "all 0.25s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: isEnabled ? "linear-gradient(90deg, #e94560, #ff6b8a)" : "rgba(255, 255, 255, 0.05)",
            color: isEnabled ? "#fff" : "rgba(255, 255, 255, 0.2)",
            cursor: isEnabled ? "pointer" : "not-allowed",
            border: "none",
            boxShadow: isEnabled ? "0 8px 30px rgba(233, 69, 96, 0.4)" : "none",
            fontFamily: "inherit"
        }),
        input: {
            width: "100%",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "16px 20px",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            color: "#fff",
            transition: "all 0.3s",
            outline: "none"
        },
        inputLabel: {
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "rgba(255, 255, 255, 0.4)",
            fontWeight: "bold",
            marginLeft: "4px"
        },
        charCounter: {
            position: "absolute",
            bottom: "16px",
            right: "16px",
            fontSize: "10px",
            color: "rgba(255, 255, 255, 0.3)",
            fontWeight: "bold"
        },
        gridPhotos: {
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "16px",
            marginBottom: "40px"
        },
        photoSlot: (isFilled) => ({
            aspectRatio: "1/1",
            borderRadius: "16px",
            border: isFilled ? "none" : "1px dashed rgba(255, 255, 255, 0.1)",
            background: isFilled ? "transparent" : "rgba(255, 255, 255, 0.05)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: "pointer",
            transition: "all 0.3s",
            position: "relative",
            overflow: "hidden"
        }),
        photoImg: {
            width: "100%",
            height: "100%",
            objectFit: "cover"
        },
        photoFrame: {
            position: "absolute",
            inset: 0,
            border: "4px solid",
            pointerEvents: "none",
            opacity: 0.6
        },
        btnRemovePhoto: {
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "24px",
            height: "24px",
            background: "rgba(0, 0, 0, 0.6)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            border: "none",
            color: "#fff",
            cursor: "pointer"
        },
        photoLabel: {
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            opacity: 0.4,
            fontWeight: "bold"
        },
        frameHeader: {
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "rgba(255, 255, 255, 0.3)",
            fontWeight: "bold",
            marginBottom: "16px"
        },
        frameBadge: {
            padding: "8px 16px",
            borderRadius: "9999px",
            fontSize: "11px",
            fontWeight: "bold",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "white"
        },
        frameNote: {
            marginTop: "16px",
            color: "rgba(255, 255, 255, 0.4)",
            fontSize: "12px",
            fontStyle: "italic"
        },
        btnVideoGenerate: (isDisabled) => ({
            width: "100%",
            maxWidth: "400px",
            padding: "20px",
            borderRadius: "9999px",
            fontWeight: "bold",
            fontSize: "20px",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontStyle: "italic",
            transition: "all 0.3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            border: "none",
            background: isDisabled ? "rgba(255, 255, 255, 0.05)" : "linear-gradient(90deg, #e94560, #ff6b8a)",
            color: isDisabled ? "rgba(255, 255, 255, 0.2)" : "#fff",
            cursor: isDisabled ? "not-allowed" : "pointer",
            boxShadow: isDisabled ? "0 8px 30px rgba(233, 69, 96, 0.3)" : "none"
        }),
        spinner: {
            width: "20px",
            height: "20px",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            borderTopColor: "#fff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
        },
        videoSuccessCard: {
            width: "100%",
            maxWidth: "400px",
            background: "linear-gradient(to bottom right, rgba(233, 69, 96, 0.2), rgba(255, 107, 138, 0.1))",
            border: "1px solid rgba(233, 69, 96, 0.4)",
            padding: "32px",
            borderRadius: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px"
        },
        btnPlayPreview: {
            width: "56px",
            height: "56px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            transition: "all 0.3s"
        },
        videoNote: {
            color: "rgba(255, 255, 255, 0.3)",
            fontSize: "12px",
            maxWidth: "400px",
            textAlign: "center",
            fontStyle: "italic",
            lineHeight: "1.6"
        },
        chipMoodStatic: {
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "6px 14px",
            borderRadius: "9999px",
            fontSize: "11px",
            color: "rgba(255, 255, 255, 0.6)"
        },
        chipOccasionStatic: {
            background: "rgba(233, 69, 96, 0.1)",
            border: "1px solid rgba(233, 69, 96, 0.2)",
            padding: "6px 14px",
            borderRadius: "9999px",
            fontSize: "11px",
            color: "#ff6b8a"
        },
        btnAIGenerate: (isDisabled) => ({
            width: "100%",
            maxWidth: "400px",
            background: isDisabled ? "rgba(255, 255, 255, 0.05)" : "linear-gradient(90deg, #e94560, #ff6b8a)",
            padding: "20px",
            borderRadius: "9999px",
            fontWeight: "bold",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            border: "none",
            color: isDisabled ? "rgba(255, 255, 255, 0.2)" : "#fff",
            cursor: isDisabled ? "not-allowed" : "pointer",
            boxShadow: isDisabled ? "none" : "0 8px 30px rgba(233, 69, 96, 0.3)",
            transition: "all 0.3s",
            fontFamily: "inherit"
        }),
        poweredBy: {
            color: "rgba(255, 255, 255, 0.2)",
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: "bold"
        },
        messageCard: {
            background: "rgba(233, 69, 96, 0.05)",
            border: "1px solid rgba(233, 69, 96, 0.2)",
            padding: "32px",
            borderRadius: "32px",
            position: "relative",
            marginBottom: "32px"
        },
        quoteMark: {
            position: "absolute",
            top: "24px",
            left: "24px",
            fontSize: "64px",
            color: "rgba(233, 69, 96, 0.2)",
            fontFamily: "'Georgia', 'Times New Roman', serif"
        },
        messageTextarea: {
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: "18px",
            lineHeight: "1.9",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            whiteSpace: "pre-wrap",
            minHeight: "300px",
            resize: "none"
        },
        messageDisplay: {
            width: "100%",
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: "18px",
            lineHeight: "1.9",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            whiteSpace: "pre-wrap",
            minHeight: "300px",
            padding: "16px 0"
        },
        btnRegenerate: {
            padding: "12px 24px",
            borderRadius: "9999px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            background: "rgba(255, 255, 255, 0.05)",
            fontSize: "14px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#fff",
            cursor: "pointer",
            transition: "all 0.3s",
            fontFamily: "inherit"
        },
        btnEdit: {
            padding: "12px 32px",
            borderRadius: "9999px",
            background: "rgba(255, 255, 255, 0.1)",
            fontSize: "14px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s",
            fontFamily: "inherit"
        },
        gridOccasion: {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px"
        },
        cardOccasion: (isSelected) => ({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            padding: "32px",
            borderRadius: "16px",
            border: isSelected ? "1px solid rgba(233, 69, 96, 0.6)" : "1px solid rgba(255, 255, 255, 0.05)",
            transition: "all 0.3s",
            position: "relative",
            background: isSelected ? "rgba(233, 69, 96, 0.2)" : "rgba(255, 255, 255, 0.05)",
            cursor: "pointer",
            width: "100%",
            color: "#fff",
            fontFamily: "inherit"
        }),
        checkCircle: {
            position: "absolute",
            bottom: "12px",
            right: "12px",
            width: "20px",
            height: "20px",
            background: "#e94560",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px"
        },
        chipText: {
            fontSize: "14px",
            fontWeight: "500",
            color: "#ff6b8a"
        },
        chipClose: {
            color: "rgba(255, 107, 138, 0.6)",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "14px",
            padding: "0 4px"
        },
        gridDelivery: {
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: "16px",
            marginBottom: "32px"
        },
        cardDelivery: (isSelected) => ({
            padding: "24px",
            borderRadius: "20px",
            background: isSelected ? "rgba(233, 69, 96, 0.2)" : "rgba(255, 255, 255, 0.05)",
            border: isSelected ? "1px solid rgba(233, 69, 96, 0.6)" : "1px solid rgba(255, 255, 255, 0.05)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            cursor: "pointer",
            transition: "all 0.3s",
            width: "100%",
            textAlign: "left",
            fontFamily: "inherit",
            color: "#fff"
        }),
        radio: (isSelected) => ({
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            border: isSelected ? "5px solid #ff6b8a" : "2px solid rgba(255, 255, 255, 0.2)",
            background: isSelected ? "#fff" : "transparent"
        }),
        scheduleCard: {
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "28px",
            marginTop: "24px"
        },
        scheduleLabel: {
            fontSize: "11px",
            fontFamily: "sans-serif",
            color: "rgba(255, 255, 255, 0.4)",
            letterSpacing: "1.5px"
        },
        scheduleInput: {
            width: "100%",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
            padding: "12px 16px",
            color: "#fff",
            fontFamily: "sans-serif",
            outline: "none"
        },
        scheduleNote: {
            fontSize: "12px",
            fontFamily: "sans-serif",
            color: "rgba(255, 255, 255, 0.3)",
            fontStyle: "italic",
            textAlign: "center",
            marginTop: "12px",
            display: "block"
        }
    };

    // --- RENDERING ---
    return (
        <div style={s.wrapper}>
            {/* Hidden Inputs */}
            <input type="file" hidden ref={photoRef} accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} />
            <input type="file" hidden ref={videoPhotoRef} accept="image/*" onChange={(e) => handleFileChange(e, 'video')} />

            <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        button:hover { filter: brightness(1.05); }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(233,69,96,0.3); border-radius: 2px; }
      `}</style>

            {/* Ambient Orbs */}
            <div style={{ ...s.orb, top: "-10%", right: "-10%", background: "rgba(233, 69, 96, 0.1)" }} />
            <div style={{ ...s.orb, bottom: "-10%", left: "-10%", background: "rgba(255, 107, 138, 0.08)" }} />

            {/* Header */}
            <header style={s.header}>
                <div style={s.logo}>
                    💗 LoveBites
                </div>
                <div style={s.badge}>
                    TRUE LOVE ₹99
                </div>
            </header>

            {/* Progress Bar */}
            <div style={s.progressContainer}>
                <div style={s.progressHeader}>
                    <div style={s.progressLabel}>Progress</div>
                    <div style={s.progressStepCount}>{step + 1} of 7 steps</div>
                </div>
                <div style={s.progressBarGrid}>
                    {[...Array(7)].map((_, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <div style={{
                                height: "2px",
                                borderRadius: "9999px",
                                transition: "all 0.5s",
                                background: i <= step ? "linear-gradient(90deg, #e94560, #ff6b8a)" : "rgba(255,255,255,0.1)"
                            }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <main style={s.main}>
                {step === 0 && (
                    <div>
                        <label style={s.stepLabel}>Step One</label>
                        <h1 style={s.heading}>
                            How does your heart <br />
                            <span style={{ color: "#ff6b8a", fontStyle: "italic" }}>feel right now?</span>
                        </h1>
                        <p style={s.subtext}>Choose up to 3 moods that capture this moment</p>

                        {/* Tabs */}
                        <div style={s.tabContainer}>
                            {["Romantic", "Emotional", "Fun", "Deep", "Occasion"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={s.tabButton(activeTab === tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Mood Grid */}
                        <div style={s.gridMood}>
                            {moodsData.filter(m => m.category === activeTab).map(mood => (
                                <button
                                    key={mood.id}
                                    onClick={() => toggleMood(mood)}
                                    style={s.cardMood(selectedMoods.includes(mood.id))}
                                >
                                    <span style={{ fontSize: "30px" }}>{mood.emoji}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "2px" }}>{mood.label}</div>
                                        <div style={{ color: "rgba(255, 255, 255, 0.5)", fontStyle: "italic", fontSize: "14px" }}>{mood.subtitle}</div>
                                    </div>
                                    {selectedMoods.includes(mood.id) && (
                                        <div style={s.checkCircle}>✓</div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Selected Chips */}
                        {selectedMoods.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", paddingTop: "16px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
                                {selectedMoods.map(id => {
                                    const mood = moodsData.find(m => m.id === id);
                                    return (
                                        <div key={id} style={s.chipMood}>
                                            <span style={s.chipText}>{mood.emoji} {mood.label}</span>
                                            <button onClick={() => toggleMood(mood)} style={s.chipClose}>✕</button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {step === 1 && (
                    <div>
                        <label style={s.stepLabel}>Step Two</label>
                        <h1 style={s.heading}>
                            What's the <span style={{ color: "#ff6b8a", fontStyle: "italic" }}>occasion?</span>
                        </h1>
                        <p style={s.subtext}>Pick one occasion for your Love Code</p>

                        <div style={s.gridOccasion}>
                            {occasions.map(occ => (
                                <button
                                    key={occ.id}
                                    onClick={() => setSelectedOccasion(occ.id)}
                                    style={s.cardOccasion(selectedOccasion === occ.id)}
                                >
                                    <span style={{ fontSize: "40px" }}>{occ.emoji}</span>
                                    <span style={{ fontWeight: "bold", textAlign: "center" }}>{occ.label}</span>
                                    {selectedOccasion === occ.id && (
                                        <div style={{ position: "absolute", bottom: "12px", color: "#ff6b8a" }}>💗</div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <label style={s.stepLabel}>Step Three</label>
                        <h1 style={s.heading}>
                            Tell us your <span style={{ color: "#ff6b8a", fontStyle: "italic" }}>love story</span>
                        </h1>
                        <p style={s.subtext}>The more you share, the more personal your AI message will be</p>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: "16px", marginBottom: "24px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <label style={s.inputLabel}>Your Name</label>
                                <input
                                    type="text"
                                    placeholder="From..."
                                    value={yourName}
                                    onChange={(e) => setYourName(e.target.value)}
                                    style={s.input}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <label style={s.inputLabel}>Their Name</label>
                                <input
                                    type="text"
                                    placeholder="To..."
                                    value={partnerName}
                                    onChange={(e) => setPartnerName(e.target.value)}
                                    style={s.input}
                                />
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative" }}>
                            <label style={s.inputLabel}>What do they mean to you?</label>
                            <textarea
                                rows={6}
                                placeholder="Share a memory, why they're special, or what you want to say..."
                                value={theirStory}
                                onChange={(e) => setTheirStory(e.target.value)}
                                style={{ ...s.input, minHeight: "160px", resize: "none", lineHeight: "1.6" }}
                            />
                            <div style={s.charCounter}>
                                {theirStory.length} characters
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <label style={s.stepLabel}>Step Four</label>
                        <h1 style={s.heading}>
                            Your <span style={{ color: "#ff6b8a", fontStyle: "italic" }}>precious moments</span>
                        </h1>
                        <p style={s.subtext}>Upload up to 5 photos — they'll appear in your chosen frame</p>

                        <div style={s.gridPhotos}>
                            {photos.map((photo, i) => (
                                <div
                                    key={i}
                                    onClick={() => !photo && handlePhotoUpload(i, 'photo')}
                                    style={s.photoSlot(photo !== null)}
                                >
                                    {photo ? (
                                        <>
                                            <img src={photo} alt={`Moment ${i + 1}`} style={s.photoImg} />
                                            <div style={{ ...s.photoFrame, borderColor: frames[selectedFrame].border }} />
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removePhoto(i, 'photo'); }}
                                                style={s.btnRemovePhoto}
                                            >
                                                ✕
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span style={{ fontSize: "24px", opacity: 0.4 }}>+</span>
                                            <span style={s.photoLabel}>Photo {i + 1}</span>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div style={{ paddingTop: "32px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
                            <p style={s.frameHeader}>Automatically Curated Frames</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                {frames.map((frame) => (
                                    <div
                                        key={frame.id}
                                        style={{ ...s.frameBadge, background: frame.gradient }}
                                    >
                                        {frame.label}
                                    </div>
                                ))}
                            </div>
                            <p style={s.frameNote}>* Frames are automatically curated based on your mood & occasion</p>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <label style={s.stepLabel}>Step Five</label>
                        <h1 style={s.heading}>
                            Create your <span style={{ color: "#ff6b8a", fontStyle: "italic" }}>cinematic moment</span>
                        </h1>
                        <p style={s.subtext}>Choose 5 photos for your personalized video — can be different from frame photos</p>

                        <div style={s.gridPhotos}>
                            {videoPhotos.map((photo, i) => (
                                <div
                                    key={i}
                                    onClick={() => !photo && handlePhotoUpload(i, 'video')}
                                    style={s.photoSlot(photo !== null)}
                                >
                                    {photo ? (
                                        <>
                                            <img src={photo} alt={`Image ${i + 1}`} style={s.photoImg} />
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removePhoto(i, 'video'); }}
                                                style={s.btnRemovePhoto}
                                            >
                                                ✕
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span style={{ fontSize: "20px", opacity: 0.4 }}>+</span>
                                            <span style={s.photoLabel}>Image {i + 1}</span>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div style={{
                            background: 'rgba(233,69,96,0.08)',
                            border: '1px solid rgba(233,69,96,0.2)',
                            borderRadius: '16px',
                            padding: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px'
                        }}>
                            <span style={{ fontSize: '32px' }}>🎬</span>
                            <div>
                                <div style={{
                                    color: '#ff9ab0',
                                    fontFamily: 'sans-serif',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    marginBottom: '4px'
                                }}>
                                    Your video is in good hands
                                </div>
                                <div style={{
                                    color: 'rgba(255,255,255,0.45)',
                                    fontSize: '12px',
                                    lineHeight: '1.7'
                                }}>
                                    Once you complete your order, our team will craft a cinematic video using your photos, tailored to your mood & occasion. It'll be delivered along with your Love Code.
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div>
                        <label style={s.stepLabel}>Step Six</label>
                        <h1 style={s.heading}>
                            Words written <span style={{ color: "#ff6b8a", fontStyle: "italic" }}>by the heart</span>
                        </h1>
                        <p style={s.subtext}>AI crafts a message based on your mood, occasion & story</p>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "40px" }}>
                            {selectedMoods.map(id => {
                                const mood = moodsData.find(m => m.id === id);
                                return (
                                    <div key={id} style={s.chipMoodStatic}>
                                        {mood.emoji} {mood.label}
                                    </div>
                                );
                            })}
                            {selectedOccasion && (
                                <div style={s.chipOccasionStatic}>
                                    {occasions.find(o => o.id === selectedOccasion)?.emoji} {occasions.find(o => o.id === selectedOccasion)?.label}
                                </div>
                            )}
                        </div>

                        {!generatedMessage ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", padding: "48px 0" }}>
                                <button
                                    onClick={generateAIByGroq}
                                    disabled={isGenerating}
                                    style={s.btnAIGenerate(isGenerating)}
                                >
                                    {isGenerating ? (
                                        <>
                                            <div style={s.spinner} />
                                            AI is writing...
                                        </>
                                    ) : (
                                        <>💌 Generate My Message</>
                                    )}
                                </button>
                                <p style={s.poweredBy}>Powered by Groq AI</p>
                            </div>
                        ) : (
                            <div>
                                <div style={s.messageCard}>
                                    <span style={s.quoteMark}>"</span>
                                    {isEditing ? (
                                        <textarea
                                            value={generatedMessage}
                                            onChange={(e) => setGeneratedMessage(e.target.value)}
                                            style={s.messageTextarea}
                                        />
                                    ) : (
                                        <div style={s.messageDisplay}>
                                            {generatedMessage}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
                                    <button
                                        onClick={generateAIByGroq}
                                        disabled={isGenerating}
                                        style={s.btnRegenerate}
                                    >
                                        {isGenerating ? "..." : "↻ Regenerate"}
                                    </button>
                                    <button
                                        onClick={toggleEdit}
                                        style={s.btnEdit}
                                    >
                                        {isEditing ? "✓ Save" : "✏️ Edit"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {step === 6 && (
                    <div>
                        <label style={s.stepLabel}>Step Seven</label>
                        <h1 style={s.heading}>
                            Make it <br />
                            <span style={{ color: "#ff6b8a", fontStyle: "italic" }}>personally yours</span>
                        </h1>

                        <div style={{ marginBottom: "40px" }}>
                            <p style={s.frameHeader}>1. Set your Unlock Code</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={s.inputLabel}>Unlock Code</label>
                                    <input
                                        type="text"
                                        maxLength={4}
                                        placeholder="0000"
                                        value={unlockCode}
                                        onChange={(e) => setUnlockCode(e.target.value.replace(/\D/g, ""))}
                                        style={{ ...s.input, textAlign: "center", letterSpacing: "8px", fontSize: "24px", fontWeight: "bold", color: "#ff6b8a" }}
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={s.inputLabel}>Hint (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. The date we first met..."
                                        value={hintMessage}
                                        onChange={(e) => setHintMessage(e.target.value)}
                                        style={s.input}
                                    />
                                </div>
                            </div>
                            <p style={s.frameNote}>* This code will be required by your partner to open your Love Code</p>
                        </div>

                        <div style={{ marginBottom: "40px" }}>
                            <p style={s.frameHeader}>2. Choose Delivery Method</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                                {deliveryMethods.map(method => (
                                    <div
                                        key={method.id}
                                        onClick={() => setDeliveryMethod(method.id)}
                                        style={s.cardDelivery(deliveryMethod === method.id)}
                                    >
                                        <div style={s.radio(deliveryMethod === method.id)} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: "bold", fontSize: "16px" }}>Send via {method.label}</div>
                                            <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.4)" }}>{method.description}</div>
                                        </div>
                                        <span style={{ fontSize: "24px" }}>
                                            {method.icon}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {deliveryMethod && (
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={s.inputLabel}>Recipient {deliveryMethod === 'email' ? 'Email' : 'Handle'}</label>
                                    <input
                                        type="text"
                                        placeholder={deliveryMethod === 'email' ? "love@example.com" : "@username"}
                                        value={recipientContact}
                                        onChange={(e) => setRecipientContact(e.target.value)}
                                        style={s.input}
                                    />
                                </div>
                            )}
                        </div>

                        <div style={s.scheduleCard}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={s.scheduleLabel}>DELIVERY DATE</label>
                                    <input
                                        type="date"
                                        value={deliveryDate}
                                        onChange={(e) => setDeliveryDate(e.target.value)}
                                        style={s.scheduleInput}
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={s.scheduleLabel}>DELIVERY TIME</label>
                                    <input
                                        type="time"
                                        value={deliveryTime}
                                        onChange={(e) => setDeliveryTime(e.target.value)}
                                        style={s.scheduleInput}
                                    />
                                </div>
                            </div>
                            <span style={s.scheduleNote}>
                                💌 We'll deliver your Love Code exactly at this moment — make it count.
                            </span>
                        </div>
                    </div>
                )}
            </main>

            {/* Navigation Footer */}
            <footer style={s.footer}>
                <div style={s.footerInner}>
                    <button
                        onClick={handleBack}
                        onMouseEnter={() => setHoveredBtn('back')}
                        onMouseLeave={() => setHoveredBtn(null)}
                        style={{
                            ...s.btnBack,
                            opacity: step === 0 ? 0 : 1,
                            pointerEvents: step === 0 ? "none" : "auto",
                            ...(hoveredBtn === 'back' && {
                                borderColor: "rgba(255,255,255,0.35)",
                                color: "rgba(255,255,255,0.9)",
                                transform: "translateX(-3px)"
                            })
                        }}
                    >
                        ← Back
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        onMouseEnter={() => setHoveredBtn('next')}
                        onMouseLeave={() => setHoveredBtn(null)}
                        style={{
                            ...s.btnNext(canProceed()),
                            ...(hoveredBtn === 'next' && canProceed() && {
                                background: "linear-gradient(135deg, #ff2d55, #ff6b8a)",
                                transform: "translateY(-2px) scale(1.02)",
                                boxShadow: "0 12px 35px rgba(233,69,96,0.55)"
                            }),
                            ...(hoveredBtn === 'next' && step === 6 && {
                                transform: "translateY(-3px) scale(1.03)",
                                boxShadow: "0 16px 45px rgba(233,69,96,0.6)",
                                background: "linear-gradient(135deg, #ff2d55, #ff8fa3)",
                                letterSpacing: "0.8px"
                            })
                        }}
                    >
                        {step === 6 ? "Preview & Pay ₹99 💗" : step === 4 ? "Continue →" : "Continue →"}
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default TrueLovePlan;
