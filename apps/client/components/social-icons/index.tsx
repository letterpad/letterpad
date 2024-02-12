const SocialIcon = ({ icon, href }) => {
  if (!href) {
    return null;
  }

  return (
    <a
      className="p-2 dark:hover:bg-slate-400/45 hover:bg-slate-200/45 rounded-full"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      {icon}
    </a>
  );
};

export default SocialIcon;
