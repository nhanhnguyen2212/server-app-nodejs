const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'kafka-client-id',
  brokers: ['kafka:9092']
})

const TOPIC = "customer-event_sv1";
const GROUP_CONSUMER = "customer-group";

const consumer = kafka.consumer({ groupId: GROUP_CONSUMER })

export const run = async () => {
  // Consuming
  await consumer.connect()
  await consumer.subscribe({ topic: TOPIC, fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        topic,
        value: message.value.toString(),
      })
    },
  })
}