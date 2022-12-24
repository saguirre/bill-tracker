import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export const ThemeChanger: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle">
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="w-6 h-6 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          ></path>
        </svg>
      </label>
      <ul
        tabIndex={0}
        className="menu border border-base-300 dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-1"
      >
        <li>
          <a onClick={() => setTheme('light')}>Light</a>
        </li>
        <li>
          <a onClick={() => setTheme('cupcake')}>Cupcake</a>
        </li>
        <li>
          <a onClick={() => setTheme('lofi')}>Lofi</a>
        </li>
        <li>
          <a onClick={() => setTheme('emerald')}>Emerald</a>
        </li>
        <li>
          <a onClick={() => setTheme('pastel')}>Pastel</a>
        </li>
        <li>
          <a onClick={() => setTheme('dracula')}>Dracula</a>
        </li>
        <li>
          <a onClick={() => setTheme('dark')}>Dark</a>
        </li>
      </ul>
    </div>
  );
};
