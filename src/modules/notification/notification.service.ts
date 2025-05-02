import { Injectable } from '@nestjs/common';
import { AnnouncementService } from '../announcement/announcement.service';

@Injectable()
export class NotificationService {
  constructor(private announcementService: AnnouncementService) {}

  async sendAnnouncement() {
    return await this.announcementService.getAll();
  }
}
