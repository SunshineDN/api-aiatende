require('dotenv').config();

module.exports = {
  development: {
    use_env_variable: 'DB_URL',
  },
  test: {
    use_env_variable: 'DB_URL',
  },
  production: {
    use_env_variable: 'DB_URL',
  }
};