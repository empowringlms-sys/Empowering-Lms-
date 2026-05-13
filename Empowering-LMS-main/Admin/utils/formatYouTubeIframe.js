export function formatYouTubeIframe(iframeString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(iframeString, "text/html");

  const iframe = doc.querySelector("iframe");
  if (!iframe) return "";

  iframe.removeAttribute("width");
  iframe.removeAttribute("height");
  iframe.setAttribute("style", "width:100%; height:100%;");

  return iframe.outerHTML;
}
