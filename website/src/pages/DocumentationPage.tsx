import React, { useState, useCallback, useMemo } from "react";
import { 
  Search, 
  BookOpen, 
  Zap, 
  Users, 
  Monitor, 
  Heart, 
  Bell, 
  Rss, 
  ArrowRight, 
  LucideIcon 
} from "lucide-react";
import { Link } from "react-router";
import { PageLayout, PageHero } from "../components/Layout";

// Types
interface DocCategory {
  icon: LucideIcon;
  title: string;
  color: string;
  bg: string;
  articles: string[];
}

interface FilteredCategory extends DocCategory {
  matchCount: number;
  hasMatches: boolean;
}

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onClear: () => void;
}

interface PopularArticlesProps {
  articles: string[];
  onArticleClick: (article: string) => void;
}

interface CategoryCardProps {
  category: DocCategory;
  searchQuery?: string;
}

interface ArticleLinkProps {
  article: string;
  color: string;
  isHighlighted?: boolean;
}

interface NoResultsProps {
  onContactSupport: () => void;
}

interface HelpStripProps {
  onContactSupport: () => void;
}

interface SearchState {
  query: string;
  isSearching: boolean;
  resultsCount: number;
}

// Constants
const DOC_CATEGORIES: DocCategory[] = [
  {
    icon: Zap,
    title: "Getting Started",
    color: "var(--church-gold)",
    bg: "rgba(200,150,44,0.08)",
    articles: [
      "Platform overview",
      "Creating your church account",
      "Inviting your team",
      "Customizing your church profile",
      "Your first Sunday walkthrough",
    ],
  },
  {
    icon: BookOpen,
    title: "Congregation App",
    color: "var(--church-blue-light)",
    bg: "rgba(61,107,196,0.08)",
    articles: [
      "Member onboarding guide",
      "Using the church feed",
      "Following live scripture",
      "Writing sermon notes",
      "Managing notifications",
    ],
  },
  {
    icon: Monitor,
    title: "Media Dashboard",
    color: "var(--church-blue)",
    bg: "rgba(27,58,122,0.08)",
    articles: [
      "Dashboard overview",
      "Building a scripture queue",
      "Broadcasting live verses",
      "Sending announcements",
      "Monitoring engagement",
    ],
  },
  {
    icon: Users,
    title: "Ministry Communities",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
    articles: [
      "Creating a ministry channel",
      "Assigning ministry leaders",
      "Managing members",
      "Posting to your group",
      "Setting permissions",
    ],
  },
  {
    icon: Heart,
    title: "Giving",
    color: "var(--church-gold)",
    bg: "rgba(200,150,44,0.08)",
    articles: [
      "Setting up giving",
      "Creating giving funds",
      "Viewing giving reports",
      "Generating tax receipts",
      "Refund policy",
    ],
  },
  {
    icon: Bell,
    title: "Announcements",
    color: "#DC2626",
    bg: "rgba(220,38,38,0.08)",
    articles: [
      "Creating an announcement",
      "Targeting specific ministries",
      "Scheduling broadcasts",
      "Tracking read receipts",
      "Announcement best practices",
    ],
  },
  {
    icon: Rss,
    title: "Church Feed",
    color: "#059669",
    bg: "rgba(5,150,105,0.08)",
    articles: [
      "Feed content guidelines",
      "Posting to the feed",
      "Moderating content",
      "Member interactions",
      "Feed analytics",
    ],
  },
  {
    icon: BookOpen,
    title: "Admin & Settings",
    color: "#0891B2",
    bg: "rgba(8,145,178,0.08)",
    articles: [
      "Admin roles and permissions",
      "Managing church settings",
      "Billing and invoices",
      "Integrations & API",
      "Data export",
    ],
  },
];

const POPULAR_ARTICLES: string[] = [
  "How to sync scripture to congregation phones",
  "Setting up the media dashboard for Sunday",
  "Inviting members to the congregation app",
  "Creating and managing giving funds",
  "Setting up ministry communities",
  "Generating year-end giving statements",
];

// Helper functions
const filterCategories = (categories: DocCategory[], query: string): FilteredCategory[] => {
  const normalizedQuery = query.toLowerCase().trim();
  
  return categories
    .map((category: DocCategory) => {
      const matchedArticles = category.articles.filter((article: string) =>
        article.toLowerCase().includes(normalizedQuery)
      );
      
      return {
        ...category,
        articles: normalizedQuery ? matchedArticles : category.articles,
        matchCount: matchedArticles.length,
        hasMatches: matchedArticles.length > 0,
      };
    })
    .filter((category: FilteredCategory) => 
      !normalizedQuery || category.hasMatches || 
      category.title.toLowerCase().includes(normalizedQuery)
    );
};

