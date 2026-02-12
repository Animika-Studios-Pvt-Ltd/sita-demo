import { useState, useEffect } from "react";

export const SPOTIFY_FALLBACK = "SPOTIFY_FALLBACK";
export const APPLE_FALLBACK = "APPLE_FALLBACK";

/**
 * Custom hook to determine the best thumbnail for a podcast.
 * @param {Object} podcast - The podcast object containing { thumbnail, podcastLink }
 * @param {String} backendBaseUrl - Base URL for relative images
 * @returns {String|null} The image URL, or a fallback constant, or null
 */
export const usePodcastThumbnail = (podcast, backendBaseUrl) => {
    const [thumbnail, setThumbnail] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const determineThumbnail = async () => {
            // 1. Custom Uploaded Image
            if (podcast.thumbnail) {
                const url = podcast.thumbnail.startsWith("http")
                    ? podcast.thumbnail
                    : `${backendBaseUrl}${podcast.thumbnail}`;
                if (isMounted) setThumbnail(url);
                return;
            }

            const link = podcast.podcastLink;
            if (!link) {
                if (isMounted) setThumbnail(null);
                return;
            }

            // 2. YouTube Thumbnail (Sync)
            if (link.includes("youtube.com/watch") || link.includes("youtu.be/")) {
                try {
                    let videoId = null;
                    if (link.includes("youtube.com/watch")) {
                        const urlObj = new URL(link);
                        videoId = urlObj.searchParams.get("v");
                    } else if (link.includes("youtu.be/")) {
                        const parts = link.split("youtu.be/");
                        videoId = parts[1].split("?")[0];
                    }

                    if (videoId && isMounted) {
                        setThumbnail(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
                        return;
                    }
                } catch (e) {
                    console.error("Error parsing YouTube URL", e);
                }
            }

            // 3. Apple Podcasts (Async via iTunes API)
            if (link.includes("podcasts.apple.com")) {
                try {
                    // Extract ID. Format: .../podcast-name/id123456789
                    const match = link.match(/id(\d+)/);
                    if (match && match[1]) {
                        const id = match[1];
                        // Use JSONP bypass or direct fetch if CORS allows. iTunes API usually supports CORS or needs a proxy.
                        // Using a simple fetch here.
                        const res = await fetch(`https://itunes.apple.com/lookup?id=${id}&media=podcast&entity=podcastEpisode&limit=1`);
                        const data = await res.json();

                        if (data.resultCount > 0 && data.results[0].artworkUrl600) {
                            if (isMounted) {
                                setThumbnail(data.results[0].artworkUrl600);
                                return;
                            }
                        }
                    }
                } catch (e) {
                    console.warn("Could not fetch Apple Podcast artwork, falling back to logo", e);
                }
                if (isMounted) setThumbnail(APPLE_FALLBACK);
                return;
            }

            // 4. Spotify (Fallback to Logo)
            if (link.includes("open.spotify.com")) {
                // Spotify OEmbed often requires backend proxy due to strict CORS.
                // For now, simpler to fallback to branded UI.
                if (isMounted) setThumbnail(SPOTIFY_FALLBACK);
                return;
            }

            // Default
            if (isMounted) setThumbnail(null);
        };

        determineThumbnail();

        return () => {
            isMounted = false;
        };
    }, [podcast, backendBaseUrl]);

    return thumbnail;
};
