import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PuffLoader } from "react-spinners";

const scrollbarStyles = {
    customScrollbar: `
        .custom-scrollbar::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f0f0f0;
            border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #c4c4c4;
            border-radius: 10px;
            // border: 3px solid #000000;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #a0a0a0;
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
            background-color: transparent;
        }
`,
};

type getJobsProps = {
    jobTitle: string;
    location: string;
};

export const GetJobs = ({ jobTitle, location }: getJobsProps) => {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const findJobs = async () => {
        if (jobs.length !== 0) {
            setJobs([]);
        } else {
            try {
                setIsLoading(true);
                const res = await fetch(`/api/find-jobs?location=${location}&job=${jobTitle}`);
                if (!res.ok) throw new Error("Failed fetching jobs...");
                
                const jobsRes = await res.json();
                setIsLoading(false);
                setJobs(jobsRes.message);
                if (jobsRes.message.length === 0) {
                    toast.error("Couldn't find jobs");
                }
            } catch {
                setIsLoading(false);
                setJobs([]);
                toast.error("Couldn't find jobs");
            }
        }
    }

    useEffect(() => {
        const styleTag = document.createElement("style");
        styleTag.innerHTML = scrollbarStyles.customScrollbar; // Inject the custom scrollbar styles
        document.head.appendChild(styleTag);

        return () => {
        document.head.removeChild(styleTag);
        };
    }, [jobs]);

    return (
        <>
            <Button onClick={findJobs} disabled={isLoading} className="w-full bg-yellow-500 hover:bg-yellow-300 pt-6 pb-6 select-none">
                {jobs.length === 0 ? 'Find Jobs' : 'Close Jobs'}
            </Button>
            <div className="flex justify-center items-center mt-4">
                <PuffLoader loading={isLoading} color="orange" />
            </div>
            <div className="overflow-y-auto overflow-x-hidden custom-scrollbar mt-4">
                <ul className="mr-2">
                    {jobs.map((job, index) => (
                        <li key={index}
                        className="bg-blue-700 hover:bg-blue-400 duration-300 pl-4 p-2 mb-3 rounded-lg">
                            <a target="_blank" href={job[0]} className="block w-full h-full">
                                Company: {job[2]}<br />Location: {job[3]}<br />{job[1]}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default GetJobs;