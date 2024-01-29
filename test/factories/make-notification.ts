import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  NotificationProps,
  Notification,
} from '@/domain/notification/enterprise/entities/notification'

import { faker } from '@faker-js/faker'

export function makeNotification(
  override: Partial<NotificationProps>,
  id?: UniqueEntityID,
) {
  const newNotification = Notification.create(
    {
      title: faker.lorem.sentence(4),
      recipientId: new UniqueEntityID('1'),
      content: faker.lorem.sentence(10),
      ...override,
    },
    id,
  )

  return newNotification
}
