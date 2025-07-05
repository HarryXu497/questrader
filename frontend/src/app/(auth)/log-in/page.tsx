"use client";

import Input from "@/lib/components/Input";
import PageCard from "@/lib/components/PageCard";
import auth from "@/lib/firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter()

  async function onLogIn(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const credentials = await signInWithEmailAndPassword(auth, email, password);

    router.push("/level/1");
  }

  return (
    <div className="h-[calc(100vh_-_5.375rem)] max-w-[54rem] min-w-[16rem] w-[35%] m-auto flex flex-col justify-center items-center">
      <PageCard className="h-auto w-full">
        <form className="flex flex-col gap-4 p-5" action={onLogIn}>
          <h1 className="text-3xl font-bold">Welcome Back!</h1>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="text"
              name="email"
              placeholder="Enter your email here"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password here"
            />
          </div>

          <div className="flex flex-col gap-3 items-center mt-4">
            <button className="px-7 py-3 border-1 bg-accent border-accent text-white rounded-[20px] text-lg font-bold w-full hover:cursor-pointer">
              Log in
            </button>
            <p>
              Don't have an account?{" "}
              <a href="/sign-up" className="text-accent underline">
                Sign up
              </a>{" "}
              instead
            </p>
          </div>
        </form>
      </PageCard>
    </div>
  );
}
