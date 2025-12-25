export class HealthEntity {
  status: string;
  uptime: number;
  timestamp: string;
  memory: NodeJS.MemoryUsage;

  constructor(
    status: string,
    uptime: number,
    timestamp: string,
    memory: NodeJS.MemoryUsage,
  ) {
    this.status = status;
    this.uptime = uptime;
    this.timestamp = timestamp;
    this.memory = memory;
  }

  static create(): HealthEntity {
    return new HealthEntity(
      'ok',
      process.uptime(),
      new Date().toISOString(),
      process.memoryUsage(),
    );
  }
}
