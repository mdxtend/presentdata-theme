import Head from "next/head";
import Link from "next/link";
import { allProfiles } from 'contentlayer/generated'
import { UpArrow } from "@/components/Presentdata/Icons";
import RenderMDX from "@/components/Presentdata/RenderMDX";
import presentData from "@/public/data/presentdata.config";

export default function Home() {
  const heroSection = presentData.landingPage.heroSection;
  const profile = allProfiles.find(p => p._id === "profile/index.mdx");

  const scrollToUserProfile = () => {
    const userProfileSection = document.getElementById('user-profile');
    if (userProfileSection) {
      userProfileSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="text-lg">
      <Head>
        <title>{`Research Template | PresentDATA`}</title>
      </Head>
      <main className="flex flex-col gap-10 p-4 py-10 max-lg:py-5">
        <section className="h-[calc(100vh-6.5rem)] max-lg:h-auto max-h-full">
          <div className="font-serif text-5xl max-lg:text-2xl max-lg:text-center italic text-center">
            "I am the one who knocks." – Welcome to my research page.
          </div>
          <div className="p-10 max-lg:p-0 max-lg:py-5 w-full flex flex-col h-full">
            <div className="flex max-lg:flex-col justify-between">
              <div className="w-[35%] max-lg:w-full flex items-center justify-center">
                <div className="h-96 w-80 bg-background-hover">
                  <img
                    src={`/data/images/${heroSection.imageUrl}`}
                    alt={heroSection.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-[60%] h-full max-lg:w-full py-10 max-lg:py-5 flex flex-col gap-3">
                <div className="">
                  <div className="font-serif text-7xl max-lg:text-5xl max-lg:text-center">{heroSection.name}</div>
                  <div className="text-3xl max-lg:text-2xl max-lg:text-center">{heroSection.designation}</div>
                </div>
                <i className="text-xl !font-italic">{heroSection.summary}</i>
              </div>
            </div>
            <div className="flex flex-col h-full w-full justify-between mt-5">
              <div className="flex gap-4 text-2xl italic text-foreground-accent">
                {heroSection.socialLinks?.map((item, index) => (
                  <Link target="_blank" href={item.href} className="hover:text-foreground underline underline-offset-4">{item.title}</Link>
                ))}
              </div>
              <div
                className="flex items-center justify-center w-[100%+56px] hover:bg-background-secondary cursor-pointer -mx-14 p-5"
                onClick={scrollToUserProfile}
              >
                <div>
                  <UpArrow className="rotate-180 w-10 h-10 text-foreground-accent" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className=" scroll-mt-16" id="user-profile">
          <RenderMDX content={profile} className="mt-10 mb-20" />
        </section>
      </main>
    </div>
  );
}
