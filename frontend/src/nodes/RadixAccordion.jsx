import * as React from "react";
import { Accordion } from "radix-ui";
import classNames from "classnames";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import "../styles/RadixAccordianStyles.css";
import { useStore } from '../store'; // Adjust this path!

const RadixAccordion = ({ selected, id }) => { // Accept 'id' prop for the node
    // State to manage whether the form is shown or not
    const [showForm, setShowForm] = React.useState(false);

    // Get updateNode and nodes from the Zustand store
    const updateNode = useStore((state) => state.updateNode);
    const nodes = useStore((state) => state.nodes);

    // Function to get initial accordion data from the specified node
    const getInitialAccordionDataFromNode = React.useCallback(() => {
        const targetNode = nodes.find(node => node.id === id);
        if (targetNode && targetNode.data) {
            // Reconstruct accordionData from flat node data fields
            return [
                { id: "item-1", heading: targetNode.data.Heading1 || "Is it accessible?", content: targetNode.data.Content1 || "Yes. It adheres to the WAI-ARIA design pattern." },
                { id: "item-2", heading: targetNode.data.Heading2 || "Is it unstyled?", content: targetNode.data.Content2 || "Yes. It's unstyled by default, giving you freedom over the look and feel." },
                { id: "item-3", heading: targetNode.data.Heading3 || "Can it be animated?", content: targetNode.data.Content3 || "Yes! You can animate the Accordion with CSS or JavaScript." },
            ];
        }
        // Fallback to default if node or data is not found
        return [
            { id: "item-1", heading: "Is it accessible?", content: "Yes. It adheres to the WAI-ARIA design pattern." },
            { id: "item-2", heading: "Is it unstyled?", content: "Yes. It's unstyled by default, giving you freedom over the look and feel." },
            { id: "item-3", heading: "Can it be animated?", content: "Yes! You can animate the Accordion with CSS or JavaScript." },
        ];
    }, [id, nodes]); // Depend on id and nodes to re-run if they change

    // State to hold the dynamic content for the accordion
    const [accordionData, setAccordionData] = React.useState(getInitialAccordionDataFromNode());

    // State to hold form input values
    const [formInput, setFormInput] = React.useState({
        heading1: accordionData[0].heading,
        content1: accordionData[0].content,
        heading2: accordionData[1].heading,
        content2: accordionData[1].content,
        heading3: accordionData[2].heading,
        content3: accordionData[2].content,
    });

    // Effect to update accordionData and formInput when the node data in Zustand changes
    React.useEffect(() => {
        const updatedData = getInitialAccordionDataFromNode();
        setAccordionData(updatedData);
        setFormInput({
            heading1: updatedData[0].heading,
            content1: updatedData[0].content,
            heading2: updatedData[1].heading,
            content2: updatedData[1].content,
            heading3: updatedData[2].heading,
            content3: updatedData[2].content,
        });
    }, [nodes, id, getInitialAccordionDataFromNode]);


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

    // Handle form submission to update accordion data and Zustand store
    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Update local accordionData state
        const newAccordionData = [
            { id: "item-1", heading: formInput.heading1, content: formInput.content1 },
            { id: "item-2", heading: formInput.heading2, content: formInput.content2 },
            { id: "item-3", heading: formInput.heading3, content: formInput.content3 },
        ];
        setAccordionData(newAccordionData);
        setShowForm(false); // Hide the form after submission

        // Update the Zustand store with the new data
        if (id) { // Ensure an ID is provided
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

            {selected && showForm && (
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
                    {accordionData.map((item, index) => (
                        <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
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

const AccordionTrigger = React.forwardRef(
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
);

const AccordionContent = React.forwardRef(
    ({ children, className, ...props }, forwardedRef) => (
        <Accordion.Content
            className={classNames("AccordionContent", className)}
            {...props}
        >
            <div className="AccordionContentText">{children}</div>
        </Accordion.Content>
    ),
);

export default RadixAccordion;