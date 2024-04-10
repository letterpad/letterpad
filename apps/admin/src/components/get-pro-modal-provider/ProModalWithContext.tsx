"use client";
import { createContext, useContext, useState } from "react";
import { Button, DialogModal } from "ui";

import { ProFeatures } from "./content";

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
        <ProFeatures />
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