const highlightText = (text: string, query: string): React.ReactNode => {
  if (!query.trim()) return text;
  
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  
  return parts.map((part: string, index: number) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} style={{ background: "rgba(200,150,44,0.3)", color: "inherit" }}>
        {part}
      </mark>
    ) : (
      part
    )
  );
};

// Custom hooks
const useDocSearch = (initialQuery: string = "") => {
  const [searchState, setSearchState] = useState<SearchState>({
    query: initialQuery,
    isSearching: false,
    resultsCount: 0,
  });

  const handleQueryChange = useCallback((newQuery: string): void => {
    setSearchState((prev: SearchState) => ({
      query: newQuery,
      isSearching: newQuery.length > 0,
      resultsCount: 0, // Will be calculated by filtered results
    }));
  }, []);

  const handleClear = useCallback((): void => {
    setSearchState({
      query: "",
      isSearching: false,
      resultsCount: 0,
    });
  }, []);

  const filteredCategories = useMemo((): FilteredCategory[] => {
    const results = filterCategories(DOC_CATEGORIES, searchState.query);
    
    setSearchState((prev: SearchState) => ({
      ...prev,
      resultsCount: results.reduce((total: number, cat: FilteredCategory) => 
        total + (searchState.query ? cat.matchCount : 0), 0),
    }));
    
    return results;
  }, [searchState.query]);

  return {
    query: searchState.query,
    isSearching: searchState.isSearching,
    resultsCount: searchState.resultsCount,
    filteredCategories,
    handleQueryChange,
    handleClear,
  };
};

// Sub-components
const SearchBar: React.FC<SearchBarProps> = React.memo(({ query, onQueryChange, onClear }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      onQueryChange(e.target.value);
    },
    [onQueryChange]
  );

  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all"
      style={{ 
        background: "var(--card)", 
        border: `2px solid ${query ? "var(--church-blue)" : "var(--border)"}` 
      }}
    >
      <Search size={18} style={{ color: "var(--muted-foreground)" }} aria-hidden="true" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search documentation..."
        className="flex-1 bg-transparent outline-none text-sm"
        style={{ color: "var(--foreground)" }}
        aria-label="Search documentation"
        autoComplete="off"
      />
      {query && (
        <button 
          onClick={onClear} 
          className="text-xs hover:text-foreground transition-colors focus:outline-none focus:underline" 
          style={{ color: "var(--muted-foreground)" }}
          aria-label="Clear search"
        >
          Clear
        </button>
      )}
    </div>
  );
});

SearchBar.displayName = "SearchBar";

const PopularArticles: React.FC<PopularArticlesProps> = React.memo(({ articles, onArticleClick }) => {
  return (
    <div className="mt-5">
      <div 
        className="text-xs font-semibold mb-3 uppercase tracking-wide" 
        style={{ color: "var(--muted-foreground)" }}
      >
        Popular Articles
      </div>
      <div className="flex flex-wrap gap-2" role="list" aria-label="Popular articles">
        {articles.map((article: string) => (
          <button
            key={article}
            onClick={() => onArticleClick(article)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1"
            style={{
              background: "rgba(27,58,122,0.07)",
              border: "1px solid rgba(27,58,122,0.15)",
              color: "var(--church-blue)",
            }}
            role="listitem"
            aria-label={`View article: ${article}`}
          >
            {article}
          </button>
        ))}
      </div>
    </div>
  );
});

PopularArticles.displayName = "PopularArticles";

const ArticleLink: React.FC<ArticleLinkProps> = React.memo(({ article, color, isHighlighted }) => {
  return (
    <div
      className="flex items-center gap-2 text-xs cursor-pointer group"
      style={{ 
        color: isHighlighted ? "var(--foreground)" : "var(--muted-foreground)",
        background: isHighlighted ? "rgba(200,150,44,0.05)" : "transparent",
        padding: isHighlighted ? "0.25rem 0.5rem" : "0",
        borderRadius: isHighlighted ? "0.375rem" : "0",
      }}
      role="link"
      tabIndex={0}
      aria-label={`Read article: ${article}`}
    >
      <ArrowRight 
        size={11} 
        style={{ color, flexShrink: 0 }} 
        className="group-hover:translate-x-0.5 transition-transform" 
        aria-hidden="true" 
      />
      <span className="group-hover:text-foreground transition-colors">
        {article}
      </span>
    </div>
  );
});

ArticleLink.displayName = "ArticleLink";

const CategoryCard: React.FC<CategoryCardProps> = React.memo(({ category, searchQuery }) => {
  const Icon: LucideIcon = category.icon;

  return (
    <div
      className="rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      role="article"
      aria-label={`${category.title} documentation`}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ background: category.bg }}
        aria-hidden="true"
      >
        <Icon size={20} style={{ color: category.color }} />
      </div>
      <h3
        className="font-semibold mb-3"
        style={{ color: "var(--foreground)", fontFamily: "var(--font-display)" }}
      >
        {category.title}
      </h3>
      <div className="space-y-1.5" role="list" aria-label={`${category.title} articles`}>
        {category.articles.map((article: string) => (
          <div key={article} role="listitem">
            <ArticleLink 
              article={article} 
              color={category.color}
              isHighlighted={!!searchQuery && article.toLowerCase().includes(searchQuery.toLowerCase())}
            />
          </div>
        ))}
      </div>
      <button
        className="mt-4 text-xs font-semibold transition-all hover:underline focus:outline-none focus:underline"
        style={{ color: category.color }}
        aria-label={`View all ${category.title} articles`}
      >
        View all →
      </button>
    </div>
  );
});

