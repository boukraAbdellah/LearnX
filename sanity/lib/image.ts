import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

export type CoverImageSource =
  | SanityImageSource
  | { asset?: { url?: string }; _sanityAsset?: string }
  | string
  | null
  | undefined;

export function getCourseCoverImageUrl(
  coverImage?: CoverImageSource,
  width = 640,
  height = 360
): string | null {
  if (!coverImage) return null;
  if (typeof coverImage === "string") return coverImage;
  if (
    typeof coverImage === "object" &&
    "asset" in coverImage &&
    coverImage.asset &&
    "url" in coverImage.asset &&
    typeof coverImage.asset.url === "string"
  ) {
    return coverImage.asset.url;
  }
  try {
    return urlFor(coverImage as SanityImageSource).width(width).height(height).fit("crop").url();
  } catch {
    if (
      typeof coverImage === "object" &&
      "_sanityAsset" in coverImage &&
      typeof coverImage._sanityAsset === "string" &&
      coverImage._sanityAsset.startsWith("image@")
    ) {
      return coverImage._sanityAsset.replace("image@", "");
    }
    return null;
  }
}
