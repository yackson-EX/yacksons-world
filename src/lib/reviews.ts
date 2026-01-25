export const REVIEW_MEDIA = [
  "games",
  "music",
  "movies",
  "tv-shows",
  "anime",
] as const;

export type ReviewMedium = (typeof REVIEW_MEDIA)[number];

export const REVIEW_MEDIA_LABELS: Record<ReviewMedium, string> = {
  games: "Games",
  music: "Music",
  movies: "Movies",
  "tv-shows": "TV Shows",
  anime: "Anime",
};

const slugify = (value: string) => {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

  if (cleaned === "tvshows") {
    return "tv-shows";
  }

  return cleaned;
};

export const normalizeMedium = (value: string) => slugify(value);

export const isReviewMedium = (value: string): value is ReviewMedium =>
  REVIEW_MEDIA.includes(value as ReviewMedium);
