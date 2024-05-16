"use client";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, DialogClose, DialogModal, Message } from "ui/dist/index.mjs";

export const ContactUsModal = ({ trigger }) => {
  return (
    <DialogModal
      trigger={trigger}
      type="trigger"
      contentClassName="py-8 px-4 md:px-8 mx-auto max-w-screen-md"
    >
      <ContactUs />
    </DialogModal>
  );
};

export const ContactUs = () => {
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit } = useForm({});
  const closeRef = useRef<HTMLButtonElement>(null);

  const onSubmit = async (data) => {
    setBusy(true);
    await fetch("/api/mail", {
      method: "POST",
      body: JSON.stringify(data),
    });
    closeRef.current?.click();
    Message().success({ content: "Message sent" });
    setBusy(false);
  };
  return (
    <section className="">
      <h2 className="mb-4 text-2xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
        Contact Us
      </h2>
      <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-md">
        For any issue, suggestion, query, feel free to contact us.
      </p>

      <form action="#" className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Your email
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
            placeholder="name@gmail.com"
            required
          />
        </div>
        <div>
          <label
            htmlFor="subject"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Subject
          </label>
          <input
            {...register("subject")}
            type="text"
            id="subject"
            className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
            placeholder="Let us know how we can help you"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
          >
            Your message
          </label>
          <textarea
            {...register("message")}
            id="message"
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Leave a comment..."
          ></textarea>
        </div>
        <div className="flex gap-2 items-center">
          <Button type="submit" disabled={busy}>
            Send message
          </Button>
          <DialogClose ref={closeRef}>
            <Button variant={"ghost"}>Cancel</Button>
          </DialogClose>
        </div>
      </form>
    </section>
  );
};
