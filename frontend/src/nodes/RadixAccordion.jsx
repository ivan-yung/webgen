import * as React from "react";
import { Accordion } from "radix-ui";
import classNames from "classnames";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import "../styles/RadixAccordianStyles.css";
import { useStore } from '../store'; // Adjust this path!

const RadixAccordion = ({ selected, id }) => {
    // State to manage whether the form is shown or not
    const [showForm, setShowForm] = React.useState(false);

    // Get updateNode and nodes from the Zustand store
    const updateNode = useStore((state) => state.updateNode);
    const nodes = useStore((state) => state.nodes);

    // Memoize accordion data to avoid unnecessary recalculation
    const accordionData = React.useMemo(() => {
        const targetNode = nodes.find(node => node.id === id);
        if (targetNode && targetNode.data) {
            return [
                { id: "item-1", heading: targetNode.data.Heading1 || "Is it accessible?", content: targetNode.data.Content1 || "Yes. It adheres to the WAI-ARIA design pattern." },
                { id: "item-2", heading: targetNode.data.Heading2 || "Is it unstyled?", content: targetNode.data.Content2 || "Yes. It's unstyled by default, giving you freedom over the look and feel." },
                { id: "item-3", heading: targetNode.data.Heading3 || "Can it be animated?", content: targetNode.data.Content3 || "Yes! You can animate the Accordion with CSS or JavaScript." },
            ];
        }
        return [
            { id: "item-1", heading: "Is it accessible?", content: "Yes. It adheres to the WAI-ARIA design pattern." },
            { id: "item-2", heading: "Is it unstyled?", content: "Yes. It's unstyled by default, giving you freedom over the look and feel." },
            { id: "item-3", heading: "Can it be animated?", content: "Yes! You can animate the Accordion with CSS or JavaScript." },
        ];
    }, [id, nodes]);

    // State to hold form input values (only when form is open)
    const [formInput, setFormInput] = React.useState(null);

    // When the form is opened, initialize formInput from accordionData
    React.useEffect(() => {
        if (showForm) {
            setFormInput({
                heading1: accordionData[0].heading,
                content1: accordionData[0].content,
                heading2: accordionData[1].heading,
                content2: accordionData[1].content,
                heading3: accordionData[2].heading,
                content3: accordionData[2].content,
            });
        }
    }, [showForm, accordionData]);

    // Handle button click to show the form
    const handleButtonClick = () => {
        setShowForm(true);
    };

    // Handle form input changes
    const handleFormInputChange = (e) => {
        const { name, value } = e.target;
        setFormInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission to update Zustand store
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!formInput) return;
        // Update the Zustand store with the new data
        if (id) {
            updateNode(id, {
                Heading1: formInput.heading1,
                Content1: formInput.content1,
                Heading2: formInput.heading2,
                Content2: formInput.content2,
                Heading3: formInput.heading3,
                Content3: formInput.content3,
            });
        } else {
            console.warn("No node ID provided to update accordion content in Zustand.");
        }
        setShowForm(false);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div>
                <Accordion.Root
                    className="AccordionRoot"
                    type="single"
                    defaultValue="item-1"
                    collapsible
                >
                    {accordionData.map((item) => (
                        <Accordion.Item className="AccordionItem" value={item.id} key={item.id}>
                            <AccordionTrigger>{item.heading}</AccordionTrigger>
                            <AccordionContent>
                                <div className="AccordionContentText">
                                    {item.content}
                                </div>
                            </AccordionContent>
                        </Accordion.Item>
                    ))}
                </Accordion.Root>

                {selected && !showForm && (
                    <button
                        onClick={handleButtonClick}
                        style={{
                            marginTop: '10px',
                            padding: '10px 15px',
                            backgroundColor: '#d42422',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            width: '100%',
                        }}
                    >
                        Edit Accordion Content
                    </button>
                )}
            </div>

            {selected && showForm && formInput && (
                <form
                    onSubmit={handleFormSubmit}
                    style={{
                        padding: '15px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        backgroundColor: '#f9f9f9',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        minWidth: '300px',
                    }}
                >
                    <h3>Edit Accordion Items</h3>
                    {[0, 1, 2].map((index) => (
                        <div key={accordionData[index].id} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label>
                                Heading {index + 1}:
                                <input
                                    type="text"
                                    name={`heading${index + 1}`}
                                    value={formInput[`heading${index + 1}`]}
                                    onChange={handleFormInputChange}
                                    className="nodrag"
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </label>
                            <label>
                                Content {index + 1}:
                                <textarea
                                    name={`content${index + 1}`}
                                    value={formInput[`content${index + 1}`]}
                                    onChange={handleFormInputChange}
                                    rows="3"
                                    className="nodrag"
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                                />
                            </label>
                        </div>
                    ))}

                    <button
                        type="submit"
                        style={{
                            padding: '10px 15px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginTop: '10px',
                        }}
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        style={{
                            padding: '10px 15px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginTop: '5px',
                        }}
                    >
                        Cancel
                    </button>
                </form>
            )}
        </div>
    );
};

const AccordionTrigger = React.memo(React.forwardRef(
    ({ children, className, ...props }, forwardedRef) => (
        <Accordion.Header className="AccordionHeader">
            <Accordion.Trigger
                className={classNames("AccordionTrigger", className)}
                {...props}
                ref={forwardedRef}
            >
                {children}
                <ChevronDownIcon className="AccordionChevron" aria-hidden />
            </Accordion.Trigger>
        </Accordion.Header>
    ),
));

const AccordionContent = React.memo(React.forwardRef(
    ({ children, className, ...props }, forwardedRef) => (
        <Accordion.Content
            className={classNames("AccordionContent", className)}
            {...props}
            ref={forwardedRef}
        >
            <div className="AccordionContentText">{children}</div>
        </Accordion.Content>
    ),
));

export default RadixAccordion;