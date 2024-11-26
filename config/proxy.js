/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For roadwayGeology, please see
 */

// const baseUrl = 'http://221.194.132.82:61001';
const baseUrl = 'http://60.10.135.211/';

module.exports = {
  '/push_engine': {
    target: baseUrl,
    ws: true,
    changeOrigin: true,
  },
};
