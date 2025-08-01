import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const MailConfig: MailerAsyncOptions['useFactory'] = async (
  config: ConfigService,
) => ({
  transport: {
    host: config.get<string>('EMAIL_HOST'), // e.g. 'smtp.gmail.com'
    port: config.get<number>('EMAIL_PORT'), // e.g. 587
    secure: config.get<boolean>('EMAIL_SECURE'), // false untuk port 587
    auth: {
      user: config.get<string>('EMAIL_USER'), // your address
      pass: config.get<string>('EMAIL_PASS'), // your App Password
    },
    debug: true,
    logger: true,
  },
  defaults: {
    from: config.get<string>('EMAIL_FROM'),
    replyTo: config.get<string>('EMAIL_USER'),
  },
  template: {
    dir: join(__dirname, '..', 'mail', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
});
