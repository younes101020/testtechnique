import { Controller, Get, Param, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('tasks')
  getAllTasks() {
    return this.notificationService.getAllTasks();
  }

  @Get('tasks/:id')
  getTaskStatus(@Param('id') taskId: string) {
    return this.notificationService.getTaskStatus(taskId);
  }

  @Post('rentals/:id/notify')
  triggerManualNotification(@Param('id') rentalId: number) {
    return this.notificationService.triggerManualNotification(rentalId);
  }
}