CategoryCard.displayName = "CategoryCard";

const NoResults: React.FC<NoResultsProps> = React.memo(({ onContactSupport }) => {
  return (
    <div className="text-center py-16" role="status">
      <div className="text-4xl mb-3" aria-hidden="true">🔍</div>
      <div className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>
        No results found
      </div>
      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
        Try different keywords or{" "}
        <button
          onClick={onContactSupport}
          style={{ color: "var(--church-blue)" }}
          className="hover:underline focus:outline-none focus:underline"
        >
          contact support
        </button>.
      </p>
    </div>
  );
});

NoResults.displayName = "NoResults";

const HelpStrip: React.FC<HelpStripProps> = React.memo(({ onContactSupport }) => {
  return (
    <section
      className="py-14"
      style={{ background: "linear-gradient(180deg, #EEF2FB, #F8F9FC)" }}
      aria-labelledby="help-heading"
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        <span id="help-heading" className="sr-only">Need help?</span>
        <div className="text-3xl mb-3" aria-hidden="true">💬</div>
        <h3
          className="mb-2"
          style={{ 
            fontFamily: "var(--font-display)", 
            fontWeight: 700, 
            fontSize: "1.4rem", 
            color: "var(--foreground)" 
          }}
        >
          Can't find what you need?
        </h3>
        <p className="mb-6 text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          Our support team is available weekdays 9am–6pm EST and typically responds within the hour.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white text-sm transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          style={{ 
            background: "var(--church-blue)", 
            boxShadow: "0 4px 16px rgba(27,58,122,0.25)" 
          }}
          aria-label="Contact support team"
        >
          Contact Support <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
});

HelpStrip.displayName = "HelpStrip";

// Main Component
const DocumentationPage: React.FC = () => {
  const {
    query,
    isSearching,
    resultsCount,
    filteredCategories,
    handleQueryChange,
    handleClear,
  } = useDocSearch();

  const handlePopularArticleClick = useCallback((article: string): void => {
    handleQueryChange(article);
  }, [handleQueryChange]);

  const handleContactSupport = useCallback((): void => {
    // Navigate to contact page or open support modal
    console.log("Navigating to contact support...");
  }, []);

  const hasResults = filteredCategories.length > 0;

  return (
    <PageLayout>
      <PageHero
        badge="Documentation"
        title={
          <>
            Everything You Need
            <br />
            <em style={{ color: "var(--church-gold-light)" }}>to Run My Church</em>
          </>
        }
        subtitle="Comprehensive guides for every role — from church administrators to media team operators to congregation members."
      />

      {/* Search */}
      <section className="py-10" style={{ background: "var(--background)" }}>
        <div className="max-w-2xl mx-auto px-6">
          <SearchBar
            query={query}
            onQueryChange={handleQueryChange}
            onClear={handleClear}
          />

          {isSearching && (
            <div className="mt-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
              Found {resultsCount} result{resultsCount !== 1 ? 's' : ''}
            </div>
          )}

          {/* Popular */}
          {!query && (
            <PopularArticles
              articles={POPULAR_ARTICLES}
              onArticleClick={handlePopularArticleClick}
            />
          )}
        </div>
      </section>

      {/* Categories */}
      <section 
        className="py-10 pb-24" 
        style={{ background: "var(--background)" }}
        aria-labelledby="doc-categories-heading"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <span id="doc-categories-heading" className="sr-only">
            Documentation categories
          </span>

          {query && !hasResults && (
            <NoResults onContactSupport={handleContactSupport} />
          )}
          
          {hasResults && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredCategories.map((category: FilteredCategory) => (
                <CategoryCard
                  key={category.title}
                  category={category}
                  searchQuery={query}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <HelpStrip onContactSupport={handleContactSupport} />
    </PageLayout>
  );
};

export default React.memo(DocumentationPage);

// Export types for reuse
export type { 
  DocCategory, 
  FilteredCategory, 
  SearchBarProps, 
  PopularArticlesProps,
  CategoryCardProps,
  SearchState
};

// Export constants if needed elsewhere
export { DOC_CATEGORIES, POPULAR_ARTICLES };