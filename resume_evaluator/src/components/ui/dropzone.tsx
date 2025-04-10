"use client";

import React, {Dispatch, FormEvent, SetStateAction, useCallback, useEffect, useState} from "react";
import { FileRejection, useDropzone } from 'react-dropzone';
import { Button } from "./button";
import toast from "react-hot-toast";

type DropzoneProps = {
    isUserUploadedCV: boolean;
    setIsUserUploadedCV: Dispatch<SetStateAction<boolean>>;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const Dropzone = ({ isUserUploadedCV, setIsUserUploadedCV, setIsLoading }: DropzoneProps) => {

    const [file, setFile] = useState<File>();
    const [response, setResponse] = useState(JSON.stringify({}));
    const [loading, setLoading] = useState(false);

    const validateFile = useCallback((file: File) => {
        const maxFileSize = 1024 * 1024 * 2;
        const allowedFileTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const allowedExtensions = ['pdf', 'docx'];
        const allowedMagicNumbers: {
            pdf: number[],
            docx: number[],
        } = {
            pdf: [0x25, 0x50, 0x44, 0x46], // PDF starts with %PDF
            docx: [0x50, 0x4B, 0x03, 0x04], // DOCX is a ZIP file, starts with PK03
        };
        
        
        if (file.size >= maxFileSize) {
            return { error: `File is too large, max file size is ${maxFileSize}.` };
        }

        if (!allowedFileTypes.includes(file.type)) {
            return { error: "Unsupported file types. Use only .docx and .pdf" };
        }

        const fileExtension = file.name.split('.').pop()?.toLocaleLowerCase();
        if (fileExtension && !allowedExtensions.includes(fileExtension)) {
            return { error: "Unsupported file extension." };
        }

        if (fileExtension && (fileExtension in allowedMagicNumbers)) {
            const magicNumbers = allowedMagicNumbers[fileExtension as keyof typeof allowedMagicNumbers];
            const reader = new FileReader();
            const buffer = new Uint8Array(reader.result as ArrayBuffer);
            
            for (let i = 0; i < magicNumbers.length; i++) {
                if (buffer[i] !== magicNumbers[i]) {
                    return { error: "Unsupported file types. Use only .docx and .pdf" };
                }
            }
        }

        return { success: `File selected: ${file.name}` };
    }, []);

    const onDropAccepted = useCallback((acceptedFiles: File[]) => {
        
        // Check if I only got one file
        if (acceptedFiles.length > 1) {
            setLoading(false);
            setResponse(JSON.stringify({ error: "Upload only one file." }));
            setFile(undefined);
            toast.error("Failed select files...");
        } else if (acceptedFiles.length === 1) {
            if(validateFile(acceptedFiles[0])){
                setResponse(JSON.stringify({}));
                setFile(acceptedFiles[0]);
                toast.success("Selected the file successfully!");
            }
        }
    }, [validateFile]);
    
    const onDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
        if (rejectedFiles.length) {
            setResponse(JSON.stringify({ error: "Unsupported file types. Use only .docx and .pdf" }));
            setFile(undefined);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDropAccepted,
        onDropRejected,
        accept: {
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/pdf': ['.pdf'],
        },
    });

    const serverFileValidation = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/check-file', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                return true;
            } else {
                return false;
            }
        } catch {
            return false;
        }
    }

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            setResponse(JSON.stringify({ error: 'Please provide a file.'}));
            return;
        }
    
        try {
            setLoading(true);
            setResponse(JSON.stringify({}));
    
            const isValidFile = await serverFileValidation(file);

            if (isValidFile) {
                const formData = new FormData();
                formData.append('file', file);

                const setFileCIDRes = await fetch('/api/update-cv', {
                    method: 'POST',
                    body: formData
                });

                if (setFileCIDRes) {
                    toast.success("Uploaded your CV successfully!");
                    setIsLoading(true);
                    setIsUserUploadedCV(isUserUploadedCV ? false : true);
                    return;
                }
                toast.error("Failed uploading your CV");
            } else {
                setFile(undefined);
                setResponse(JSON.stringify({ error: "Unsupported file types. Use only .docx and .pdf" }));
                toast.error("Failed uploading your CV");
            }
            setLoading(false);
        } catch {
            setLoading(false);
            setResponse(JSON.stringify({ error: 'An error occurred...' }));
            toast.error("Failed uploading your CV");
        }
    }
    
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
        <form onSubmit={onSubmit} style={{opacity: opacity}} className={`h-[calc(100vh-3rem-106px)] max-h-[100vh] bg-white p-12 m-6 rounded-lg shadow-sm flex flex-col items-center`}>
            <div className="h-full flex flex-col justify-center items-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Upload Your CV
            </h2>
            <p className="text-gray-500 mb-6">
            Please upload your CV in PDF, DOC, or DOCX format.
            </p>
            
            <div {...getRootProps({
                className: "p-8 text-center border-2 border-dashed rounded-lg select-none cursor-pointer",
            })}>
                <input {...getInputProps()} disabled={loading} />
                { isDragActive ? (
                    <p>Drop the cv here...</p>
                ) : (
                    <p>Drag & Drop the cv here or click to select files</p>
                )}
            </div>
            <div className="flex flex-col gap-8 content-center items-center mt-4">
                <p className={`h-[20px] ${file ? "text-green-500" : "text-red-500"}`}>
                    {file ? 
                    `File Selected: ${file.name}` :
                    JSON.parse(response).error 
                    }
                </p>
                <Button type="submit" disabled={loading} size="lg" className="bg-blue-600 hover:bg-blue-500 mt-4 w-min">
                    {loading ? 'Processing...' : 'Upload CV'}
                </Button>
            </div>
            </div>
        </form>
    );
}

export default Dropzone;