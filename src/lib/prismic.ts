import * as prismic from '@prismicio/client';
import * as prismicNext from '@prismicio/next';

export const repositoryName = 'dronaedtech';

const routes: prismic.ClientConfig['routes'] = [
  {
    type: 'blog_post',
    path: '/blogs/:uid',
  },
  // TODO: Uncomment once you create the 'legal_page' type in Slice Machine!
  // {
  //   type: 'legal_page',
  //   path: '/:uid',
  // },
];

export const createClient = (config: prismicNext.CreateClientConfig = {}) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    ...config,
  });

  prismicNext.enableAutoPreviews({ client, ...config });

  return client;
};
