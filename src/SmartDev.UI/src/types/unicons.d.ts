declare module '@iconscout/react-unicons/icons/*' {
  import type { ComponentType, SVGProps } from 'react';

  const Icon: ComponentType<SVGProps<SVGSVGElement> & { size?: string | number; color?: string }>;
  export default Icon;
}
