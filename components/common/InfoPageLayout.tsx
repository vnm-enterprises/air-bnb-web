import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type InfoSection = {
  title: string;
  body: string[];
};

type InfoPageLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: InfoSection[];
};

export default function InfoPageLayout({ eyebrow, title, description, sections }: InfoPageLayoutProps) {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-transparent px-6 pb-20 pt-16">
        <section className="mx-auto max-w-5xl">
          <div className="rounded-4xl border border-[#d6e7e6] bg-white/85 p-8 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur sm:p-10 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2C5F5D]">{eyebrow}</p>
            <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              {description}
            </p>

            <div className="mt-10 grid gap-5">
              {sections.map((section) => (
                <article
                  key={section.title}
                  className="rounded-3xl border border-[#deeceb] bg-[#f8fcfc] p-6 sm:p-7"
                >
                  <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
                  <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 sm:text-base">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}