import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
  const defaultLocale = "jp";

  const locale =
    cookies().get("NEXT_LOCALE")?.value ||
    headers().get("accept-language")?.split(",")[0]?.split("-")[0] ||
    defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
