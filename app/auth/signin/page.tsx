import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import SignInForm from "@/components/Nav/auth/SignInForm";

const SignIn = async () => {
  // const session = await getServerSession(authOptions);

  // if (session) {
  //   redirect("/");
  // }

  return (
    <section className="flex items-center justify-center mt-48 text-white">
      <SignInForm />
    </section>
  );
};

export default SignIn;
