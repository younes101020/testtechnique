import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendEmail(to: string, subject: string, content: string) {
    this.logger.log(`
      Email sent:
      To: ${to}
      Subject: ${subject}
      Content: ${content}
    `);
    return { success: true, messageId: `mock-${Date.now()}` };
  }
}
