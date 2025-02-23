import { Button } from "@/components/ui/button";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/auth/login-button";
import { RegisterButton } from "@/components/auth/register-buttom";

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

export default async function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <div className="space-y-6 text-center bg-white rounded-lg m-10 pl-4 pr-4 shadow-2xl flex flex-col justify-center items-center h-full w-full max-w-[90vw] gap-20">
        <div className="flex flex-col gap-8 ">
        <h1 className={cn("text-6xl drop-shadow-lg select-none", font.className)}
        >Resume Evaluator</h1>
        <p className="text-2xl drop-shadow-sm">Evaluate your resume and bring you all the relevant jobs to apply for using AI!</p>
        </div>
        <div className="flex flex-row flex-wrap md:flex-nowrap lg:flex-nowrap gap-10 justify-center items-center ml-4 mr-4 w-9/12">
          <LoginButton>
            <Button className="drop-shadow-xl flex-1 w-full p-6 text-[1.5rem]">Sign In</Button>
          </LoginButton>
          <RegisterButton>
            <Button className="drop-shadow-xl flex-1 w-full p-6 text-[1.5rem]">Sign Up</Button>
          </RegisterButton>
        </div>
      </div>
    </main>
  );
}
