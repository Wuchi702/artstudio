import Image, { getImageProps } from 'next/image';
import { assetPath } from '@/lib/asset-path';
import { imagery } from '@/data/projects';

export function HeroImage() {
  const { props: desktop } = getImageProps({ ...imagery.hero, src: assetPath(imagery.hero.src), width: 1914, height: 822, sizes: '100vw', quality: 85 });
  return <picture className="photo-frame hero-image">
    <source media="(min-width: 721px)" srcSet={desktop.srcSet ?? desktop.src} sizes={desktop.sizes} />
    <Image src={assetPath("/images/hero-mobile.webp")} alt={imagery.hero.alt} fill sizes="100vw" quality={85}
      fetchPriority="high" loading="eager" />
  </picture>;
}
