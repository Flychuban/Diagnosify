import amqp from 'amqplib';

export interface IMessageBroker {
  publishMessage(queue: string, message: any): Promise<void>;
  consumeMessages(queue: string, callback: (message: any) => void): Promise<void>;
}




export class RabbitMQBroker implements IMessageBroker {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor() {
    this.connection = null as any;
    this.channel = null as any;
  }

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
    } catch (err) {
      throw err;
    }
  }

  async publishMessage(queue: string, message: any): Promise<void> {
    try {
      const msg = JSON.stringify(message);
      await this.channel.assertQueue(queue, { durable: true });
      await this.channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
    } catch (err) {
      throw err;
    }
  }

  async consumeMessages(queue: string, callback: (message: any) => void): Promise<void> {
    try {
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.prefetch(1);

      this.channel.consume(queue, (msg) => {
        if (msg) {
          callback(JSON.parse(msg.content.toString()));
          this.channel.ack(msg);
        }
      });
    } catch (err) {
      throw err;
    }
  }

  async close(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }
}

export const messageBroker = new RabbitMQBroker()