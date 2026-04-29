const amqp = require('amqplib');

function createRabbitService(options = {}) {
  const url = options.url || process.env.RABBITMQ_URL || 'amqp://localhost';
  const queueName = options.queueName || process.env.RABBITMQ_QUEUE || 'weather_queue';
  const durable = options.durable ?? false;
  const prefetch = options.prefetch ?? 1;

  let connection = null;
  let channel = null;

  async function connect() {
    connection = await amqp.connect(url);
    channel = await connection.createChannel();

    if (Number.isInteger(prefetch) && prefetch > 0) {
      await channel.prefetch(prefetch);
    }

    await channel.assertQueue(queueName, { durable });

    return { url, queueName };
  }

  async function close() {
    try {
      if (channel) await channel.close();
    } finally {
      channel = null;
    }

    try {
      if (connection) await connection.close();
    } finally {
      connection = null;
    }
  }

  function publishJson(message) {
    if (!channel) throw new Error('Rabbit channel not initialized');
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  }

  function consumeJson(onMessage, consumeOptions = {}) {
    if (!channel) throw new Error('Rabbit channel not initialized');

    const requeueOnError = consumeOptions.requeueOnError ?? false;

    channel.consume(queueName, async (msg) => {
      if (!msg) return;

      try {
        const payload = JSON.parse(msg.content.toString());
        await onMessage(payload);
        channel.ack(msg);
      } catch (error) {
        console.error('Rabbit consume error:', error);
        channel.nack(msg, false, requeueOnError);
      }
    });
  }

  return { connect, close, publishJson, consumeJson };
}

module.exports = { createRabbitService };
