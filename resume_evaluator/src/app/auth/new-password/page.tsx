import { NewPasswordForm } from "@/components/auth/new-password-form";
import { Suspense } from "react";

const NewPassword = () => {
    return (
        <Suspense>
            <NewPasswordForm />
        </Suspense>
    );
}

export default NewPassword;