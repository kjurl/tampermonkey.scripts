import { GM } from "$";
import { For, Show } from "solid-js";

import { createQuery } from "@tanstack/solid-query";

import {
  type DownloadLink,
  getBreadcrumbs,
  getDate,
  getDescription,
  getDownloadLinks,
  getImageSource,
  getYoutubeFrames
} from "./utils";

interface PreviewCardProps {
  articleUrl: string;
}

interface ArticleData {
  date: string;
  imgSrc: string;
  videoSrcs: string[];
  downloadLinks: DownloadLink[];
  description: string;
  breadcrumbs: string[];
}

async function fetchAndParseArticle(url: string) {
  return new Promise<ArticleData>((resolve, reject) => {
    GM.xmlHttpRequest({
      method: "GET",
      url: url,
      onload: (response: any) => {
        if (response.status !== 200) {
          reject(new Error("Failed to load article assets"));
          return;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(response.responseText, "text/html");

        resolve({
          date: getDate(doc),
          description: getDescription(doc),
          imgSrc: getImageSource(doc),
          videoSrcs: getYoutubeFrames(doc),
          downloadLinks: getDownloadLinks(doc),
          breadcrumbs: getBreadcrumbs(doc)
        });
      },
      onerror: (err: any) => reject(err)
    });
  });
}

export function PreviewCard(props: PreviewCardProps) {
  const query = createQuery<ArticleData>(() => ({
    queryKey: ["articlePreview", props.articleUrl],
    queryFn: context => {
      const [_, url] = context.queryKey;
      return fetchAndParseArticle(url as string);
    },
    retry: 1,
    refetchOnWindowFocus: false
  }));

  return (
    <div class="w-full flex justify-center p-4">
      <Show
        when={!query.isLoading}
        fallback={<span class="loading loading-bars loading-xl"></span>}
      >
        <Show
          when={!query.isError}
          fallback={
            <div class="text-error bg-error/10 p-2 rounded text-xs border border-error/20">
              <strong>Error:</strong>{" "}
              {query.error instanceof Error
                ? query.error.message
                : JSON.stringify(query.error)}
            </div>
          }
        >
          <div class="relative w-full max-w-md rounded-xl overflow-hidden shadow-xl bg-base-300">
            <img
              src={query.data?.imgSrc}
              alt="Card backdrop"
              class="w-full h-auto block"
            />
            <div class="absolute top-4 left-4 z-10">
              <div class="badge badge-secondary shadow-md">
                {query.data?.date}
              </div>
            </div>
            <div class="absolute bottom-4 left-4 right-4 z-10 flex gap-2">
              <For each={query.data?.downloadLinks}>
                {value => (
                  <a
                    role="button"
                    href={value.href}
                    class="btn h-auto py-2 flex-1 text-xs leading-tight text-center shadow-md"
                  >
                    {value.text}
                  </a>
                )}
              </For>
            </div>
          </div>
        </Show>
      </Show>
    </div>
  );
}
