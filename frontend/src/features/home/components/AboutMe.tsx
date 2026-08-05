import { AppPageContainer } from '@/components/common/AppPageContainer';
import meImage from '@/assets/images/me.jpg';

export const AboutMe = () => {
  return (
    <AppPageContainer contentClassName="grid md:grid-cols-4" id="about-me" sectionClassName="scroll-mt-32">
      <div className="flex flex-col gap-8 md:col-span-3">
        <h1 className="text-left text-5xl font-bold uppercase leading-[1.1]">About Me</h1>
        <img src={meImage} className="mx-auto block w-1/2 rounded-full border border-[#9e9e9e] shadow-[0_10px_15px_rgb(160_160_160_/_0.75)] md:hidden" alt="Franco Diaz Licham" />
        <p>
          Hi, I'm <strong>Franco Diaz</strong>, a Software Engineer based in Western Sydney, Australia. <em>SmartDev</em> began as a personal project I created in my own time - a way to share my passion for building software solutions and to
          collaborate with others who value clean, practical, and approachable technology. It reflects how I like to work: turning ideas into real applications that are intuitive and reliable.
        </p>
        <p>
          I've developed <span className="font-semibold text-primary">end-to-end experience across the full stack</span> - from backend APIs and cloud infrastructure, to frontend applications. I'm dedicated to writing clean, testable code and
          applying core software engineering principles to create scalable and maintainable systems.
        </p>
        <p>
          What I enjoy most is collaborating with people and making technology approachable. No question is too small, and no detail is overlooked. I'm always open to one-on-one collaboration - whether that's pairing on code, exploring ideas, or
          bringing a project to life. My conviction is that software should never feel out of reach or overly complicated - it should be intuitive, reliable, and accessible for everyone.
        </p>
      </div>
      <div className="hidden content-center md:col-span-1 md:block">
        <img src={meImage} className="w-full rounded-full border border-[#9e9e9e] shadow-[0_10px_15px_rgb(160_160_160_/_0.75)]" alt="Franco Diaz Licham" />
      </div>
    </AppPageContainer>
  );
};
