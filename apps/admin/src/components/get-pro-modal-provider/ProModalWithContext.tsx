"use client";
import { createContext, useContext, useState } from "react";
import { BsMagic } from "react-icons/bs";
import { TbFileTextAi, TbSeo, TbTools } from "react-icons/tb";
import { Button, DialogModal } from "ui";

interface ContextProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Context = createContext<ContextProps>({} as ContextProps);

export const GetProModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Context.Provider value={{ isOpen, setIsOpen }}>
      {children}
      <DialogModal
        open={isOpen}
        onOpenChange={setIsOpen}
        type="state"
        title=""
        footer={
          <>
            <Button
              onClick={() => setIsOpen(false)}
              size="small"
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              size="small"
              onClick={() => {
                setIsOpen(false);
                window.open("/membership", "_blank");
              }}
            >
              Upgrade Now
            </Button>
          </>
        }
      >
        <div className="max-w-md w-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-heading text-blue-500">
              Publish with Letterpad AI
            </h2>
            <p className="py-4 font-paragraph">
              Unlock premium AI-powered features designed to enhance your
              writing and make publishing easier.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 py-12">
            <Block
              title="Inline AI Text editing"
              description="Turn a selected paragraph into one sentence or bullets, rephrase
              it for clarify, or modify its tone."
              icon={<BsMagic size={20} className="text-blue-500" />}
            />
            <Block
              title="Context-aware AI chatbot"
              description="Improve your opening paragraph, use better adjectives, and
              simplify complex topics - all in one place."
              icon={<TbFileTextAi size={20} className="text-blue-500" />}
            />
            <Block
              title="Creative Tools"
              description="Generate Table of Contents, Summarize your article, and more."
              icon={<TbTools size={20} className="text-blue-500" />}
            />
            <Block
              title="One-click SEO assistant"
              description="Generate post titles and meta tags automatically to rank higher in search results."
              icon={<TbSeo size={24} className="text-blue-500" />}
            />
          </div>
        </div>
      </DialogModal>
    </Context.Provider>
  );
};

export const useGetProModal = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useGetProModal must be used within a GetProModalProvider");
  }
  return context;
};

const Block = ({ title, description, icon }) => {
  return (
    <div className="flex gap-2 flex-col">
      {icon}
      <h3 className="font-heading font-bold">{title}</h3>
      <p className="font-paragraph text-sm">{description}</p>
    </div>
  );
};
