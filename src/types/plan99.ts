export interface Plan99FormData {
    yourName: string;
    partnerName: string;
    partnerDesc: string;
    occasion: string;
    selectedMoods: string[];
    aiMessage: string;
    framePhotos: File[];
    videoPhotos: File[];
    unlockCode: string;
    unlockHint: string;
    deliveryMethod: 'link' | 'whatsapp' | 'email' | 'instagram';
    deliveryContact: string;
    sendNow: boolean;
    scheduledDate?: string;
    scheduledTime?: string;
}
