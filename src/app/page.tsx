import { Button } from "@/components/ui/button";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

export default async function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <div className="space-y-6 text-center">
        <h1 className={cn("text-6xl drop-shadow-md", font.className)}
        >Resume Evaluator</h1>
        <p className="text-2xl">Evaluate your resume and bring you all the relevant jobs to apply for using AI!</p>
        <LoginButton>
          <Button size='lg'>Sign In</Button>
        </LoginButton>
      </div>
    </main>
  );
}
