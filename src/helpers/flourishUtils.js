export const getDataSrcFromEmbedCode = (htmlString) => {
  if (typeof htmlString !== 'string') return null;
  const regex = /data-src="([^"]*)"/;
  const match = regex.exec(htmlString);
  return match && match[1] ? match[1] : null;
};

export const buildFlourishUrl = (path) => {
  if (!path) return null;
  const [base, query] = path.split('?');
  return query
    ? `https://flo.uri.sh/${base}/embed?${query}`
    : `https://flo.uri.sh/${base}/embed`;
};

export const flourishDataprotection = {
  enabled: true,
  privacy_cookie_key: 'flourish',
  privacy_statement: [
    {
      children: [
        {
          text:
            'This map is hosted by a third party [Flourish]. ' +
            'By showing the external content you accept the terms ' +
            'and conditions of www.flourish.studio, including their cookie policy.',
        },
      ],
      type: 'p',
    },
  ],
};
