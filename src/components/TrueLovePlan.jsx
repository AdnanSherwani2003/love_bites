import { useState, useRef, useEffect } from "react";
import LoveBitesLogo from "./LoveBitesLogo";
import { removeBackground } from "../lib/removeBackground";
import { trackEvent } from "../lib/analytics";

const TrueLovePlan = ({ 
    onComplete, 
    features = { ai_magic: true }, 
    moods: externalMoods = [], 
    occasions: externalOccasions = [] 
}) => {
    // --- STATE VARIABLES ---
    const [step, setStep] = useState(0);
    const [createFor, setCreateFor] = useState(null); // 'her' or 'him'
    const [relationship, setRelationship] = useState(null); // 'partner', 'family', 'relative', 'friend', or custom string
    const [customRelationship, setCustomRelationship] = useState(""); // for custom relationship input
    const [selectedMoods, setSelectedMoods] = useState([]); // max 3
    const [selectedOccasion, setSelectedOccasion] = useState(null);
    const [yourName, setYourName] = useState("");
    const [partnerName, setPartnerName] = useState("");
    const [theirStory, setTheirStory] = useState("");
    const [photos, setPhotos] = useState([null, null, null, null, null]);
    const [photoMemories, setPhotoMemories] = useState(['', '', '', '', '']);
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
    const [previewImage, setPreviewImage] = useState(null);
    const [partnerPhoto, setPartnerPhoto] = useState(null);
    const [partnerPhotoPreviewUrl, setPartnerPhotoPreviewUrl] = useState(null);
    const [processedPhotoUrl, setProcessedPhotoUrl] = useState(null);
    const [bgRemoving, setBgRemoving] = useState(false);
    const [processingStatus, setProcessingStatus] = useState("");
    const photoRef = useRef(null);
    const partnerPhotoRef = useRef(null);
    const videoPhotoRef = useRef(null);

    const THEME = {
        bg: "linear-gradient(160deg, #0d0008 0%, #1a0010 40%, #0d0005 100%)",
        maroon: "#9b1a3a",
        rose: "#c4304f",
        cream: "#fff8f0",
        serif: "Georgia, serif",
        sans: "sans-serif",
    };

    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = `
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(8px); }
                to   { opacity: 1; transform: translateY(0);   }
            }
        `;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); };
    }, []);

    // --- DATA ---
    const frames = [
        { id: "rose_garden", label: "Rose Garden", gradient: "linear-gradient(135deg, #ff6b8a, #ff9a9e)", border: "#ff6b8a" },
        { id: "midnight_romance", label: "Midnight Romance", gradient: "linear-gradient(135deg, #1a1a2e, #e94560)", border: "#e94560" },
        { id: "golden_hour", label: "Golden Hour", gradient: "linear-gradient(135deg, #f7971e, #ffd200)", border: "#f7971e" },
        { id: "velvet_dream", label: "Velvet Dream", gradient: "linear-gradient(135deg, #667eea, #f093fb)", border: "#a855f7" },
        { id: "cherry_blossom", label: "Cherry Blossom", gradient: "linear-gradient(135deg, #f8a5c2, #f78fb3)", border: "#f78fb3" },
    ];

    const moodsData = externalMoods.length > 0 ? externalMoods : [
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
        { id: "passionate", label: "Passionate", subtitle: "My love for you burns intensely", emoji: "🔥", category: "Deep" }
    ];

    const occasions = externalOccasions.length > 0 ? externalOccasions : [
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
        if (bgRemoving) return false;
        switch (step) {
            case 0: return createFor !== null;
            case 1: return relationship !== null && (relationship !== 'custom' || customRelationship.trim() !== '');
            case 2: return selectedMoods.length > 0;
            case 3: return selectedOccasion !== null;
            case 4: return theirStory.trim().length > 10 && yourName.trim().length > 0 && partnerName.trim().length > 0;
            case 5: return photos.some(p => p !== null);
            case 6: return true; // skippable
            case 7: return generatedMessage.length > 0;
            case 8: return unlockCode.length === 4 && deliveryMethod !== null;
            default: return false;
        }
    };

    const handleNext = async () => {
        if (step === 6 && partnerPhoto && !processedPhotoUrl) {
            setBgRemoving(true);
            setProcessingStatus("removing background");
            
            const statusTimer = setInterval(() => {
                setProcessingStatus(prev => {
                    if (prev === "removing background") return "almost ready...";
                    if (prev === "almost ready...") return "finishing up...";
                    return prev;
                });
            }, 3000);

            try {
                const resultUrl = await removeBackground(partnerPhoto);
                setProcessedPhotoUrl(resultUrl);
                setStep(s => s + 1);
            } catch (error) {
                console.error("Background removal failed:", error);
                setProcessedPhotoUrl(partnerPhotoPreviewUrl);
                setStep(s => s + 1);
            } finally {
                clearInterval(statusTimer);
                setBgRemoving(false);
            }
            return;
        }

        if (step === 8 && canProceed()) {
            if (onComplete) {
                onComplete({
                    createFor,
                    relationship,
                    recipientName: partnerName,
                    senderName: yourName,
                    selectedMoods: selectedMoods.map(id => moodsData.find(m => m.id === id)),
                    occasion: occasions.find(o => o.id === selectedOccasion),
                    hintMessage: hintMessage,
                    unlockCode: unlockCode,
                    generatedMessage: generatedMessage,
                    photos: photos,
                    photoMemories: photoMemories,
                    partnerPhotoUrl: processedPhotoUrl // Pass the processed photo URL
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

    const handleFileChange = async (e, type) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const readAsDataURL = (file) => new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.readAsDataURL(file);
        });

        if (type === 'photo') {
            const newPhotos = [...photos];
            let currentSlot = activePhotoSlot;
            
            for (let i = 0; i < files.length; i++) {
                if (i > 0) {
                    currentSlot = newPhotos.findIndex(p => p === null);
                }
                if (currentSlot === -1 || currentSlot >= 5) break; // no slots left
                
                newPhotos[currentSlot] = await readAsDataURL(files[i]);
            }
            setPhotos(newPhotos);
        } else {
            const newVideoPhotos = [...videoPhotos];
            let currentSlot = activeVideoSlot;
            
            for (let i = 0; i < files.length; i++) {
                if (i > 0) {
                    currentSlot = newVideoPhotos.findIndex(p => p === null);
                }
                if (currentSlot === -1 || currentSlot >= 5) break; 
                
                newVideoPhotos[currentSlot] = await readAsDataURL(files[i]);
            }
            setVideoPhotos(newVideoPhotos);
        }
        
        e.target.value = null;
    };

    const removePhoto = (index, type) => {
        if (type === 'photo') {
            const newPhotos = [...photos];
            newPhotos[index] = null;
            setPhotos(newPhotos);
            
            // Also reset the memory when photo is removed
            const newMemories = [...photoMemories];
            newMemories[index] = '';
            setPhotoMemories(newMemories);
        } else {
            const newVideoPhotos = [...videoPhotos];
            newVideoPhotos[index] = null;
            setVideoPhotos(newVideoPhotos);
        }
    };

    const updateMemory = (index, value) => {
        const updated = [...photoMemories];
        updated[index] = value.slice(0, 120);
        setPhotoMemories(updated);
    };

    const getPlaceholder = (index) => {
        const placeholders = [
            "Where it all began...",
            "A moment I'll never forget...",
            "This day felt like magic...",
            "Our favourite place...",
            "I wish we could go back...",
        ];
        return placeholders[index];
    };

    const generateVideo = () => {
        setVideoGenerating(true);
        setTimeout(() => {
            setVideoGenerating(false);
            setVideoReady(true);
        }, 3000);
    };

    const generateAIMessage = async () => {
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
                const errorMessage = data.details || data.error || 'Unknown server error occurred';
                throw new Error(errorMessage);
            }

            if (!data.message) {
                console.error('Invalid response format:', data);
                throw new Error('Invalid response from server: missing message');
            }

            setGeneratedMessage(data.message);
            trackEvent('ai_generate', { tier: '99' }, '99');
        } catch (error) {
            console.error("Error generating message:", error);
            setGeneratedMessage("My dearest, words cannot fully capture the depth of my love for you, but please know that you are my heart's greatest joy and my soul's eternal partner. Every moment with you is a gift I cherish more than words can say. (Error generating message, but our love remains true!)");
        } finally {
            setIsGenerating(false);
        }
    };

    const resizeImage = (file, maxSize) => {
        return new Promise((resolve) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width, h = img.height;
                if (w > maxSize || h > maxSize) {
                    if (w > h) {
                        h = Math.round(h * maxSize / w);
                        w = maxSize;
                    } else {
                        w = Math.round(w * maxSize / h);
                        h = maxSize;
                    }
                }
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92);
                URL.revokeObjectURL(url);
            };
            img.src = url;
        });
    };

    const handlePartnerPhotoSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPartnerPhoto(file);
            setPartnerPhotoPreviewUrl(url);
            setProcessedPhotoUrl(null); // Reset processed when new is chosen
        }
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    // --- STYLES OBJECT ---
    const s = {
        wrapper: {
            minHeight: "100vh",
            background: THEME.bg,
            color: THEME.cream,
            fontFamily: THEME.sans,
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
            fontFamily: THEME.serif,
            fontStyle: "italic",
            fontSize: "24px",
            fontWeight: "bold",
            color: THEME.rose,
            cursor: "pointer"
        },
        badge: {
            background: "linear-gradient(135deg, #9b1a3a, #c4304f)",
            padding: "4px 12px",
            borderRadius: "9999px",
            fontSize: "10px",
            letterSpacing: "2px",
            fontWeight: "bold",
            color: "#fff",
            boxShadow: "0 4px 15px rgba(155,26,58,0.3)"
        },
        progressBox: {
            marginBottom: "40px", width: "100%", maxWidth: "780px", padding: "0 20px", zIndex: 10
        },
        progressGrid: {
            display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "6px", marginBottom: "8px"
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
        stepTag: {
            color: THEME.rose,
            letterSpacing: "3px",
            fontSize: "12px",
            fontWeight: "bold",
            marginBottom: "8px",
            display: "block",
            textTransform: "uppercase"
        },
        heading: {
            fontSize: "clamp(24px, 5vw, 40px)",
            marginBottom: "16px",
            lineHeight: 1.2,
            color: "#fff",
            fontFamily: THEME.serif
        },
        subheading: {
            color: "rgba(255,248,240,0.5)",
            fontSize: "16px",
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
            background: isEnabled ? `linear-gradient(90deg, ${THEME.maroon}, ${THEME.rose})` : "rgba(255, 255, 255, 0.05)",
            color: isEnabled ? "#fff" : "rgba(255, 255, 255, 0.2)",
            cursor: isEnabled ? "pointer" : "not-allowed",
            border: "none",
            boxShadow: isEnabled ? `0 8px 30px rgba(155, 26, 58, 0.4)` : "none",
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
            outline: "none",
            cursor: "pointer"
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
            <style>{`
                @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
                * { box-sizing: border-box; }
                @media (max-width: 768px) {
                    .lb99-side-text { display: none !important; }
                    .lb99-container { max-width: 100% !important; padding: 0 12px !important; }
                    .lb99-progress { gap: 4px !important; }
                    .lb99-footer { padding: 14px !important; }
                    .lb99-nav-inner { padding: 0 !important; flex-direction: row !important; }
                    .lb99-btn-next, .lb99-btn-back { padding: 12px 22px !important; font-size: 0.88rem !important; }
                }
                @media (max-width: 480px) {
                    .lb99-container { padding: 0 8px !important; }
                    .lb99-btn-next, .lb99-btn-back { padding: 10px 16px !important; font-size: 0.82rem !important; }
                }
            `}</style>
            {/* Hidden Inputs */}
            <input type="file" hidden ref={photoRef} accept="image/*" multiple onChange={(e) => handleFileChange(e, 'photo')} />

            <input type="file" hidden ref={partnerPhotoRef} accept="image/*" onChange={handlePartnerPhotoSelect} />
            <input type="file" hidden ref={videoPhotoRef} accept="image/*" multiple onChange={(e) => handleFileChange(e, 'video')} />

            {/* Image Preview Modal */}
            {previewImage && (
                <div 
                    onClick={() => setPreviewImage(null)}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        backdropFilter: 'blur(5px)'
                    }}
                >
                    <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }}
                            style={{
                                position: 'absolute',
                                top: '-40px', right: 0,
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                fontSize: '30px',
                                cursor: 'pointer'
                            }}
                        >×</button>
                        <img 
                            src={previewImage} 
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '90vh', 
                                objectFit: 'contain',
                                borderRadius: '12px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                            }} 
                            alt="Full-size preview"
                        />
                    </div>
                </div>
            )}

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
            <div style={{ ...s.orb, top: "-10%", right: "-10%", background: "rgba(155, 26, 58, 0.15)" }} />
            <div style={{ ...s.orb, bottom: "-10%", left: "-10%", background: "rgba(196, 48, 79, 0.12)" }} />

            {/* Header */}
            <header style={s.header}>
                <div style={s.logo} onClick={() => window.location.href = "/"}>
                    <LoveBitesLogo size={24} />
                </div>
                <div style={s.badge}>
                    TRUE LOVE ₹99
                </div>
            </header>

            {/* Progress Bar */}
            {/* Progress Bar */}
            <div style={s.progressBox}>
                <div style={s.progressGrid}>
                    {Array(8).fill(0).map((_, i) => (
                        <div key={i} style={s.stepBar(i)} />
                    ))}
                </div>
                <div style={s.stepCounter}>{step + 1} of 8 steps</div>
            </div>

            {/* Main Content Area */}
            <main style={s.main}>
                {step === 0 && (
                    <div>
                        <div style={{ textAlign: "center", marginBottom: "32px" }}>
                            <div style={s.stepTag}>BEGINNING</div>
                            <h1 style={s.heading}>Who are you <i style={{ color: THEME.rose }}>creating this for?</i></h1>
                            <p style={s.subheading}>Let's personalize the experience</p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "340px", margin: "0 auto" }}>
                            {[
                                { id: 'her', label: 'Create for Her' },
                                { id: 'him', label: 'Create for Him' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setCreateFor(opt.id)}
                                    style={{
                                        ...s.cardMood(createFor === opt.id),
                                        padding: '20px 24px',
                                        textAlign: 'center',
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <div style={{ 
                                        fontWeight: "bold", fontSize: "16px", letterSpacing: "0.5px",
                                        fontFamily: "sans-serif"
                                    }}>{opt.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div>
                        <div style={{ textAlign: "center", marginBottom: "32px" }}>
                            <div style={s.stepTag}>RELATIONSHIP</div>
                            <h1 style={s.heading}>What's your <i style={{ color: THEME.rose }}>relationship?</i></h1>
                            <p style={s.subheading}>Help us personalize this experience</p>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", maxWidth: "400px", margin: "0 auto" }}>
                            {[
                                { id: 'partner', label: 'Partner', sub: '(girlfriend/boyfriend/wife/husband)' },
                                { id: 'family', label: 'Family', sub: '(parents/siblings)' },
                                { id: 'relative', label: 'Relative', sub: '(cousins, etc.)' },
                                { id: 'friend', label: 'Friend', sub: '' }
                            ].map(rel => (
                                <div
                                    key={rel.id}
                                    onClick={() => {
                                        setRelationship(rel.id);
                                        setCustomRelationship('');
                                    }}
                                    style={{
                                        background: relationship === rel.id ? "rgba(155,26,58,0.25)" : "rgba(155,26,58,0.08)",
                                        border: relationship === rel.id ? `1px solid ${THEME.rose}` : "1px solid rgba(196,48,79,0.25)",
                                        borderRadius: "16px",
                                        padding: "20px 16px",
                                        cursor: "pointer",
                                        textAlign: "center",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    <div style={{ fontWeight: "bold", fontSize: "16px", color: relationship === rel.id ? "white" : "rgba(255,248,240,0.8)", marginBottom: "4px" }}>
                                        {rel.label}
                                    </div>
                                    {rel.sub && (
                                        <div style={{ fontSize: "12px", color: "rgba(255,248,240,0.5)", fontStyle: "italic" }}>
                                            {rel.sub}
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {/* Custom option - full width */}
                            <div
                                onClick={() => {
                                    setRelationship('custom');
                                }}
                                style={{
                                    gridColumn: "1 / -1",
                                    background: relationship === 'custom' ? "rgba(155,26,58,0.25)" : "rgba(155,26,58,0.08)",
                                    border: relationship === 'custom' ? `1px solid ${THEME.rose}` : "1px solid rgba(196,48,79,0.25)",
                                    borderRadius: "16px",
                                    padding: "20px 16px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <div style={{ fontWeight: "bold", fontSize: "16px", color: relationship === 'custom' ? "white" : "rgba(255,248,240,0.8)" }}>
                                    Custom
                                </div>
                            </div>
                        </div>

                        {/* Custom input field */}
                        {relationship === 'custom' && (
                            <div style={{ marginTop: "12px", maxWidth: "400px", margin: "12px auto 0" }}>
                                <input
                                    type="text"
                                    value={customRelationship}
                                    onChange={(e) => setCustomRelationship(e.target.value)}
                                    placeholder="Describe your relationship..."
                                    style={{
                                        width: "100%",
                                        background: "rgba(255,248,240,0.05)",
                                        border: `1px solid rgba(196,48,79,0.3)`,
                                        borderRadius: "12px",
                                        padding: "12px 16px",
                                        color: "#fff8f0",
                                        fontSize: "14px",
                                        outline: "none",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <div style={{ textAlign: "center", marginBottom: "32px" }}>
                            <div style={s.stepTag}>STEP TWO</div>
                            <h1 style={s.heading}>How does your heart feel?</h1>
                            <p style={s.subheading}>Choose up to 3 moods that capture this moment</p>
                        </div>

                        {/* Tabs */}
                        <div style={s.tabContainer}>
                            {["Romantic", "Emotional", "Fun", "Deep"].map(tab => (
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

                {step === 3 && (
                    <div>
                        <div style={{ textAlign: "center", marginBottom: "32px" }}>
                            <div style={s.stepTag}>STEP THREE</div>
                            <h1 style={s.heading}>
                                What's the <i style={{ color: THEME.rose }}>occasion?</i>
                            </h1>
                            <p style={s.subheading}>Pick one occasion for your Love Code</p>
                        </div>

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

                {step === 4 && (
                    <div style={{ animation: "fadeInUp 0.6s both" }}>
                        <div style={{ textAlign: "center", marginBottom: "32px" }}>
                            <div style={s.stepTag}>STEP FOUR</div>
                            <h1 style={s.heading}>
                                Their <i style={{ color: THEME.rose }}>beautiful story</i>
                            </h1>
                            <p style={s.subheading}>Tell us about your connection and what makes them special</p>
                        </div>

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

                {step === 5 && (
                    <div style={{ animation: "fadeInUp 0.6s both" }}>
                        <div style={{ textAlign: "center", marginBottom: "32px" }}>
                            <div style={s.stepTag}>STEP FIVE</div>
                            <h1 style={s.heading}>Add your <i style={{ color: THEME.rose }}>precious moments</i></h1>
                            <p style={s.subheading}>Upload up to 5 photos — they'll appear in your chosen frame</p>
                        </div>

                        <div style={{
                            display: window.innerWidth < 600 ? "grid" : "flex",
                            flexDirection: "row",
                            gap: window.innerWidth < 600 ? 10 : 12,
                            width: "100%",
                            maxWidth: 760,
                            flexWrap: "nowrap",
                            overflow: "visible",
                            gridTemplateColumns: window.innerWidth < 600 ? "repeat(2, 1fr)" : "none",
                        }}>
                            {[0, 1, 2, 3, 4].map(index => (
                                <div key={index} style={{
                                    flex: window.innerWidth < 600 ? "none" : "1 1 0",
                                    minWidth: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 6,
                                    gridColumn: window.innerWidth < 600 && index === 4 ? "span 2" : "span 1",
                                }}>

                                    {/* PHOTO SLOT */}
                                    <div style={{
                                        width: "100%",
                                        aspectRatio: "1/1",
                                        borderRadius: 10,
                                        border: photos[index] 
                                            ? "1.5px solid rgba(196,48,79,0.5)"
                                            : "1.5px dashed rgba(255,255,255,0.1)",
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        position: "relative",
                                        background: "rgba(255,255,255,0.04)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexDirection: "column",
                                        gap: 8,
                                        transition: "border 0.3s",
                                    }}
                                        onClick={() => !photos[index] && handlePhotoUpload(index, 'photo')}
                                    >
                                        {photos[index] ? (
                                            <>
                                                <img 
                                                    src={photos[index]} 
                                                    alt={`Moment ${index + 1}`} 
                                                    onClick={(e) => { e.stopPropagation(); setPreviewImage(photos[index]); }}
                                                    style={{ 
                                                        width: "100%", 
                                                        height: "100%", 
                                                        objectFit: "cover",
                                                        filter: "sepia(0.15) contrast(1.05)",
                                                        cursor: "pointer"
                                                    }} 
                                                />
                                                <div style={{ 
                                                    position: "absolute",
                                                    inset: 0,
                                                    border: "3px solid",
                                                    borderColor: frames[selectedFrame].border,
                                                    pointerEvents: "none",
                                                    opacity: 0.6
                                                }} />
                                                <div
                                                    onClick={(e) => { e.stopPropagation(); removePhoto(index, 'photo'); }}
                                                    style={{
                                                        position: "absolute",
                                                        top: 6, right: 6,
                                                        width: 20, height: 20,
                                                        borderRadius: "50%",
                                                        background: "rgba(0,0,0,0.6)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        cursor: "pointer",
                                                        fontSize: 10,
                                                        color: "white",
                                                    }}
                                                >✕</div>
                                            </>
                                        ) : (
                                            <>
                                                <div style={{
                                                    fontSize: 16,
                                                    color: "rgba(255,255,255,0.2)",
                                                }}>+</div>
                                                <div style={{
                                                    fontSize: 8,
                                                    letterSpacing: 1.5,
                                                    color: "rgba(255,255,255,0.18)",
                                                    textTransform: "uppercase",
                                                    fontFamily: "sans-serif",
                                                }}>Photo {index + 1}</div>
                                            </>
                                        )}
                                    </div>

                                    {/* MEMORY INPUT — only when photo uploaded */}
                                    {photos[index] && (
                                        <div style={{ width: "100%" }}>
                                            <div style={{
                                                fontSize: 7,
                                                letterSpacing: 1.5,
                                                color: "rgba(196,48,79,0.5)",
                                                textTransform: "uppercase",
                                                fontFamily: "sans-serif",
                                                marginBottom: 3,
                                            }}>✦ memory</div>
                                            <textarea
                                                value={photoMemories[index]}
                                                onChange={e => updateMemory(index, e.target.value)}
                                                placeholder={getPlaceholder(index)}
                                                maxLength={120}
                                                rows={2}
                                                style={{
                                                    width: "100%",
                                                    background: "rgba(255,255,255,0.04)",
                                                    border: "1px solid rgba(196,48,79,0.18)",
                                                    borderRadius: 6,
                                                    padding: "5px 8px",
                                                    color: "#fff8f0",
                                                    fontSize: 10,
                                                    fontFamily: "Georgia, serif",
                                                    fontStyle: "italic",
                                                    lineHeight: 1.4,
                                                    resize: "none",
                                                    outline: "none",
                                                }}
                                                onFocus={e =>
                                                    e.target.style.border =
                                                    "1px solid rgba(196,48,79,0.55)"
                                                }
                                                onBlur={e =>
                                                    e.target.style.border =
                                                    "1px solid rgba(196,48,79,0.18)"
                                                }
                                            />
                                            <div style={{
                                                fontSize: 7,
                                                color: "rgba(255,255,255,0.18)",
                                                textAlign: "right",
                                                fontFamily: "sans-serif",
                                                marginTop: 2,
                                            }}>
                                                {photoMemories[index].length}/120
                                            </div>
                                        </div>
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

                {step === 6 && (
                    <div style={{ animation: "fadeInUp 0.6s both", textAlign: 'center', padding: '40px 0' }}>
                        <label style={s.stepLabel}>Step Six
                            <span style={{
                                fontSize: "9px", letterSpacing: "1.5px",
                                color: 'rgba(255,255,255,0.2)',
                                textTransform: 'uppercase',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 20, padding: '2px 8px',
                                marginLeft: 8, verticalAlign: 'middle'
                            }}>optional</span>
                        </label>
                        <h1 style={s.heading}>
                            Add a <span style={{ color: "#ff6b8a", fontStyle: "italic" }}>photo of them</span> ✦
                        </h1>
                        <p style={{
                            fontSize: 16,
                            color: 'rgba(255,255,255,0.5)',
                            fontFamily: 'Cormorant Garamond, serif',
                            fontStyle: 'italic',
                            maxWidth: '480px',
                            margin: '0 auto 48px',
                            lineHeight: 1.6
                        }}>
                            We'll remove the background and place them as a beautiful, subtle presence in the background of your LoveBite
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: '360px' }}>
                            <div 
                                onClick={() => partnerPhotoRef.current.click()}
                                onMouseEnter={(e) => {
                                    if (!partnerPhotoPreviewUrl) {
                                        e.currentTarget.style.border = "1.5px dashed rgba(196,48,79,0.55)";
                                        e.currentTarget.style.background = "rgba(196,48,79,0.04)";
                                        e.currentTarget.style.transform = "translateY(-4px)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!partnerPhotoPreviewUrl) {
                                        e.currentTarget.style.border = "1.5px dashed rgba(196,48,79,0.3)";
                                        e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }
                                }}
                                style={{
                                    width: "280px", height: "340px",
                                    borderRadius: "24px",
                                    border: partnerPhotoPreviewUrl ? "1.5px solid rgba(196,48,79,0.5)" : "1.5px dashed rgba(196,48,79,0.3)",
                                    background: "rgba(255,255,255,0.025)",
                                    display: "flex", flexDirection: "column",
                                    alignItems: "center", justifyContent: "center",
                                    cursor: "pointer", gap: "10px",
                                    position: "relative", overflow: "hidden",
                                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                    boxShadow: partnerPhotoPreviewUrl ? "0 25px 50px -12px rgba(0,0,0,0.5)" : "none"
                                }}
                            >
                                {partnerPhotoPreviewUrl ? (
                                    <>
                                        <img 
                                            src={partnerPhotoPreviewUrl} 
                                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "22px" }} 
                                            alt="Partner preview" 
                                        />
                                        <button
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                setPartnerPhoto(null); 
                                                setPartnerPhotoPreviewUrl(null); 
                                                setProcessedPhotoUrl(null);
                                            }}
                                            style={{
                                                position: "absolute",
                                                top: "14px", right: "14px",
                                                width: "32px", height: "32px",
                                                background: "rgba(0,0,0,0.75)",
                                                backdropFilter: 'blur(8px)',
                                                borderRadius: "50%", border: "none", color: "white", fontSize: "16px", cursor: "pointer",
                                                zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'all 0.2s'
                                            }}
                                        >✕</button>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ fontSize: "56px", opacity: 0.25, marginBottom: 16 }}>👤</div>
                                        <div style={{ fontSize: "13px", letterSpacing: "3px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 'bold' }}>Choose Photo</div>
                                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", letterSpacing: "1px", marginTop: 8 }}>JPG, PNG or WEBP</div>
                                    </>
                                )}
                            </div>
                            
                            {partnerPhotoPreviewUrl && (
                                <div style={{
                                    display: 'flex', alignItems: 'center',
                                    gap: "10px", marginTop: "32px",
                                    padding: '10px 20px', borderRadius: '24px',
                                    background: 'rgba(34,197,94,0.08)',
                                    border: '1px solid rgba(34,197,94,0.15)',
                                    animation: 'fadeIn 0.5s ease both'
                                }}>
                                    <div style={{
                                        width: "8px", height: "8px", borderRadius: '50%',
                                        background: '#22c55e',
                                        boxShadow: '0 0 12px #22c55e'
                                    }}/>
                                    <span style={{
                                        fontSize: "11px", letterSpacing: "2px",
                                        color: 'rgba(34,197,94,0.9)',
                                        textTransform: 'uppercase',
                                        fontWeight: 'bold'
                                    }}>
                                        background will be auto-removed
                                    </span>
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: '80px', opacity: 0.3 }}>
                             <p style={{ fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase' }}>
                                 ✦ skippable ✦
                             </p>
                        </div>
                    </div>
                )}

                {step === 7 && (
                    <div>
                        <label style={s.stepLabel}>Step Seven</label>
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
                                {features.ai_magic ? (
                                    <>
                                        <button
                                            onClick={generateAIMessage}
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
                                    </>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px dashed rgba(255,107,138,0.3)' }}>
                                        <p style={{ color: '#ff6b8a', fontSize: '14px', marginBottom: '8px' }}>✨ AI Magic is currently resting.</p>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Please write your message manually below.</p>
                                        <button 
                                            onClick={() => setGeneratedMessage("My Dearest, ")}
                                            style={{ marginTop: '16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
                                        >
                                            Write Manually
                                        </button>
                                    </div>
                                )}
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
                                        onClick={generateAIMessage}
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
                {step === 8 && (
                    <div>
                        <div style={{ textAlign: "center", marginBottom: "32px" }}>
                            <div style={s.stepTag}>FINAL STEP</div>
                            <h1 style={s.heading}>
                                Make it <i style={{ color: THEME.rose }}>personally yours</i>
                            </h1>
                        </div>

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
                                        style={{ ...s.input, textAlign: "center", letterSpacing: "8px", fontSize: "24px", fontWeight: "bold", color: THEME.rose }}
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
                                        onClick={(e) => e.target.showPicker()}
                                        style={s.scheduleInput}
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={s.scheduleLabel}>DELIVERY TIME</label>
                                    <input
                                        type="time"
                                        value={deliveryTime}
                                        onChange={(e) => setDeliveryTime(e.target.value)}
                                        onClick={(e) => e.target.showPicker()}
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
                                background: `linear-gradient(135deg, ${THEME.maroon}, ${THEME.rose})`,
                                transform: "translateY(-2px) scale(1.02)",
                                boxShadow: `0 12px 35px rgba(155, 26, 58, 0.55)`
                            }),
                            minWidth: "160px",
                            justifyContent: "center"
                        }}
                    >
                        {bgRemoving ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                                <div style={{
                                    width: "16px", height: "16px",
                                    borderRadius: "50%",
                                    border: "2px solid rgba(255,255,255,0.2)",
                                    borderTop: "2px solid white",
                                    animation: "spin 1s linear infinite",
                                }}/>
                                <span style={{ fontSize: "9px", textTransform: "uppercase" }}>Processing...</span>
                            </div>
                        ) : (
                            step === 8 ? "Preview & Pay ₹99 💗" : "Next →"
                        )}
                    </button>
                    {bgRemoving && (
                        <div style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(13,0,8,0.9)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1000,
                            gap: 16
                        }}>
                             <div style={{
                                width: 44, height: 44,
                                borderRadius: '50%',
                                border: '3px solid rgba(196,48,79,0.15)',
                                borderTop: '3px solid #c4304f',
                                animation: 'spin 1s linear infinite',
                            }}/>
                            <div style={{
                                fontSize: 18,
                                color: 'rgba(255,255,255,0.8)',
                                fontFamily: 'Cormorant Garamond, serif',
                                fontStyle: 'italic',
                                letterSpacing: '0.5px',
                            }}>
                                Preparing your LoveBite...
                            </div>
                            <div style={{
                                fontSize: "11px",
                                color: 'rgba(255,255,255,0.3)',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                textAlign: 'center',
                                marginTop: "10px"
                            }}>
                                ✨ {processingStatus}
                            </div>
                        </div>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default TrueLovePlan;
