import type { MetadataRoute } from "next";
import { articles as fallbackArticles } from "@/data/articles";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://genius-land.com.ua";

  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ];

  // Dynamic routes from articles
  let articleSlugs: string[] = fallbackArticles.map((a) => a.slug);

  try {
    const { data, error } = await supabase
      .from("articles")
      .select("slug");

    if (!error && data && data.length > 0) {
      articleSlugs = data.map((a: { slug: string }) => a.slug);
    }
  } catch (err) {
    console.error("Error fetching articles for sitemap:", err);
  }

  const articleRoutes = articleSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...routes, ...articleRoutes];
}
