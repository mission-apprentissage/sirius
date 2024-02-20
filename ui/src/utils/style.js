export const loadDynamicStyle = (url) => {
  const link = document.createElement("link");
  link.href = url;
  link.type = "text/css";
  link.rel = "stylesheet";
  link.media = "screen,print";
  document.head.appendChild(link);
  return link;
};

export const unloadStyle = (styleElement) => {
  document.head.removeChild(styleElement);
};
