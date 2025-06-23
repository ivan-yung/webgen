import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion"

const Accordian = () => {
  return (
    <div>
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Home</AccordionTrigger>
        <AccordionContent>
          Content for item 1
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Item 2</AccordionTrigger>
        <AccordionContent>
          Content for item 2
        </AccordionContent>
      </AccordionItem>
    </Accordion>

    </div>
  );
}

export default Accordian;