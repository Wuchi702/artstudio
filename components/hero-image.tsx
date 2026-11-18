import Image, { getImageProps } from 'next/image';
import { assetPath } from '@/lib/asset-path';
import { site } from '@/data/site';
import { imagery } from '@/data/projects';

export function HeroImage() {
  const portrait = site.designer.portrait;
  if (portrait) {
    return <div className="photo-frame hero-portrait" data-hero-image>
      <Image src={assetPath(portrait.src)} alt={portrait.alt} fill sizes="(max-width: 720px) 94vw, 40vw" quality={85}
        fetchPriority="high" loading="eager" style={{ objectPosition: portrait.position }} />
    </div>;
  }

  const { props: desktop } = getImageProps({ alt: imagery.garden.alt, src: assetPath(imagery.garden.src), width: 1536, height: 1024, sizes: '100vw', quality: 85 });
  return <picture className="photo-frame hero-image" data-hero-image>
    <source media="(min-width: 721px)" srcSet={desktop.srcSet ?? desktop.src} sizes={desktop.sizes} />
    <Image src={assetPath('/images/garden-mobile.webp')} alt={imagery.garden.alt} fill sizes="100vw" quality={85}
      fetchPriority="high" loading="eager" />
  </picture>;
}
