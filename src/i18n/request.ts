import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
  const locale = process.env.APP_LANG || 'en';

  // const locale =
  //   (await cookies()).get("NEXT_LOCALE")?.value ||
  //   (await headers()).get("accept-language")?.split(",")[0]?.split("-")[0] ||
  //   defaultLocale;

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
