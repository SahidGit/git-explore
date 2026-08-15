import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const isExternalHref = (href) => /^https?:\/\//i.test(href);

const CardLink = ({ link }) => {
  const className =
    'inline-flex items-center gap-1 text-xs font-mono text-zinc-300 hover:text-white transition-colors duration-200 group/link font-semibold';

  const icon = (
    <ArrowUpRight
      className="w-3.5 h-3.5 text-zinc-400 group-hover/link:text-white group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-200"
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
  <article className="group relative flex flex-col h-full bg-[#121215] border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-500 hover:border-white/25 hover:shadow-2xl hover:shadow-white/5">
    {card.image && (
      <div className="relative aspect-[16/9] overflow-hidden bg-[#0A0A0C] border-b border-white/[0.08]">
        <img
          src={card.image}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover grayscale contrast-125 opacity-80 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-95 group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-black/20 to-transparent pointer-events-none" />
      </div>
    )}

    <div className="flex flex-col flex-1 p-6 sm:p-7">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-xl font-bold text-white tracking-tight leading-snug font-heading group-hover:text-zinc-200">
          {card.title}
        </h3>
        {card.badge && (
          <span className="inline-flex shrink-0 items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/[0.06] border border-white/10 text-emerald-400">
            {card.badge}
          </span>
        )}
      </div>

      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6 flex-1 font-normal">
        {card.description}
      </p>

      {card.links?.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 border-t border-white/[0.08] mt-auto">
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
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ${className}`}
      aria-label="Feature cards"
    >
      {cards.map((card) => (
        <FeatureProjectCard key={card.id ?? card.title} card={card} />
      ))}
    </section>
  );
};

export default FeatureProjectGrid;
