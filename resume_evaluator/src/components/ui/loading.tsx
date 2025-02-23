import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";

export default function Loading() {

    const [opacity, setOpacity] = useState(0); 
    useEffect(() => {
        const interval = setInterval(() => {
            if (opacity >= 1) {
                clearInterval(interval);
            }
            setOpacity((prevOpacity) => Math.min(prevOpacity + 0.1, 1));
        }, 10);
        return () => clearInterval(interval);
    }, [opacity]);

    return (
        <div className="bg-white relative w-80 h-80  rounded-lg shadow-sm">
        <p className="text-3xl self-start text-center pt-12">Loading</p>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <HashLoader />
        </div>
        </div>
    );
}