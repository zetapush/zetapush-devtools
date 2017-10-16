const HTTP_PATTERN = /^http:\/\/|^\/\//;

const HTTP_PROTOCOL = 'http:';

const HTTPS_PROTOCOL = 'https:';

/**
 * Force ssl based protocol for network echange
 * Cross Env (Browser/Node) test
 */
const FORCE_HTTPS =
  typeof location === 'undefined'
    ? false
    : location.protocol === HTTPS_PROTOCOL;

export const getSecureUrl = (url, forceHttps = FORCE_HTTPS) => {
  return forceHttps ? url.replace(HTTP_PATTERN, `${HTTPS_PROTOCOL}//`) : url;
};
