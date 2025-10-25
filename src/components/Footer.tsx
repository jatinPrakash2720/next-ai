const Footer = () => {
  return (
    <footer className="py-8 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-2">
            Built by{" "}
            <span className="text-black dark:text-white font-semibold">
              Jatin Prakash
            </span>{" "}
            • Project inspired by{" "}
            <a
              href="https://www.youtube.com/@HiteshChoudharydotcom"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black dark:text-white font-semibold hover:underline"
            >
              Hitesh Choudhary Sir
            </a>
          </p>
          <p className="text-xs text-gray-500 dark:text-zinc-500">
            Built following the tutorial:{" "}
            <a
              href="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:underline"
            >
              Anonymous Messages App Tutorial
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
