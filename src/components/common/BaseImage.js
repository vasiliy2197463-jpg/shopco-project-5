import NextImage from 'next/image';

export const assetPath = (src) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return typeof src === 'string' && src.startsWith('/') ? `${basePath}${src}` : src;
};

export default function BaseImage({ src, ...props }) {
  return <NextImage src={assetPath(src)} {...props} />;
}
