const $ev = process.env;

module.exports = {
  keys: {
    google: {
      clientId: $ev.GOOGLE_CLIENTID,
      clientSecret: $ev.GOOGLE_CLIENTSECRET
    },
    facebook: {
      clientId: $ev.FACEBOOK_CLIENTID,
      clientSecret: $ev.FACEBOOK_CLIENTSECRET
    },
    github: {
      clientId: $ev.GITHUB_CLIENTID,
      clientSecret: $ev.GITHUB_CLIENTSECRET
    },
    session: {
      serverSecret: $ev.SESSION_SERVERSECRET
    },
    crypto: $ev.CRYPTO,
    hashId: $ev.HASHID
  },
  database: {
    connectionString: $ev.DB_CONNECTIONSTRING
  },
  uri: {
    home: $ev.URI_HOME
  },
  mail: {
    HOTMAIL: {
      user: $ev.MAIL_USER,
      service: $ev.MAIL_SERVICE,
      pass: $ev.MAIL_PASS
    },
    MAILGUN: {
      service: 'MAILGUN',
      user: $ev.MAILGUN_USER,
      key: $ev.MAILGUN_KEY,
      domain: $ev.MAILGUN_DOMAIN
    }
  },
  cloudinary: {
    cloud_name: $ev.CLOUDINARY_NAME,
    api_key: $ev.CLOUDINARY_CLIENTID,
    api_secret: $ev.CLOUDINARY_CLIENTSECRET
  }
};
