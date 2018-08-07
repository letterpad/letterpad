const slice = [].slice;

class EventBus {
    constructor() {
        if (!(this instanceof EventBus)) {
            return new EventBus();
        }

        this.nextSubscriptionIndex = 0;
        this.callbacks = {};
    }

    unregisterAllCallbacks() {
        this.callbacks = {};
    }

    on(event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }

        this.callbacks[event].push({
            subscription: callback,
            index: this.nextSubscriptionIndex
        });

        const currentIndex = this.nextSubscriptionIndex;
        const that = this;
        this.nextSubscriptionIndex += 1;

        return () => {
            that.callbacks[event] = that.callbacks[event].filter(
                callback => callback.index !== currentIndex
            );
        };
    }

    publish() {
        const event = arguments[0];
        const args = arguments.length >= 2 ? slice.call(arguments, 1) : [];
        if (this.callbacks && this.callbacks[event]) {
            this.callbacks[event].forEach(callback => {
                callback.subscription.apply(null, args);
            });
        }
    }
}
// private instance if required.
export default EventBus;

// singleton instance
export const EventBusInstance = new EventBus();
