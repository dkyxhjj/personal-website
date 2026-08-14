// Server-only: exchanges the long-lived refresh token for a short-lived access
// token, checks what's currently playing, and returns a minimal public shape.
// Never proxy Spotify's raw payload — it carries account-identifying fields.

type SpotifyArtist = { name: string };
type SpotifyImage = { url: string; width: number | null };
type SpotifyTrack = {
  name: string;
  artists: SpotifyArtist[];
  album: { name: string; images: SpotifyImage[] };
  external_urls: { spotify: string };
};
type CurrentlyPlayingResponse = { is_playing?: boolean; item?: SpotifyTrack };
type RecentlyPlayedResponse = { items?: { track: SpotifyTrack }[] };
type TokenResponse = { access_token: string; expires_in: number };

type SpotifyPayload = {
  isPlaying: boolean;
  title: string | null;
  artist: string | null;
  album: string | null;
  albumArt: string | null;
  url: string | null;
  fetchedAt: string;
};

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_URL =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";
const CACHE_CONTROL = "public, s-maxage=60, stale-while-revalidate=300";

function emptyPayload(): SpotifyPayload {
  return {
    isPlaying: false,
    title: null,
    artist: null,
    album: null,
    albumArt: null,
    url: null,
    fetchedAt: new Date().toISOString(),
  };
}

function respond(payload: SpotifyPayload) {
  return Response.json(payload, { headers: { "Cache-Control": CACHE_CONTROL } });
}

let cachedAccessToken: string | null = null;
let cachedAccessTokenExpiresAt = 0;

async function getAccessToken(): Promise<string | null> {
  if (cachedAccessToken && Date.now() < cachedAccessTokenExpiresAt) {
    return cachedAccessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    console.error(
      `Spotify env vars missing: clientId=${!!clientId} clientSecret=${!!clientSecret} refreshToken=${!!refreshToken}`,
    );
    return null;
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(`Spotify token exchange failed: ${res.status} ${await res.text()}`);
    return null;
  }

  const data = (await res.json()) as TokenResponse;
  cachedAccessToken = data.access_token;
  // Refresh a little early so a request never races an about-to-expire token.
  cachedAccessTokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
  return cachedAccessToken;
}

// Spotify returns art at multiple resolutions (typically 640/300/64px), not
// guaranteed order. Pick whichever is closest to 300px — enough detail at the
// small size we render it, without shipping the full 640px cover.
function pickAlbumArt(images: SpotifyImage[] | undefined): string | null {
  if (!images || images.length === 0) return null;

  const sized = images.filter((img) => typeof img.width === "number");
  if (sized.length === 0) return images[0].url;

  const closest = sized.reduce((best, img) =>
    Math.abs((img.width as number) - 300) < Math.abs((best.width as number) - 300)
      ? img
      : best,
  );
  return closest.url;
}

function fromTrack(
  track: SpotifyTrack,
): Pick<SpotifyPayload, "title" | "artist" | "album" | "albumArt" | "url"> {
  return {
    title: track.name ?? null,
    artist: track.artists?.map((a) => a.name).join(", ") ?? null,
    album: track.album?.name ?? null,
    albumArt: pickAlbumArt(track.album?.images),
    url: track.external_urls?.spotify ?? null,
  };
}

async function fetchLastPlayed(headers: HeadersInit): Promise<SpotifyPayload> {
  const res = await fetch(RECENTLY_PLAYED_URL, { headers, cache: "no-store" });
  if (!res.ok) return emptyPayload();

  const data = (await res.json()) as RecentlyPlayedResponse;
  const track = data.items?.[0]?.track;
  if (!track) return emptyPayload();

  return { isPlaying: false, ...fromTrack(track), fetchedAt: new Date().toISOString() };
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) return respond(emptyPayload());

    const headers = { Authorization: `Bearer ${accessToken}` };

    const nowRes = await fetch(NOW_PLAYING_URL, { headers, cache: "no-store" });

    if (nowRes.status === 200) {
      const data = (await nowRes.json()) as CurrentlyPlayingResponse;
      if (data.is_playing && data.item) {
        return respond({
          isPlaying: true,
          ...fromTrack(data.item),
          fetchedAt: new Date().toISOString(),
        });
      }
    }

    // Nothing currently playing (204, or a paused 200) — fall back to last played.
    return respond(await fetchLastPlayed(headers));
  } catch {
    // A dead token or network hiccup should degrade silently, not error the page.
    return respond(emptyPayload());
  }
}
