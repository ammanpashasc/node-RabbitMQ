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

    // Only process one message at a time!
    channel.prefetch(1);

    // Listen to any incomming messages
    channel.consume(QUEUE_NAME, async (message) => {
      console.log('Recieved payload:', message.content.toString());
      const payload = JSON.parse(message.content.toString());

      // do some processing here
      console.log('payload #', payload.foo, 'processing..');
      await sleep(5000);
      console.log('payload #', payload.foo, 'done processing');

      // Ack the message to remove it from the queue
      channel.ack(message);

      // move on to the next message in the queue...
    });

    console.log('Listening for messages...');
  } catch (ex) {
    console.error(ex);
  }
};

main()
  .then(() => console.log('Finished'))
  .catch(console.warn);

const sleep = async (ms: number) => await new Promise((resolve) => setTimeout(resolve, ms));

export {};
