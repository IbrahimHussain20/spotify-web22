import { BrowseCategory, Track } from '@/types';

function toSeconds(d: string): number {
  const parts = d.split(':').map((p) => parseInt(p, 10));
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

export const ALL_TRACKS: Track[] = [
  { id: '2Vv-BfVoq4g', title: 'Perfect', artist: 'Ed Sheeran', duration: '4:42' },
  { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran', duration: '4:24' },
  { id: 'hT_nvWreIhg', title: 'Counting Stars', artist: 'OneRepublic', duration: '4:17' },
  { id: 'kJQP7kiw5Fk', title: 'Despacito', artist: 'Luis Fonsi', duration: '4:42' },
  { id: '09R8_2nJtjg', title: 'Sugar', artist: 'Maroon 5', duration: '5:02' },
  { id: 'OPf0YbXqDm0', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', duration: '4:31' },
  { id: 'fJ9rUzIMcZQ', title: 'Bohemian Rhapsody', artist: 'Queen', duration: '5:59' },
  { id: 'RgKAFK5djSk', title: 'See You Again', artist: 'Wiz Khalifa ft. Charlie Puth', duration: '3:50' },
  { id: 'YQHsXMglC9A', title: 'Hello', artist: 'Adele', duration: '6:06' },
  { id: 'hLQl3WQQoQ0', title: 'Someone Like You', artist: 'Adele', duration: '4:46' },
  { id: '0KSOMA3QBU0', title: 'Dark Horse', artist: 'Katy Perry', duration: '3:35' },
  { id: 'CevxZvSJLk8', title: 'Roar', artist: 'Katy Perry', duration: '4:30' },
  { id: '9bZkp7q19f0', title: 'Gangnam Style', artist: 'PSY', duration: '4:13' },
  { id: 'UceaB4D0jpo', title: 'Wake Me Up', artist: 'Avicii', duration: '4:32' },
  { id: 'IcrbM1l_BoI', title: 'The Nights', artist: 'Avicii', duration: '3:00' },
  { id: 'YykjpeuMNEk', title: 'Faded', artist: 'Alan Walker', duration: '3:33' },
  { id: '60ItHLz5WEA', title: 'Alone', artist: 'Alan Walker', duration: '2:44' },
  { id: 'y6120QOlsfU', title: 'Sandstorm', artist: 'Darude', duration: '3:45' },
  { id: 'pRpeEdMmmQ0', title: 'Waka Waka', artist: 'Shakira', duration: '3:31' },
  { id: 'kXYiU_JCYtU', title: 'Numb', artist: 'Linkin Park', duration: '3:08' },
  { id: 'eVTXPUF4Oz4', title: 'In The End', artist: 'Linkin Park', duration: '3:37' },
  { id: 'YVkUvmDQ3HY', title: 'Without Me', artist: 'Eminem', duration: '4:52' },
  { id: 'uelHwf8o7_U', title: 'Love The Way You Lie', artist: 'Eminem ft. Rihanna', duration: '4:24' },
  { id: 'fRh_vgS2dFE', title: 'Sorry', artist: 'Justin Bieber', duration: '3:21' },
  { id: 'oyEuk8j8imI', title: 'Love Yourself', artist: 'Justin Bieber', duration: '3:53' },
  { id: '7wtfhZwyrcc', title: 'Believer', artist: 'Imagine Dragons', duration: '3:25' },
  { id: 'ktvTqknDobU', title: 'Radioactive', artist: 'Imagine Dragons', duration: '3:07' },
  { id: 'e-ORhEE9VVg', title: 'Blank Space', artist: 'Taylor Swift', duration: '4:32' },
  { id: 'nfWlot6h_JM', title: 'Shake It Off', artist: 'Taylor Swift', duration: '3:39' },
  { id: '4NRXx6U8ABQ', title: 'Blinding Lights', artist: 'The Weeknd', duration: '4:22' },
  { id: 'XXYlFuWEuKI', title: 'Save Your Tears', artist: 'The Weeknd', duration: '3:36' },
  { id: 'hTWKbfoikeg', title: 'Smells Like Teen Spirit', artist: 'Nirvana', duration: '4:39' },
  { id: 'Q3Kvu6Kgp88', title: 'Summertime Sadness', artist: 'Lana Del Rey', duration: '4:02' },
  { id: 'k2qgadSvNyU', title: 'Let Her Go', artist: 'Passenger', duration: '3:39' },
  { id: 'lp-EO5I60KA', title: 'Thinking Out Loud', artist: 'Ed Sheeran', duration: '4:41' },
  { id: 'PT2_F-1esPk', title: 'Closer', artist: 'The Chainsmokers ft. Halsey', duration: '4:05' },
  { id: 'dT2owtxkU8k', title: "Don't Let Me Down", artist: 'The Chainsmokers', duration: '3:28' },
  { id: '2kqdl9NEynY', title: 'Lose Yourself', artist: 'Eminem', duration: '5:27' },
  { id: 'C-du33DcWTI', title: 'Stay', artist: 'Rihanna', duration: '3:30' },
  { id: 'e0GqVGvBkDA', title: 'We Found Love', artist: 'Rihanna', duration: '3:36' },
].map((t) => ({
  ...t,
  thumbnail: `https://i.ytimg.com/vi/${t.id}/hqdefault.jpg`,
  durationSeconds: toSeconds(t.duration),
  album: 'Global Hits',
}));

export const TRENDING_TRACKS: Track[] = ALL_TRACKS.slice(0, 10);

export const ARTIST_GROUPS = [
  { name: 'Ed Sheeran', tracks: ALL_TRACKS.filter((t) => t.artist.includes('Ed Sheeran')) },
  { name: 'Taylor Swift', tracks: ALL_TRACKS.filter((t) => t.artist.includes('Taylor Swift')) },
  { name: 'The Weeknd', tracks: ALL_TRACKS.filter((t) => t.artist.includes('The Weeknd')) },
  { name: 'Imagine Dragons', tracks: ALL_TRACKS.filter((t) => t.artist.includes('Imagine Dragons')) },
  {
    name: 'Electronic Hits',
    tracks: ALL_TRACKS.filter(
      (t) =>
        t.artist.includes('Avicii') ||
        t.artist.includes('Alan Walker') ||
        t.artist.includes('Darude') ||
        t.artist.includes('Chainsmokers')
    ),
  },
];

export const BROWSE_CATEGORIES: BrowseCategory[] = [
  { id: '1', name: 'Top Hits', color: '#F59E0B', searchQuery: 'Top Hits' },
  { id: '2', name: 'Lo-Fi Beats', color: '#6366F1', searchQuery: 'Lo-Fi' },
  { id: '3', name: 'Chill Vibes', color: '#10B981', searchQuery: 'Chill' },
  { id: '4', name: 'Hip-Hop', color: '#EF4444', searchQuery: 'Hip-Hop' },
  { id: '5', name: 'Electronic', color: '#A855F7', searchQuery: 'Electronic' },
  { id: '6', name: 'Acoustic', color: '#84CC16', searchQuery: 'Acoustic' },
  { id: '7', name: 'Pop', color: '#EC4899', searchQuery: 'Pop' },
  { id: '8', name: 'R&B', color: '#06B6D4', searchQuery: 'R&B' },
];

export function searchCatalog(query: string): Track[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/).filter(Boolean);

  return ALL_TRACKS.map((track) => {
    const title = track.title.toLowerCase();
    const artist = track.artist.toLowerCase();
    let score = 0;
    if (title === q || `${artist} ${title}` === q) score += 1000;
    if (title.includes(q) || artist.includes(q)) score += 300;
    for (const w of words) {
      if (title === w) score += 200;
      else if (title.startsWith(w)) score += 100;
      else if (title.includes(w)) score += 50;

      if (artist === w) score += 150;
      else if (artist.startsWith(w)) score += 80;
      else if (artist.includes(w)) score += 40;
    }
    return { track, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.track);
}
