import os
from googleapiclient.discovery import build
from datetime import timedelta

class YouTubeAPI:
    def __init__(self):
        self.youtube = build(
            'youtube', 
            'v3', 
            developerKey=os.getenv('YOUTUBE_API_KEY')
        )

    def get_video_details(self, video_id):
        try:
            response = self.youtube.videos().list(
                part='snippet,contentDetails',
                id=video_id
            ).execute()

            if not response['items']:
                return None

            video_data = response['items'][0]
            snippet = video_data['snippet']
            content_details = video_data['contentDetails']

            # Convert duration from ISO 8601 format
            duration = self._parse_duration(content_details['duration'])

            return {
                'title': snippet['title'],
                'description': snippet['description'],
                'thumbnail_url': snippet['thumbnails']['high']['url'],
                'duration': duration
            }
        except Exception as e:
            print(f"Error fetching video details: {e}")
            return None

    def search_videos(self, query, max_results=25):
        try:
            response = self.youtube.search().list(
                q=query,
                part='snippet',
                type='video',
                maxResults=max_results
            ).execute()

            videos = []
            for item in response['items']:
                video_data = {
                    'youtube_id': item['id']['videoId'],
                    'title': item['snippet']['title'],
                    'description': item['snippet']['description'],
                    'thumbnail_url': item['snippet']['thumbnails']['high']['url']
                }
                videos.append(video_data)

            return videos
        except Exception as e:
            print(f"Error searching videos: {e}")
            return []

    def _parse_duration(self, duration):
        """Convert ISO 8601 duration to HH:MM:SS format"""
        # Remove 'PT' from start
        duration = duration[2:]
        
        hours = '00'
        minutes = '00'
        seconds = '00'

        # Extract hours, minutes, seconds
        if 'H' in duration:
            hours, duration = duration.split('H')
            hours = hours.zfill(2)
        if 'M' in duration:
            minutes, duration = duration.split('M')
            minutes = minutes.zfill(2)
        if 'S' in duration:
            seconds = duration.replace('S', '').zfill(2)

        return f"{hours}:{minutes}:{seconds}"
