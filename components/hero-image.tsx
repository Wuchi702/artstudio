import Image, { getImageProps } from 'next/image';
import { assetPath } from '@/lib/asset-path';
import { imagery } from '@/data/projects';

export function HeroImage() {
  const { props: desktop } = getImageProps({ alt: imagery.garden.alt, src: assetPath(imagery.garden.src), width: 1536, height: 1024, sizes: '100vw', quality: 85 });
  return <picture className="photo-frame hero-image" data-hero-image>
    <source media="(min-width: 721px)" srcSet={desktop.srcSet ?? desktop.src} sizes={desktop.sizes} />
    <Image src={assetPath('/images/garden-mobile.webp')} alt={imagery.garden.alt} fill sizes="100vw" quality={85}
      fetchPriority="high" loading="eager" />
  </picture>;
}
