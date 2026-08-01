import UilGithub from '@iconscout/react-unicons/icons/uil-github';
import UilLinkedin from '@iconscout/react-unicons/icons/uil-linkedin';

export const Footer = () => {
  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 px-4 py-8">
        <span className="text-footer-foreground">&copy; SMARTDEV {new Date().getFullYear()}</span>
        <ul className="flex justify-end gap-4">
          <li>
            <a aria-label="LinkedIn" href="https://au.linkedin.com/in/franco-diaz-licham">
              <UilLinkedin className="text-footer-foreground hover:text-[#adadad]" size="1.8rem" />
            </a>
          </li>
          <li>
            <a aria-label="GitHub" href="https://github.com/Franco-Diaz-Licham">
              <UilGithub className="text-footer-foreground hover:text-[#adadad]" size="1.8rem" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};
