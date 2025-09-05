export const extractYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
};

export const fetchVideoInfo = async (videoId: string) => {
  // Since we can't access YouTube API without a key, we'll simulate the response
  // In production, you'd use the YouTube Data API
  
  // For demo purposes, we'll extract some info from the thumbnail and use placeholder data
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    title: `Video ${videoId.substring(0, 8)}...`, // Placeholder title
    thumbnail,
    duration: '0', // Placeholder duration
  };
};

export const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};