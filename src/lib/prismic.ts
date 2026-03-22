import * as prismic from '@prismicio/client';
import * as prismicNext from '@prismicio/next';

export const repositoryName = 'dronacontent';

const routes: prismic.ClientConfig['routes'] = [
  {
    type: 'blog_post',
    path: '/blogs/:uid',
  },
  {
    type: 'legal_page',
    path: '/:uid',
  },
];

export const createClient = (config: prismicNext.CreateClientConfig = {}) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    ...config,
  });

  prismicNext.enableAutoPreviews({ client, ...config });

  return client;
};
