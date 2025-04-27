export const sanitizeURL = (url) => {
    if (!url) return "";
    url = url.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }
    const domain = url.replace(/^https?:\/\//i, '').split('/')[0];
    if (!domain.includes('.') || (!domain.startsWith('www.') && domain.split('.').length === 2)) {
      url = url.replace(/^https?:\/\//i, "https://www.");
    }
    return url;
  };

