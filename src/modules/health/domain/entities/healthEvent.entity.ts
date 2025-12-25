export class HealthEventEntity {
  id: string;
  eventType: string;
  timestamp: string;
  metadata: Record<string, any>;

  constructor(
    id: string,
    eventType: string,
    timestamp: string,
    metadata: Record<string, any>,
  ) {
    this.id = id;
    this.eventType = eventType;
    this.timestamp = timestamp;
    this.metadata = metadata;
  }

  static create(eventType: string, metadata: Record<string, any> = {}): HealthEventEntity {
    return new HealthEventEntity(
      `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      eventType,
      new Date().toISOString(),
      metadata,
    );
  }
}
