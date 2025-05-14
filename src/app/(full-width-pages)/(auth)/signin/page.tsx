import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guest");

  return {
    title: t('logo'),
    description: t('sub_logo'),
    // other metadata...
  };
}

export default function SignIn() {
  return <SignInForm />;
}