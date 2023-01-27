const Greenlock = require("@root/greenlock");
import fs from "fs";

const config = {
  webroot: "/var/www/letsencrypt",
  email: "admin@letterpad.app",
  production: process.env.NODE_ENV === "production",
  configDir: "/etc/letsencrypt",
};

export class SSL {
  private greenlock;
  private webroot;
  constructor({ webroot, email, production = false, configDir } = config) {
    this.webroot = webroot;
    try {
      this.greenlock = Greenlock.create({
        packageRoot: __dirname,
        configDir,
        packageAgent: "letterpad",
        maintainerEmail: email,
        staging: !production,
        notify: function (event, details) {
          if ("error" === event) {
            // `details` is an error object in this case
            throw new Error(details);
          }
        },
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      throw e;
    }
    this.greenlock.manager.defaults({
      // The "Let's Encrypt Subscriber" (often the same as the maintainer)
      // NOT the end customer (except where that is also the maintainer)
      subscriberEmail: email,
      agreeToTerms: true,
      challenges: {
        "http-01": {
          module: "acme-http-01-webroot",
          webroot,
        },
      },
    });
  }

  async add(domain: string) {
    try {
      this.createNginx_80(domain);
      const data = await this.greenlock.add({
        subject: domain,
        altnames: [domain],
      });
      this.createNginx_443(domain);
      return data;
    } catch (e) {
      throw e;
    }
  }

  async delete(domain: string) {
    try {
      const data = await this.greenlock.remove({
        subject: domain,
      });
      if (fs.existsSync(this.getNginxConfigPath(domain))) {
        fs.unlinkSync(this.getNginxConfigPath(domain));
      }
      return data;
    } catch (e) {
      throw e;
    }
  }

  private createNginx_80(domain: string) {
    fs.writeFileSync(
      this.getNginxConfigPath(domain),
      `server {
    listen	 80;
    server_name ${domain};
    add_header X-App-Name Letterpad;
    location /.well-known/acme-challenge {
      default_type "text/plain";
      add_header X-debug-message "Challenge Request" always;
      alias ${this.webroot};
    }
}`
    );
  }

  private createNginx_443(domain: string) {
    fs.writeFileSync(
      this.getNginxConfigPath(domain),
      `server {
   listen	 80;
   server_name ${domain};
   add_header X-App-Name Letterpad;
   return	 301 https://${domain}\$request_uri;
}
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    add_header X-App-Name Letterpad;
    server_name ${domain};

    # RSA certificate
    ssl_certificate /etc/letsencrypt/live/${domain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem;

    include /etc/letsencrypt/options-ssl-nginx.conf;

    gzip on;
    gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}`
    );
  }

  getNginxConfigPath(domain: string) {
    return `/etc/nginx/sites-enabled/${domain}.enabled`;
  }
}
