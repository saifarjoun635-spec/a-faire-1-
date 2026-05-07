import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import PublicLayout from "../components/PublicLayout";
import { BLOG_POSTS, findPost } from "../lib/blogData";
import { useT } from "../lib/i18n";

export function BlogPage() {
  const { t, lang } = useT();
  return (
    <PublicLayout>
      <section className="bg-navy text-white px-4 sm:px-6 lg:px-8 py-16 md:py-24" data-testid="blog-hero">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="gold-accent-line" />
            <span className="text-xs uppercase tracking-[0.24em] text-gold font-semibold">
              {t("blog.kicker")}
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl">
            {t("blog.title.1")} <span className="text-gold">{t("blog.title.2")}</span>
          </h1>
          <p className="mt-5 text-white/70 max-w-2xl leading-relaxed">{t("blog.subtitle")}</p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16" data-testid="blog-list">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="card-soft rounded-sm overflow-hidden group"
                data-testid={`blog-card-${p.slug}`}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={p.cover}
                    alt=""
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-gold text-white text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-sm">
                    <Tag size={11} /> {p.category[lang]}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] mb-3">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} /> {new Date(p.date).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA")}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} /> {p.readMin} min
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-navy mb-2 leading-snug group-hover:text-gold transition-colors">
                    {p.title[lang]}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                    {p.excerpt[lang]}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold group-hover:gap-2 transition-all">
                    {t("blog.read")} <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

export function BlogPostPage() {
  const { t, lang } = useT();
  const { slug } = useParams();
  const post = findPost(slug);
  if (!post) return <Navigate to="/blog" replace />;

  return (
    <PublicLayout>
      <section className="relative bg-navy text-white px-4 sm:px-6 lg:px-8 py-16 md:py-24" data-testid="blog-post-hero">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-gold font-semibold hover:text-white transition">
            <ArrowLeft size={14} /> {t("blog.back")}
          </Link>
          <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-wider text-gold font-semibold">
            <Tag size={12} /> {post.category[lang]}
          </div>
          <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            {post.title[lang]}
          </h1>
          <div className="mt-6 flex items-center gap-5 text-xs text-white/60">
            <span className="inline-flex items-center gap-1.5"><Calendar size={13} /> {new Date(post.date).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {post.readMin} min</span>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16" data-testid="blog-post-body">
        <div className="max-w-4xl mx-auto">
          <img src={post.cover} alt="" className="w-full h-[420px] object-cover rounded-sm shadow-lg mb-12" />
          <article className="prose-article max-w-none text-[var(--text)] leading-relaxed space-y-6 text-base">
            {post.body[lang].map((para) => (
              <Paragraph key={`${post.slug}-${lang}-${para.slice(0, 24)}`} text={para} />
            ))}
          </article>
        </div>
      </section>
    </PublicLayout>
  );
}

function Paragraph({ text }) {
  // very simple bold marker: **bold** -> <strong>
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p>
      {parts.map((part, i) => {
        const key = `${i}-${part.slice(0, 16)}`;
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={key} className="font-display text-navy">{part.slice(2, -2)}</strong>;
        }
        return <span key={key}>{part}</span>;
      })}
    </p>
  );
}
