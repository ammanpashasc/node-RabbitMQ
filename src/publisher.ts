const amqp = require('amqplib');

const QUEUE_NAME = 'orders';
const AMQP_URI = 'amqp://localhost:5672';

const main = async () => {
  try {
    // Establish connection
    const connection = await amqp.connect(AMQP_URI);
    const channel = await connection.createChannel();

    // Make sure the queue exists - if not, create it
    await channel.assertQueue(QUEUE_NAME);

    for (let i = 0; i < 5; i++) {
      await channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify({ foo: i + 1 })));
      console.log(`Payload #${i + 1} sent successfully`);
    }

    // Clean up
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error(error);
  }
};

main()
  .then(() => console.log('Finished'))
  .catch(console.warn);

export {};
