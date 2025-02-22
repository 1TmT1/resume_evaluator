import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({
            where: { email }
        })
        return user;
    } catch {
        return null;
    }
}

export const getUserById = async (id: string | undefined) => {
    if (id == null) return null;
    try {
        const user = await db.user.findUnique({
            where: { id: id }
        })
        
        return user;
    } catch {
        return null;
    }
}

export const getOauthAccount = async (id: string) => {
    try {
        const account = await db.account.findFirst({
            where: {userId: id}
        });
        
        if (account) return true;
        return false;
    } catch {
        return null;
    }
}

export const deleteFileUploadKey = async (email: string) => {
    try {
        const user = await db.user.update({
            where: { email },
            data: {
                fileUploadJWT: "",
            }
        });

        if (user.fileUploadJWT === "") {
            return true;
        }

        return false;
    } catch {
        return false;
    }
}

export const setFileUploadKey = async (email: string, key: string) => {
    try {
        const user = await db.user.update({
            where: { email },
            data: {
                fileUploadJWT: key,
            }
        });

        if (user.fileUploadJWT === key) {
            return true;
        }
        
        return false;
    } catch {
        return false;
    }
}

export const getUserByCID = async (fileCID: string) => {
    try {
        const user = await db.user.findFirst({
            where: { fileCID: fileCID }
        });

        if (user) {
            return true;
        }

        return false;
    } catch {
        return false;
    }
}

export const setUserFileCID = async (email: string, cid: string) => {
    if (email == null) return false;
    try {
        const userBefore = await getUserByEmail(email);
        if (userBefore && userBefore.fileCID === cid) {
            return true;
        }

        const user = await db.user.update({
            where: { email },
            data: {
                evaluation: null,
                fileCID: cid,
            }
        });
        if (user.fileCID === cid && user.evaluation == null) {
            return true;
        }

        return false;
    } catch {
        return false;
    }
}

export const setUserCVEvaluation = async (id: string, evaluation: string) => {
    try {
        const user = await db.user.update({
            where: {id},
            data: {
                evaluation: evaluation
            } 
        });

        if (user.evaluation === evaluation) {
            return true;
        }

        return false;
    } catch {
        return false;
    }
}