import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

export interface InstagramFeedProps {
  postUrls: string[];
}

export const InstagramFeed: React.FC<InstagramFeedProps> = ({ postUrls }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const processEmbeds = () => {
      if (window.instgrm?.Embeds) {
        window.instgrm.Embeds.process();
        if (isMounted) setLoading(false);
      }
    };

    // Check if script is already present
    const existingScript = document.querySelector<HTMLScriptElement>('script[src*="instagram.com/embed.js"]');

    if (existingScript) {
      if (window.instgrm) {
        processEmbeds();
      } else {
        existingScript.addEventListener('load', processEmbeds);
      }
    } else {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.onload = processEmbeds;
      document.body.appendChild(script);
    }

    // Safety timeout to hide skeleton if embeds take longer or are blocked by ad-blocker
    const timeout = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 2500);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [postUrls]);

  return (
    <div className="premium-glass-card premium-glass-card--wide insta-feed-wrapper">
      <div className="pgc-shimmer"></div>
      <div className="pgc-corner-mark">✦</div>

      {/* Header Section */}
      <div className="insta-feed-header">
        <div className="insta-feed-header-left">
          <p className="pgc-eyebrow" style={{ margin: 0 }}>SOCIAL HUB</p>
          <h3 className="pgc-headline" style={{ margin: '0.4rem 0 0.4rem' }}>Follow the Buzz</h3>
          <a
            href="https://www.instagram.com/magnovite.kengeri"
            target="_blank"
            rel="noopener noreferrer"
            className="insta-subtitle-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            <span>@magnovite.kengeri</span>
          </a>
        </div>

        <a
          href="https://www.instagram.com/magnovite.kengeri"
          target="_blank"
          rel="noopener noreferrer"
          className="insta-follow-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span>Follow Us</span>
        </a>
      </div>

      {/* Embedded Posts Grid */}
      <div className="insta-grid">
        {postUrls.map((url, idx) => (
          <div key={idx} className="insta-card-box">
            {loading && (
              <div className="insta-skeleton">
                <div className="insta-skeleton-header">
                  <div className="insta-skeleton-avatar"></div>
                  <div className="insta-skeleton-lines">
                    <div className="insta-skeleton-line short"></div>
                    <div className="insta-skeleton-line tiny"></div>
                  </div>
                </div>
                <div className="insta-skeleton-body"></div>
              </div>
            )}

            <blockquote
              className="instagram-media"
              data-instgrm-permalink={url}
              data-instgrm-version="14"
              style={{
                background: '#0a0a0a',
                border: 0,
                borderRadius: '16px',
                margin: '1px',
                width: '100%',
                minWidth: '260px'
              }}
            >
              <div style={{ padding: '16px' }}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="insta-fallback-link"
                >
                  <span>View Post on Instagram</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              </div>
            </blockquote>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstagramFeed;
