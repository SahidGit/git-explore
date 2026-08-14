import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const isExternalHref = (href) => /^https?:\/\//i.test(href);

const CardLink = ({ link }) => {
  const className =
    'inline-flex items-center gap-1.5 text-xs font-mono text-[#A1A1AA] hover:text-white transition-colors duration-200 group/link';

  const icon = (
    <ArrowUpRight
      className="w-3 h-3 text-zinc-500 group-hover/link:text-white group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-200"
      aria-hidden="true"
    />
  );

  if (isExternalHref(link.href)) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <span className="hover:underline underline-offset-4 decoration-white/30">
          {link.label}
        </span>
        {icon}
      </a>
    );
  }

  return (
    <Link to={link.href} className={className}>
      <span className="hover:underline underline-offset-4 decoration-white/30">
        {link.label}
      </span>
      {icon}
    </Link>
  );
};

const FeatureProjectCard = ({ card }) => (
  <article className="group flex flex-col h-full bg-[#121215] border border-white/[0.08] rounded-xl overflow-hidden transition-all duration-200 hover:border-white/20 hover:bg-white/[0.015]">
    {card.image && (
      <div className="relative aspect-[16/9] overflow-hidden bg-[#0A0A0C] border-b border-white/[0.06]">
        <img
          src={card.image}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-transparent opacity-80 pointer-events-none" />
      </div>
    )}

    <div className="flex flex-col flex-1 p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="text-xl font-bold text-white tracking-tight leading-tight">
          {card.title}
        </h3>
        {card.badge && (
          <span className="inline-flex shrink-0 items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/[0.06] border border-white/10 text-zinc-300">
            {card.badge}
          </span>
        )}
      </div>

      <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-6 flex-1">
        {card.description}
      </p>

      {card.links?.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 border-t border-white/[0.06] mt-auto">
          {card.links.map((link) => (
            <CardLink key={`${link.label}-${link.href}`} link={link} />
          ))}
        </div>
      )}
    </div>
  </article>
);

const FeatureProjectGrid = ({ cards = [], className = '' }) => {
  if (!cards.length) {
    return null;
  }

  return (
    <section
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 ${className}`}
      aria-label="Feature cards"
    >
      {cards.map((card) => (
        <FeatureProjectCard key={card.id ?? card.title} card={card} />
      ))}
    </section>
  );
};

export default FeatureProjectGrid;
