import { PubSubEvent } from "./types";

/**
 * subscriptions data format:
 * { eventType: { id: callback } }
 */
const subscriptions = {};
const getNextUniqueId = getIdGenerator();

export function subscribe(eventType: PubSubEvent, callback) {
  const id = getNextUniqueId();

  if (!subscriptions[eventType]) subscriptions[eventType] = {};

  subscriptions[eventType][id] = callback;

  return {
    unsubscribe: () => {
      delete subscriptions[eventType][id];
      if (Object.keys(subscriptions[eventType]).length === 0)
        delete subscriptions[eventType];
    },
  };
}

export function publish(eventType: PubSubEvent, arg) {
  if (!subscriptions[eventType]) return;

  Object.keys(subscriptions[eventType]).forEach((key) =>
    subscriptions[eventType][key](arg),
  );
}

function getIdGenerator() {
  let lastId = 0;

  return function getNextUniqueId() {
    lastId += 1;
    return lastId;
  };
}
