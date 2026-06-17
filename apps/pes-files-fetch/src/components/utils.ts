export function getDate(doc: Document) {
  let date = "Recent Mod";
  const timeElem = doc.querySelector(
    "time, .entry-date, .published_time, .date"
  );
  const metaOgDate = doc.querySelector(
    'meta[property="article:published_time"]'
  );
  if (timeElem?.textContent) {
    date = timeElem.textContent.trim();
  } else if (metaOgDate instanceof HTMLMetaElement) {
    date = metaOgDate.content.split("T")[0];
  }
  return date;
}

export function getDescription(doc: Document) {
  let description = "";
  const entryContent = doc.querySelector(
    ".entry-content, .post-content, article .content, .entry"
  );
  if (entryContent) {
    const textClone = entryContent.cloneNode(true) as HTMLElement;
    textClone
      .querySelectorAll("iframe, script, style, link, a.button, button")
      .forEach(el => el.remove());
    const cleanedText =
      textClone.textContent?.replace(/\s+/g, " ").trim() || "";
    if (cleanedText.length > 0) {
      description =
        cleanedText.length > 300
          ? cleanedText.substring(0, 300) + "..."
          : cleanedText;
    }
  }
  return description;
}

export function getImageSource(doc: Document) {
  let imgSrc = "";
  const ogImage = doc.querySelector('meta[property="og:image"]');
  if (ogImage instanceof HTMLMetaElement) {
    imgSrc = ogImage.content;
  } else {
    const postImg = doc.querySelector(
      ".entry-content img, .post-content img, article img"
      // ".entry-content img, .post-content img" //v1-2
    );
    if (postImg instanceof HTMLImageElement) imgSrc = postImg.src;
  }
  return imgSrc;
}

export function getYoutubeFrames(doc: Document) {
  const ytIframes = doc.querySelectorAll(
    'iframe[src*="youtube.com"], iframe[src*="youtu.be"]'
  );
  const videoSrcs: string[] = [];
  ytIframes.forEach(iframe => {
    if (iframe instanceof HTMLIFrameElement && iframe.src) {
      videoSrcs.push(iframe.src);
    }
  });
  return videoSrcs;
}

export function getBreadcrumbs(doc: Document) {
  const breadcrumbs: string[] = [];
  const breadcrumbContainer = doc.querySelector(
    ".breadcrumbs, #breadcrumbs, .rank-math-breadcrumb, .bcn-breadcrumbs"
  );

  if (breadcrumbContainer) {
    const crumbs = breadcrumbContainer.querySelectorAll("a, span");
    crumbs.forEach(crumb => {
      const text = crumb.textContent?.trim() || "";
      if (
        text &&
        text !== "/" &&
        text !== ">" &&
        text !== "»" &&
        !breadcrumbs.includes(text)
      ) {
        breadcrumbs.push(text);
      }
    });
  } else {
    const categoryLinks = doc.querySelectorAll(
      ".cat-links a, .entry-categories a, .meta-category a"
    );
    if (categoryLinks.length > 0) {
      breadcrumbs.push("Home");
      categoryLinks.forEach(cat => {
        const text = cat.textContent?.trim() || "";
        if (text && !breadcrumbs.includes(text)) {
          breadcrumbs.push(text);
        }
      });
    }
  }
  return breadcrumbs;
}

export interface DownloadLink {
  href: string;
  text: string;
}

export function getDownloadLinks(doc: Document) {
  const potentialDlLinks = doc.querySelectorAll(
    '.entry-content a, .post-content a, a.button, button, [href*="modsfire"], [href*="sharemods"], [href*="mediafire"]'
    // ".entry-content a, .post-content a, a.button, button" //v1-2
  );
  const uniqueLinks = new Set<string>();
  const downloadLinks: DownloadLink[] = [];

  potentialDlLinks.forEach(element => {
    if (element instanceof HTMLAnchorElement) {
      const href = element.href || "";
      const text = element.textContent?.trim() || "";
      const isDownloadWord =
        /download|скачать|link|button|drive|mega|mediafire|zippyshare|modsfire|sharemods/i.test(
          text
        ) || /download|button/i.test(element.className);

      if (href && isDownloadWord && !uniqueLinks.has(href)) {
        uniqueLinks.add(href);
        downloadLinks.push({ href, text: text || "Download File" });
      }
    }
  });

  return downloadLinks;
}
