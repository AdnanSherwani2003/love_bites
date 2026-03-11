export const dataURLtoFile = (dataurl: string, filename: string) => {
    if (!dataurl || !dataurl.includes(',')) return null;
    let arr = dataurl.split(','),
        mimeMatch = arr[0].match(/:(.*?);/),
        mime = mimeMatch ? mimeMatch[1] : 'image/jpeg',
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}
