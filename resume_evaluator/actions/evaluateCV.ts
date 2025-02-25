"use server";

import { pinata } from "@/lib/pinata";
import mammoth from "mammoth";
import { PdfReader } from "pdfreader";
import OpenAI from "openai";
import { auth } from "@/auth";
import { getUserById, setUserCVEvaluation } from "../data/user";

const openai = new OpenAI({
    apiKey: process.env.GPT_API_KEY,
});

const extractTextFromPDF = async(buffer: Buffer) => {
    return new Promise((resolve, reject) => {
        let text = "";
        new PdfReader().parseBuffer(buffer, (err, item) => {
            if (err) reject(err);
            else if(!item) resolve(text);
            else if(item) text += item.text + " ";
        });
    }); 
}

export const evaluateCV = async (fileCID: string) => {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        if (userId) {
            const user = await getUserById(userId);
            if (user?.evaluation) {
                return user.evaluation;
            }
        } else {
            return null;
        }
        
        const fileTypes = [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/pdf'
        ];
        
        const { data, contentType } = await pinata.gateways.get(fileCID);
        if (data instanceof Blob) {
            const arrayBuffer = await data.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            let extractedText = null;
            
            if (contentType === fileTypes[0]) { // docx file
                const raw = await mammoth.extractRawText({ buffer });
                extractedText = raw.value;
            } else if (contentType === fileTypes[1]) { // pdf file
                try {
                    extractedText = await extractTextFromPDF(buffer);
                } catch {
                    throw new Error("Couldn't extract text from pdf.");
                }
            } else {
                return null;
            }

            if (extractedText) {
                const completion = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            "role": "system", 
                            "content": `Extract the following details from the provided CV:
                                - Key skills (as a bullet-point list) (best 9, must contain 9 always)
                                - Best matching job title (only one)
                                - Country (only one)
                                - Points to improve in the CV with rephrased suggestions (explain exactly where to improve and why with content related specific to the resume provided).
                                    - Suggestion: take the text from the resume and change it according to the reason (So the user can cut and copy to his/her resume)
                                - CV Score (return one number of the ATS score of the resume)

                                Return in this JSON format:
                                {
                                    "key_skills": [key_skill],
                                    "job_title": "",
                                    "country": "",
                                    "points_to_improve": [
                                        {
                                            "suggestion": "",
                                            "reason": "",
                                        }
                                    ],
                                    "cv_score": ATS_resume_score
                                }`,
                        },
                        { 
                            "role": "user", 
                            "content": `${extractedText}`, 
                        },
                    ],  
                    temperature: 0.3,
                });
                
                if (!completion) {
                    return null;
                }

                const finalEvaluation = completion.choices[0].message.content;
                if (finalEvaluation) {
                    const isSetEvaluation = await setUserCVEvaluation(userId, finalEvaluation);
                    if (isSetEvaluation) return finalEvaluation;
                    throw new Error("There was an error setting CV evaluation.");
                }
                throw new Error("Couldn't get evaluation.");
            }
        }
    } catch (err) {
        console.log(err);
        return null;
    }
}
