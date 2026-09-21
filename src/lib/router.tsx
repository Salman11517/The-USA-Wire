import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface RouteState {
  pathname: string;
  search: string;
  params: Record<string, string>;
}

interface RouterContextType {
  route: RouteState;
  navigate: (to: string) => void;
  setDocMeta: (title: string, description?: string, image?: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function parsePath(fullPath: string): { pathname: string; search: string } {
  const [pathWithSlash, queryString] = fullPath.split('?');
  const pathname = pathWithSlash || '/';
  const search = queryString ? `?${queryString}` : '';
  return { pathname, search };
}

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<RouteState>(() => {
    if (typeof window === 'undefined') return { pathname: '/', search: '', params: {} };
    // Check path or hash fallback for iframe safety
    const path = window.location.pathname.length > 1 ? window.location.pathname : (window.location.hash.replace(/^#/, '') || '/');
    const { pathname, search } = parsePath(path);
    return { pathname, search: search || window.location.search, params: {} };
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.length > 1 ? window.location.pathname : (window.location.hash.replace(/^#/, '') || '/');
      const { pathname, search } = parsePath(path);
      setRoute({ pathname, search: search || window.location.search, params: {} });
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (to: string) => {
    const { pathname, search } = parsePath(to);
    // Use history pushState and hash sync
    if (window.history.pushState) {
      window.history.pushState({}, '', to);
    }
    // Also sync hash for preview iframe resilience
    window.location.hash = pathname + search;
    setRoute({ pathname, search, params: {} });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setDocMeta = (title: string, description?: string, image?: string) => {
    document.title = title ? `${title} | The USA Wire` : "The USA Wire | America's Trending Stories, All in One Place";
    
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', description);
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);
    }
    
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    if (image) {
      let ogImg = document.querySelector('meta[property="og:image"]');
      if (!ogImg) {
        ogImg = document.createElement('meta');
        ogImg.setAttribute('property', 'og:image');
        document.head.appendChild(ogImg);
      }
      ogImg.setAttribute('content', image);
    }
  };

  return (
    <RouterContext.Provider value={{ route, navigate, setDocMeta }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
};

export const Link: React.FC<{
  to: string;
  className?: string;
  children: ReactNode;
  title?: string;
  id?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}> = ({ to, className, children, title, id, onClick }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) onClick(e);
    navigate(to);
  };

  return (
    <a href={to} className={className} onClick={handleClick} title={title} id={id}>
      {children}
    </a>
  );
};
