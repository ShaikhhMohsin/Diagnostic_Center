"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: { children: React.ReactNode } & any) {
  const NextThemesProviderCast = NextThemesProvider as any;
  return (
    <NextThemesProviderCast attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange {...props}>
      {children}
    </NextThemesProviderCast>
  );
}
