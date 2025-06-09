import Head from "next/head";
import Link from "next/link";
// import { allPublications } from "@/.contentlayer/generated";
import ListResearch from "@/components/Elements/ListIems";
import presentData from "@/public/data/presentdata.config";

export default function Home() {
  const sections = presentData.landingPage.sections.filter(s => s.enabled);

  return (
    <div className="text-lg">
      <Head>
        <title>{`Research Template | PresentDATA`}</title>
      </Head>
      <main className="flex flex-col gap-10 p-4 py-10 max-lg:py-5">
        {sections.map((section, idx) => {
          if (idx === 0 && section.type === "HeroSection") {
            return (
              <section key={idx} className="h-[calc(100vh-6.5rem)] max-lg:h-auto max-h-full">
                <div className="font-serif text-5xl max-lg:text-2xl max-lg:text-center italic text-center">
                  "I am the one who knocks." – Welcome to my research page.
                </div>
                <div className="p-10 max-lg:p-0 max-lg:py-5 w-full flex flex-col h-full">
                  <div className="flex max-lg:flex-col justify-between">
                    <div className="w-[35%] max-lg:w-full flex items-center justify-center">
                      <div className="h-96 w-80 bg-background-hover">
                        <img
                          src={`/data/images/${section.imageUrl}`}
                          alt={section.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="w-[60%] h-full max-lg:w-full py-10 max-lg:py-5 flex flex-col gap-3">
                      <div className="">
                        <div className="font-serif text-7xl max-lg:text-5xl max-lg:text-center">{section.name}</div>
                        <div className="text-3xl max-lg:text-2xl">{section.designation}</div>
                      </div>
                      <i className="text-xl !font-italic text-pretty">{section.summary}</i>
                    </div>
                  </div>
                  <div className="flex flex-col h-full w-full justify-between mt-5">
                    <div className="flex gap-4 text-2xl italic text-foreground-accent">
                      {section.socialLinks?.map((item, index) => (
                        <Link target="_blank" href={item.href} className="hover:text-foreground underline underline-offset-4">{item.title}</Link>
                      ))}
                    </div>
                    <div className="flex items-center justify-center w-full p-5">
                      <div>
                        Down Arrow
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          return (
            <section key={idx} className="pt-8  ">
              <h2 className="text-4xl max-lg:text-2xl font-serif mb-4">
                {section.title || section.type}
              </h2>

              <div className="flex flex-col gap-3">
                {Object.entries(section).map(([key, value]) => {
                  if (["type", "enabled", "title"].includes(key)) return null;

                  if (typeof value === "string") {
                    if (value.startsWith("http") || value.includes("@")) {
                      return (
                        <div key={key}>
                          <strong className="capitalize">{key}:</strong>{" "}
                          <Link href={value} className="text-blue-500 underline" target="_blank">
                            {value}
                          </Link>
                        </div>
                      );
                    }
                    if (value.endsWith(".jpg") || value.endsWith(".png")) {
                      return (
                        <div key={key} className="max-w-md">
                          <img src={value} alt={key} className="rounded-lg shadow" />
                        </div>
                      );
                    }
                    return (
                      <div key={key}>
                        <strong className="capitalize">{key}:</strong> {value}
                      </div>
                    );
                  }

                  if (typeof value === "object" && !Array.isArray(value)) {
                    return (
                      <div key={key}>
                        <strong className="capitalize">{key}:</strong>
                        <div className="pl-4">
                          {Object.entries(value).map(([subKey, subVal]) => (
                            <div key={subKey}>
                              <strong>{subKey}:</strong>{" "}
                              <Link href={subVal} className="text-blue-500 underline" target="_blank">
                                {subVal}
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (Array.isArray(value)) {
                    return (
                      <div key={key}>
                        <strong className="capitalize">{key}:</strong>
                        <ul className="list-disc pl-6">
                          {value.map((item, i) => (
                            <li key={i} className="my-1">
                              {typeof item === "object" ? (
                                <div className="pl-2">
                                  {Object.entries(item).map(([ik, iv]) => (
                                    <div key={ik}>
                                      <strong>{ik}:</strong> {iv}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                item
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
