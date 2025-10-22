import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MenuScreen } from "@/components/menu/menu-screen";
import { SearchProvider } from "@/components/search/search-provider";
import { getSiteConfig } from "@/lib/config-service";
import { getMenuData } from "@/lib/menu-service";

export default async function HomePage() {
  const [data, config] = await Promise.all([getMenuData(), getSiteConfig()]);

  return (
    <SearchProvider>
      <div className="flex min-h-screen flex-col bg-[#f9f3ea]">
        <SiteHeader config={config} />
        <main className="flex-1 py-10 sm:py-16">
          <div className="container-responsive">
            <MenuScreen data={data} config={config} />
          </div>
        </main>
        <SiteFooter config={config} />
      </div>
    </SearchProvider>
  );
}
