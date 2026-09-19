import UilAngleLeft from '@iconscout/react-unicons/icons/uil-angle-left';
import UilAngleRight from '@iconscout/react-unicons/icons/uil-angle-right';
import { Carousel } from 'primereact/carousel';
import { Children } from 'react';
import type { ReactNode } from 'react';
import { useDetectDesktop } from '@/hooks/useDetectDesktop';
import { cn } from '@/lib/cn';

type AppCarouselProps = {
  children: ReactNode;
};

const carouselButtonClassName = 'grid size-10 place-items-center rounded-full border bg-background transition enabled:hover:cursor-pointer enabled:hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50';
const carouselIndicatorClassName = 'size-3 rounded-full border border-secondary bg-transparent transition data-[active]:bg-secondary enabled:hover:cursor-pointer';

export const AppCarousel = ({ children }: AppCarouselProps) => {
  const isDesktop = useDetectDesktop();
  const slides = Children.toArray(children);
  const slidesPerPage = isDesktop ? 1.75 : 1;
  const carouselMaxWidthClassName = isDesktop ? 'max-w-[1180px]' : 'max-w-[360px]';
  const carouselContentPaddingClassName = isDesktop ? 'px-3' : 'px-4';

  return (
    <Carousel.Root align="center" className={cn('mx-auto w-full', carouselMaxWidthClassName)} loop slidesPerPage={slidesPerPage} spacing={24}>
      <Carousel.Content className="w-full pb-6">
        {slides.map((slide, index) => (
          <Carousel.Item key={index} value={index} className={cn(carouselContentPaddingClassName, 'max-w-120')}>
            {slide}
          </Carousel.Item>
        ))}
      </Carousel.Content>
      <div className="mt-4 flex gap-4">
        <Carousel.Indicators className="flex items-center gap-2">
          {slides.map((_, index) => (
            <Carousel.Indicator className={carouselIndicatorClassName} key={index} page={index} />
          ))}
        </Carousel.Indicators>
        <div className="flex flex-1 items-center justify-end gap-2">
          <Carousel.Prev className={carouselButtonClassName}>
            <UilAngleLeft size={24} />
          </Carousel.Prev>
          <Carousel.Next className={carouselButtonClassName}>
            <UilAngleRight size={24} />
          </Carousel.Next>
        </div>
      </div>
    </Carousel.Root>
  );
};
