"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from 'next-intl'

export default function SignInForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const t = useTranslations('guest')
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {t('login_title')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('login_sub_title')}
            </p>
          </div>
          <div>
            <div className="space-y-6">
              <div>
                <Label>
                  {t('user_name')} <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder={t('username_placeholder')}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <Label>
                  {t('password')}  <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t('password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>
              <div>
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => login(username, password)}
                >
                  {t('login_btn')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
