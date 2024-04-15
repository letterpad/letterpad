import { AccordionMultipleProps, AccordionSingleProps } from "@radix-ui/react-accordion";

import { AccordionContent,AccordionItem, AccordionRoot, AccordionTrigger } from "./accordion";

interface Props {
  items: {
    trigger: React.ReactNode;
    content: React.ReactNode;
  }[];
  type?: AccordionSingleProps['type'] | AccordionMultipleProps['type']
}

export function Accordion({ items, type = "single" }:Props) {
    return (
      <AccordionRoot type={type} collapsible className="w-full">
        {items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger>{item.trigger}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </AccordionRoot>
    );
  }
  