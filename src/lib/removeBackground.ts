export async function removeBackground(
  imageFile: File
): Promise<string> {
  // Step 1: resize to max 1500px
  const resized = await resizeImage(imageFile, 1500)
  
  // Step 2: call remove.bg API
  const formData = new FormData()
  formData.append('image_file', resized)
  formData.append('size', 'auto')
  
  const apiKey = process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY;
  
  if (!apiKey) {
    console.warn('Remove.bg API key is missing from .env.local');
    // We throw to handle the fallback in the UI
    throw new Error('API_KEY_MISSING');
  }

  const response = await fetch(
    'https://api.remove.bg/v1.0/removebg',
    {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey
      },
      body: formData
    }
  )
  
  if (!response.ok) {
    let errorDetail = 'Unknown error';
    try {
      const errorData = await response.json();
      errorDetail = JSON.stringify(errorData);
    } catch (e) {
      errorDetail = await response.text().catch(() => 'Could not read response text');
    }
    console.error('Remove.bg api error:', response.status, errorDetail);
    throw new Error(`Background removal failed: ${response.status} ${errorDetail}`);
  }
  
  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

async function resizeImage(
  file: File, 
  maxSize: number
): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let w = img.width, h = img.height
      if (w > maxSize || h > maxSize) {
        if (w > h) {
          h = Math.round(h * maxSize / w)
          w = maxSize;
        } else {
          w = Math.round(w * maxSize / h)
          h = maxSize;
        }
      }
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)
      canvas.toBlob(
        (blob) => resolve(blob!),
        'image/jpeg', 0.92
      )
      URL.revokeObjectURL(url)
    }
    img.src = url
  })
}
