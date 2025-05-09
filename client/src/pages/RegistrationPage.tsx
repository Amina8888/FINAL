import React from "react";
import { Group } from "./Group";
import { InteractiveButton } from "../components/InteractiveButton";
import { LoginForm } from "./ModalLoginPage";
import { PasswordHide } from "./PasswordHide";
import { PasswordIsCorrect } from "./PasswordIsCorrect";
import { TextInputConfirm } from "./TextInputConfirm";
import { TextInputEmail } from "./TextInputEmail";

export const ModalRegisterPage = (): JSX.Element => {
  return (
    <div className="flex h-[1024px] items-center gap-2.5 px-[513px] py-[280px] relative bg-[#007aff45] w-full min-w-[1440px]">
      <div className="w-[414px] h-[464px] items-center justify-end relative overflow-hidden flex flex-col">
        <LoginForm className="!mr-[-0.50px] !ml-[-0.50px]" />
        <InteractiveButton
          buttonBaseText="Register"
          className="!h-[77px] !-mt-32 !justify-center !items-center"
          property1="button-base"
        />
      </div>

      <div className="w-[328px] h-[297px] items-start justify-center absolute top-[307px] left-[556px] flex flex-col">
        <div className="items-start justify-center gap-2.5 p-2.5 relative self-stretch w-full flex-[0_0_auto] flex flex-col">
          <TextInputEmail
            className="!h-[57px] !w-[305px]"
            divClassName="!text-sm"
            labelProps="Email address"
            stateProp="default"
          />
          <PasswordHide
            className="!w-[305px] !relative"
            ellipseClassName="!rounded-[6.69px/6.5px]"
            property1="password-unchecked"
            textInputConfirmStateActiveClassName="!h-[62px] !absolute !left-0 !w-[305px] !top-0"
            uncheckedPasswordClassName="!left-[278px]"
            vector="image.svg"
            vectorClassName="!left-[-566px] !top-[-381px]"
          />
          <TextInputConfirm
            className="!flex-[0_0_auto] !w-[305px]"
            labelProps="Confirm password"
            stateProp="default"
          />
          <PasswordIsCorrect />
        </div>

        <Group />
      </div>
    </div>
  );
};
