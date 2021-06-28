export const COOKIE_VARS = {
  mailer: {
    refresh: {
      name: "mailer-refresh-token",
      maxAge: {
        str: "7d",
        /**
         * miliseconds
         */
        ms: 7 * 24 * 3600 * 1000,
      },
    },
    access: {
      name: "mailer-access-token",
      maxAge: {
        str: "15m",
        /**
         * miliseconds
         */
        ms: 15 * 60 * 1000, // miliseconds
      },
    },
  },
  carrier: {
    refresh: {
      name: "carrier-refresh-token",
      maxAge: {
        str: "7d",
        /**
         * miliseconds
         */
        ms: 7 * 24 * 3600 * 1000, // miliseconds
      },
    },
    access: {
      name: "carrier-access-token",
      maxAge: {
        str: "15m",
        /**
         * miliseconds
         */
        ms: 15 * 60 * 1000, // miliseconds
      },
    },
  },
};
