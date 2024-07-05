import { Kafka } from "kafkajs";


const kafka = new Kafka({
  clientId: 'kafka-client-id',
  brokers: ['kafka:9092']
})

const TOPIC = "customer-event_sv1";
const GROUP_CONSUMER = "customer-group";

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: GROUP_CONSUMER })

export const pushMessage = async () => {
  // Producing
  await producer.connect()
  await producer.send({
    topic: TOPIC,
    messages: [
      { value: 'Hello KafkaJS user!' },
    ],
  })
}