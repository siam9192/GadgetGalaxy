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
import { capitalizeFirstWord, getFormValues, uploadImageToImgBB } from "@/utils/helpers";
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { IoCameraOutline } from "react-icons/io5";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { TfiTrash } from "react-icons/tfi";
import { toast } from "sonner";

const page = () => {
  const { user, isLoading, refetch } = useCurrentUser();
  const [newProfilePhoto, setNewProfilePhoto] = useState<File | null>(null);
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(user?.profilePhoto || null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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
  const handelSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    const target = e.target as HTMLFormElement;
    let values = getFormValues(target, ["fullName", "phoneNumber", "dateOfBirth", "gender"]);

    const errors: Record<string, string> = {};

    // Basic validation
    if (!values.fullName || values.fullName.trim().length < 3) {
      errors.fullName = "Full name must be at least 3 characters long.";
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (values.phoneNumber && !phoneRegex.test(values.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid phone number.";
    }

    if (values.dateOfBirth && !values.dateOfBirth) {
      const dob = new Date(values.dateOfBirth);
      const now = new Date();
      if (isNaN(dob.getTime()) || dob >= now) {
        errors.dateOfBirth = "Please enter a valid date of birth.";
      }
    }

    if (Object.values(errors).length) {
      target[Object.keys(errors)[0]].focus();
      return setErrors(errors);
    }
    console.log(values);

    setIsUpdating(true);

    try {
      values = Object.entries(values).reduce(
        (acc, [key, value]) => {
          if (value) {
            acc[key as string] = value;
          }
          return acc;
        },
        {} as Record<string, string>,
      );

      const payload: any = {
        ...values,
        addresses,
      };

      if (newProfilePhoto) {
        const url = await uploadImageToImgBB(newProfilePhoto);
        payload.profilePhoto = url;
      } else if (user?.profilePhoto) {
        payload.profilePhoto = user.profilePhoto;
      }

      const res = await updateProfile(payload);

      if (!res?.success) {
        throw new Error(res?.message || "Something went wrong!");
      }
      toast.success("Profile updated successfully!");
      refetch();
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
        <form onSubmit={handelSubmit}>
          <div className="space-y-3">
            <div>
              <label className="   block text-start 0font-medium text-[1rem]" htmlFor="fullName">
                Full Name*
              </label>

              <input
                className={
                  "w-full mt-1 px-2 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
                }
                type="text"
                name="fullName"
                defaultValue={user?.fullName}
              />
              {errors.fullName && <p className="mt-1 text-red-500 text-sm">{errors.fullName}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="  block text-start 0font-medium text-[1rem]" htmlFor="fullName">
                  Email*
                </label>

                <input
                  className={
                    "w-full mt-1 px-2 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
                  }
                  readOnly
                  type="text"
                  name="email"
                  defaultValue={user?.email}
                />
              </div>
              <div>
                <label className="  block text-start 0font-medium text-[1rem]" htmlFor="fullName">
                  Phone Number
                </label>

                <input
                  className={
                    "w-full mt-1 px-2 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
                  }
                  type="text"
                  name="phoneNumber"
                  defaultValue={user?.phoneNumber}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-red-500 text-sm">{errors.phoneNumber}</p>
                )}
              </div>
              <div>
                <label className="block text-start 0font-medium text-[1rem]" htmlFor="fullName">
                  Date of Birth
                </label>

                <input
                  className={
                    "w-full mt-1 px-2 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
                  }
                  type="date"
                  name="dateOfBirth"
                  defaultValue={
                    user?.dateOfBirth ? new Date(user?.dateOfBirth).toLocaleString() : ""
                  }
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-red-500 text-sm">{errors.dateOfBirth}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="" className=" ">
                Gender
              </label>
              <div className="mt-1 flex  flex-wrap items-center gap-4 ">
                {Object.values(EGender).map((gender) => (
                  <div
                    key={gender}
                    className="flex items-center gap-2 px-4 py-4 border-2 rounded-md border-gray-500/15"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      className="size-5 accent-info"
                      defaultChecked={user?.gender === gender}
                    />
                    <label htmlFor="gender-male">{capitalizeFirstWord(gender)}</label>
                  </div>
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
        </form>
      </div>
    </div>
  );
};

export default page;
