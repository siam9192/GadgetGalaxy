"use client";
import Form from "@/components/hook-form/Form";
import FormCheckbox from "@/components/hook-form/FormCheckbox";
import FormInput from "@/components/hook-form/FormInput";
import AddAddressPopup from "@/components/ui/AddAddressPopup";
import EditAddressPopup from "@/components/ui/EditAddressPopup";
import { useCurrentUser } from "@/provider/CurrentUserProvider";
import { updateProfile } from "@/services/profile.service";
import { EGender } from "@/types/user.type";
import { defaultImagesUrl } from "@/utils/constant";
import { capitalizeFirstWord, uploadImageToImgBB } from "@/utils/helpers";
import ProfileValidations from "@/validations/profile.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { IoCameraOutline } from "react-icons/io5";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { TfiTrash } from "react-icons/tfi";

const page = () => {
  const { user, isLoading, refetch } = useCurrentUser();
  const [newProfilePhoto, setNewProfilePhoto] = useState<File | null>(null);
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(user?.profilePhoto || null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (!user) return;
    setAddresses(user.addresses || []);
    setProfilePhoto(user.profilePhoto);
  }, [user]);

  if (isLoading) return null;

  const removeAddress = (index: number) => {
    setAddresses((p) => p.filter((_, idx) => idx !== index));
  };

  const handelImageInputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setNewProfilePhoto(files[0]);
  };

  const handelRemoveProfilePhoto = () => {
    setProfilePhoto(null);
    setNewProfilePhoto(null);
  };

  const handelSetDefault = (index: number) => {
    setAddresses(
      addresses.map((_, idx) => {
        if (index === idx) _.isDefault = true;
        else _.isDefault = false;
        return _;
      }),
    );
  };

  const isDefaultExist = addresses.find((_) => _.isDefault === true);
  const handelSubmit = async (values: any) => {
    console.log(values);
    setIsUpdating(true);
    try {
      const payload: any = {
        ...values,
        profilePhoto,
        addresses,
      };
      if (newProfilePhoto) {
        const url = await uploadImageToImgBB(newProfilePhoto);
        payload.profilePhoto = url;
      }

      const res = await updateProfile(payload);
      if (!res?.success) {
        throw new Error(res?.message || "Something went wrong!");
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div className="bg-white md:p-10 p-5">
      {/* Profile Photo */}
      <div className="flex md:flex-row  flex-col  items-center gap-8">
        <div className="size-fit  relative">
          <img
            src={
              newProfilePhoto
                ? URL.createObjectURL(newProfilePhoto)
                : profilePhoto || defaultImagesUrl.profile
            }
            alt=""
            className="size-28 md:size-32 aspect-square rounded-full"
          />
          <input
            ref={imageInputRef}
            onChange={handelImageInputOnChange}
            type="file"
            accept="/image/*"
            className="hidden"
          />
          <button
            onClick={() => imageInputRef.current?.click()}
            className="p-2 bg-primary text-white absolute right-0 bottom-2 text-xl rounded-full border-2"
          >
            <IoCameraOutline />
          </button>
        </div>
        <div className="flex items-center gap-2  font-primary font-medium">
          <button className="px-4 py-3 rounded-md bg-primary text-white">Upload New</button>
          <button
            onClick={handelRemoveProfilePhoto}
            className="px-4 py-3 rounded-md bg-gray-100  text-black"
          >
            Delete Avatar
          </button>
        </div>
      </div>

      <div className="mt-5">
        <Form
          onSubmit={handelSubmit}
          resolver={zodResolver(ProfileValidations.UpdateProfileValidation)}
          defaultValues={user as any}
        >
          <div className="space-y-3">
            <FormInput
              name="fullName"
              label="Full Name"
              className="w-full mt-1 px-2 focus:bg-blue-50 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
            />
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                className="w-full mt-1 px-2 focus:bg-blue-50 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
                name="email"
                label="Email"
                readonly
              />
              <FormInput
                className="w-full mt-1 px-2 focus:bg-blue-50 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
                name="phoneNumber"
                label="Mobile Number"
              />
              <FormInput
                type="date"
                className="w-full mt-1 px-2 focus:bg-blue-50 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
                name="dateOfBirth"
                label="Date of Birth"
              />
            </div>

            <div>
              <label htmlFor="" className=" ">
                Gender
              </label>
              <div className="mt-1 flex items-center gap-4 ">
                {/* <div className="flex items-center gap-2 px-4 py-4 border-2 rounded-md border-gray-500/15">
                  <input
                    type="radio"
                    name="gender"
                    id="gender-male"
                    value={EGender.MALE}
                    className="size-5 accent-info"
                  />
                  <label htmlFor="gender-male">Male</label>
                </div>
                <div className="flex items-center gap-2 px-4 py-4 border-2 rounded-md border-gray-500/15">
                  <input
                    type="radio"
                    name="gender"
                    id="gender-female"
                    value={EGender.FEMALE}
                    className="size-5 accent-info"
                  />
                  <label htmlFor="gender-male">Female</label>
                </div>
                <div className="flex items-center gap-2 px-4 py-4 border-2 rounded-md border-gray-500/15">
                  <input
                    type="radio"
                    name="gender"
                    id="gender-other"
                    value={EGender.OTHER}
                    className="size-5 accent-info"
                  />
                  <label htmlFor="gender-other">Other</label>
                </div> */}
                {Object.values(EGender).map((gender) => (
                  <FormCheckbox
                    key={gender}
                    name="gender"
                    value={gender}
                    label={capitalizeFirstWord(gender)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-[1rem]">Addresses:</h3>
              <div className="mt-3 space-y-2">
                {addresses.map((address, index) => {
                  const str: string = Object.entries({
                    district: address.district,
                    zone: address.zone,
                    line: address.line,
                  })
                    .reduce((acc, [key, value]) => {
                      acc.push(`${capitalizeFirstWord(key)}:${value || "N/A"}`);
                      return acc;
                    }, [] as string[])
                    .join(", ");
                  return (
                    <div
                      key={index}
                      className="flex flex-col  flex-wrap gap-2  px-2 py-3 rounded-md  border-2 border-gray-700/20 text-white relative"
                    >
                      <input
                        type="radio"
                        defaultChecked={
                          isDefaultExist ? address.isDefault : index === 0 ? true : false
                        }
                        value={address.id}
                        className="size-5 accent-info"
                        onChange={(e) => e.target.checked && handelSetDefault(index)}
                      />
                      <label htmlFor="" className="text-wrap text-black">
                        {str}
                      </label>
                      <div className="absolute top-1 right-1 flex items-center gap-2">
                        <EditAddressPopup
                          defaultValues={address as any}
                          onSave={(values) =>
                            setAddresses((p) =>
                              p.map((_, idx) => {
                                if (index == idx) {
                                  _ = values;
                                }
                                return _;
                              }),
                            )
                          }
                        >
                          <button
                            type="button"
                            className="text-xl hover:text-primary text-black p-1 bg-gray-100 rounded-full"
                          >
                            <MdOutlineModeEditOutline />
                          </button>
                        </EditAddressPopup>
                        <button
                          type="button"
                          onClick={() => removeAddress(index)}
                          className="text-xl hover:text-red-500 text-black p-1 bg-gray-100 rounded-full"
                        >
                          <TfiTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <AddAddressPopup onAdd={(values) => setAddresses((p) => [...p, values])}>
                <button type="button" className="mt-1 font-medium text-primary">
                  Add New
                </button>
              </AddAddressPopup>
            </div>
          </div>
          <div className="mt-5 text-end">
            <button
              disabled={isUpdating}
              type="submit"
              className="px-6 py-4 bg-primary disabled:bg-gray-100 disabled:text-gray-700 text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
          {errorMessage && <p className="text-info mt-3 font-medium">{errorMessage}</p>}
        </Form>
      </div>
    </div>
  );
};

export default page;
