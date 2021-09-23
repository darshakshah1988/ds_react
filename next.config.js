module.exports = {
  distDir: 'build',
  reactStrictMode: false,
  redirects: async () => {
    return [
      {
        source: '/admin',
        destination: '/admin/artists',
        permanent: false
      }
    ];
  }
};
