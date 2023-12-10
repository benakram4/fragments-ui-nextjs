import { useState, useEffect } from "react";
import { getUserFragmentsMetaData } from "../../utilities/api";
import DeleteFragmentButton from "./DeleteFragmentButton";
import DisplayFragmentButton from "./DisplayFragmentButton";
import EditFragmentButton from "./EditFragmentButton";
import ConvertFragmentButton from "./ConvertFragmentButton";


export default function FragmentsAccordion({ fragUploadedCounter }) {

  // state for the accordion
  const [metaData, setMetaData] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [deleteFragmentId, setDeleteFragmentId] = useState(null);
  const [editFragment, setEditFragment] = useState(0);

  const handleClick = (accordionId) => {
    setOpenAccordion(openAccordion === accordionId ? null : accordionId);
  };

  useEffect(() => {
    async function fetchMetaData() {
      const data = await getUserFragmentsMetaData();
      setMetaData(data?.fragments);
    }

    fetchMetaData();
  }, [fragUploadedCounter, deleteFragmentId, editFragment]);

  if (!metaData) {
    return <div>Loading...</div>;
  }

  // if there are no fragments, return a message
  if (metaData.length === 0) {
    return (
      <div className="py-5">
        <h2 className="py-5 font-medium text-xl">Your Fragments</h2>
        <div className="p-5 overflow-auto break-words border border-indigo-200 dark:border-indigo-700 dark:bg-gray-900 rounded">
          <p className="mb-2 text-left leading-relaxed text-gray-500 dark:text-gray-400">
            You have no fragments. Upload some!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5">
      <h2 className="py-5 font-medium text-xl">Your Fragments</h2>
      <div id="accordion-collapse" data-accordion="collapse">
        {metaData.map((item, index) => (
          <div key={item.id}>
            <h2 id={`accordion-collapse-heading-${index}`}>
              <button
                type="button"
                className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-b-0 border-indigo-200 rounded-t-xl focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800 dark:border-gray-700 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-800"
                data-accordion-target={`#accordion-collapse-body-${index}`}
                onClick={() => handleClick(index)}
                aria-expanded={openAccordion === index}
                aria-controls={`#accordion-collapse-body-${index}`}
              >
                <span>{`Fragment ${index + 1} With ID: ${
                  item.id.split("-")[0]
                }...`}</span>
                <svg
                  data-accordion-icon
                  className={
                    openAccordion === index
                      ? "w-3 h-3 rotate-0 shrink-0"
                      : "w-3 h-3 rotate-180 shrink-0"
                  }
                  aria-hidden={openAccordion === index}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5 5 1 1 5"
                  />
                </svg>
              </button>
            </h2>
            <div
              id={`#accordion-collapse-body-${index}`}
              className={openAccordion === index ? "" : "hidden"}
              aria-labelledby={`#accordion-collapse-heading-${index}`}
            >
              <div className="p-5 overflow-auto break-words border border-b-0 border-indigo-200 dark:border-indigo-700 dark:bg-gray-900">
                <p className="mb-2 text-left leading-relaxed text-gray-500 dark:text-gray-400">
                  ID: {item.id}
                  <br />
                  Owner ID: {item.ownerId}
                  <br />
                  Type: {item.type}
                  <br />
                  Size: {item.size}
                  <br />
                  Created: {item.created}
                  <br />
                  Updated: {item.updated}
                </p>
                <DisplayFragmentButton fragmentId={item.id} fragmentType={item.type} editFragment={editFragment} />
                <DeleteFragmentButton fragmentId={item.id} setDeleteFragmentId={setDeleteFragmentId}  />
                <EditFragmentButton fragmentId={item.id} fragmentType={item.type} editFragment={editFragment} setEditFragment={setEditFragment} />
                <ConvertFragmentButton fragmentId={item.id} fragmentType={item.type} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
