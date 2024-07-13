import FlexContainer from "@/components/FlexContainer";
import GridContainer from "@/components/GridContainer";
import Heading from "@/components/Heading";
import NextButton from "@/components/NextButton";
import Wrapper from "@/components/Wrapper";
import { cn } from "@/lib/utils";
import { Checkbox, Input } from "@nextui-org/react";
import { Form, Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";

import {
  fromAddress,
  fromLatLng,
  fromPlaceId,
  geocode,
  GeocodeOptions,
  OutputFormat,
  RequestType,
  setDefaults,
  setKey,
  setLanguage,
  setLocationType,
  setRegion,
} from "react-geocode";

type Props = {};

const apiKey = "AIzaSyCuhqrc3fxX0R9xdRn7ejsMUUpmdo2tRuM";

const Index = (props: Props) => {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const initialValues = {
    pages: "",
    color: "black&white",
    spiralBinding: true,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    altPhoneNumber: "",
    shippingAddress: "",
    country: "",
    pincode: "",
    state: "",
    district: "",
  };

  setDefaults({
    key: apiKey,
    language: "en",
    region: "in",
    outputFormat: OutputFormat.JSON,
  });

  const handleSubmit = (
    values: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>,
  ) => {
    console.log(values);
  };

  const handleFetchLocation = async (
    pincode: string,
    setFieldValue: any,
    setFieldError: any,
  ) => {
    if (pincode?.length !== 6) {
      return alert("Please enter a valid pincode");
    }
    console.log(pincode, "pincode");
    try {
      const response = await fromAddress(pincode);
      console.log(response);
      if (response.results.length > 0) {
        const { address_components } = response.results[0];
        const country = address_components.find(
          (comp: { types: string[]; long_name: string }) =>
            comp.types.includes("country"),
        )?.long_name;
        const state = address_components.find(
          (comp: { types: string[]; long_name: string }) =>
            comp.types.includes("administrative_area_level_1"),
        )?.long_name;
        const city = address_components.find(
          (comp: { types: string[]; long_name: string }) =>
            comp.types.includes("locality"),
        )?.long_name;
        setFieldValue("country", country);
        setFieldValue("state", state);
        setFieldValue("district", city);
        setFieldError("country", "");
        setFieldError("state", "");
        setFieldError("district", "");
      } else {
        alert("No location found");
      }
    } catch (error) {
      const err = error as Error & { message: string };
      alert(err.message);
    }
  };
  return (
    <Wrapper>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={Yup.object().shape({
          pages: Yup.number()
            .required("Required")
            .min(1, "Minimum 1 page required"),
          color: Yup.string().required("Please select a color profile"),
          firstName: Yup.string().required("Required"),
          lastName: Yup.string().required("Required"),
          email: Yup.string().email("Invalid email").required("Required"),
          phoneNumber: Yup.string().required("Required"),
          shippingAddress: Yup.string().required("Required"),
          pincode: Yup.string().required("Required"),
          state: Yup.string().required("Required"),
          district: Yup.string().required("Required"),
          country: Yup.string().required("Required"),
        })}
      >
        {({
          values,
          handleChange,
          setFieldValue,
          errors,
          touched,
          setFieldError,
        }) => (
          <Form className="grid grid-cols-3">
            <FlexContainer
              variant="column-start"
              gap="xl"
              //   className="w-full max-w-lg pb-20"
              className="col-span-2 w-full max-w-lg"
            >
              <Heading variant="h2">Print Shop</Heading>
              <Heading variant="h4" className="font-medium text-indigo-500">
                Instructions
              </Heading>
              <FlexContainer
                variant="row-start"
                wrap="nowrap"
                className="w-full"
              >
                <NextButton
                  isIcon
                  colorScheme="flat"
                  className={cn(
                    "h-10 w-10 bg-zinc-900 text-white hover:bg-zinc-700 active:bg-zinc-800",
                  )}
                >
                  1
                </NextButton>
                <FlexContainer variant="column-start" gap="sm">
                  <Heading variant="h5" className="items-center">
                    Enter the no of pages (including both side)
                  </Heading>
                  <span className="text-sm font-medium">
                    (For e.g. one page has 2 sides so no of pages = 2)
                  </span>
                  <Input
                    type="number"
                    name="pages"
                    label="No of pages"
                    labelPlacement="outside"
                    placeholder="Enter the no of pages"
                    classNames={{
                      inputWrapper: "border",
                      label: "font-semibold",
                    }}
                    min={1}
                    value={values.pages.toString()}
                    onChange={handleChange}
                    isInvalid={!!errors.pages && touched.pages}
                    errorMessage={errors.pages}
                    color={errors.pages ? "danger" : "default"}
                  />
                </FlexContainer>
              </FlexContainer>
              <FlexContainer
                variant="row-start"
                className={cn("w-full max-w-xl")}
              >
                <NextButton
                  isIcon
                  colorScheme="flat"
                  className="h-10 w-10 bg-zinc-900 text-white hover:bg-zinc-700"
                >
                  2
                </NextButton>
                <FlexContainer variant="column-start" gap="sm">
                  <Heading variant="h5" className="items-center">
                    Select color profile
                  </Heading>
                  <span className="text-sm font-medium">
                    (For e.g. Black & White, Colored) in 70 GSM
                  </span>
                  <FlexContainer className="w-full *:flex-1">
                    <NextButton
                      onClick={() => {
                        setFieldValue("color", "black&white");
                      }}
                      className={cn(
                        values.color === "black&white" &&
                          "bg-zinc-900 text-white hover:bg-zinc-800",
                      )}
                    >
                      Black & White
                    </NextButton>
                    <NextButton
                      onClick={() => {
                        setFieldValue("color", "color");
                      }}
                      className={cn(
                        values.color === "color" &&
                          "bg-gradient-to-l from-violet-500 to-indigo-500 text-white",
                      )}
                    >
                      Colored
                    </NextButton>
                  </FlexContainer>
                  {errors.color && (
                    <span className="text-sm text-danger">{errors.color}</span>
                  )}
                  <span className="text-sm font-medium">
                    ( ₹2 per page for b/w & ₹4 per page for color)
                  </span>
                </FlexContainer>
              </FlexContainer>
              <FlexContainer variant="row-start" className="w-full max-w-2xl">
                <NextButton
                  isIcon
                  colorScheme="flat"
                  className="h-10 w-10 bg-zinc-900 text-white hover:bg-zinc-700"
                >
                  3
                </NextButton>
                <FlexContainer variant="column-start" gap="sm">
                  <Heading variant="h5" className="items-center">
                    Spiral Binding
                  </Heading>
                  <span className="text-sm font-medium">
                    (₹50 per book for spiral binding)
                  </span>
                  <Checkbox isSelected={values.spiralBinding}>
                    include spiral binding
                  </Checkbox>
                </FlexContainer>
              </FlexContainer>
              <FlexContainer variant="row-start" wrap="nowrap">
                <NextButton
                  isIcon
                  colorScheme="flat"
                  className="h-10 w-10 bg-zinc-900 text-white hover:bg-zinc-700"
                >
                  4
                </NextButton>
                <FlexContainer variant="column-start" gap="sm">
                  <Heading variant="h5" className="items-center">
                    Enter your details
                  </Heading>
                  <span className="text-sm font-medium">
                    {/* (₹50 per book for spiral binding) */}
                  </span>
                  <GridContainer className="w-full lg:grid-cols-2">
                    <Input
                      type="text"
                      name="firstName"
                      label="First Name"
                      labelPlacement="outside"
                      placeholder="Enter your first name"
                      classNames={{
                        inputWrapper: "border",
                        label: "font-semibold",
                      }}
                      value={values.firstName}
                      onChange={handleChange}
                      isInvalid={!!errors.firstName && touched.firstName}
                      color={errors.firstName ? "danger" : "default"}
                      errorMessage={errors.firstName}
                    />
                    <Input
                      type="text"
                      name="lastName"
                      label="Last Name"
                      labelPlacement="outside"
                      placeholder="Enter your last name"
                      classNames={{
                        inputWrapper: "border",
                        label: "font-semibold",
                      }}
                      value={values.lastName}
                      onChange={handleChange}
                      isInvalid={!!errors.lastName && touched.lastName}
                      color={errors.lastName ? "danger" : "default"}
                      errorMessage={errors.lastName}
                    />
                  </GridContainer>
                  <Input
                    type="email"
                    name="email"
                    label="Email"
                    labelPlacement="outside"
                    placeholder="Enter your email"
                    classNames={{
                      inputWrapper: "border",
                      label: "font-semibold",
                    }}
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email && touched.email}
                    color={errors.email ? "danger" : "default"}
                    errorMessage={errors.email}
                  />
                  <Input
                    type="number"
                    name="phoneNumber"
                    label="Phone Number"
                    labelPlacement="outside"
                    placeholder="Enter your phone number"
                    classNames={{
                      inputWrapper: "border",
                      label: "font-semibold",
                    }}
                    value={values.phoneNumber}
                    onChange={handleChange}
                    isInvalid={!!errors.phoneNumber && touched.phoneNumber}
                    color={errors.phoneNumber ? "danger" : "default"}
                    errorMessage={errors.phoneNumber}
                  />
                  <Input
                    type="number"
                    name="altPhoneNumber"
                    label="Alternative Phone Number"
                    labelPlacement="outside"
                    placeholder="Enter your alternative phone number (optional)"
                    classNames={{
                      inputWrapper: "border",
                      label: "font-semibold",
                    }}
                    value={values.altPhoneNumber}
                    onChange={handleChange}
                  />
                  <Input
                    type="text"
                    name="shippingAddress"
                    label="Shipping Address"
                    labelPlacement="outside"
                    placeholder="Enter your shipping address"
                    classNames={{
                      inputWrapper: "border",
                      label: "font-semibold",
                    }}
                    value={values.shippingAddress}
                    onChange={handleChange}
                    isInvalid={
                      !!errors.shippingAddress && touched.shippingAddress
                    }
                    color={errors.shippingAddress ? "danger" : "default"}
                    errorMessage={errors.shippingAddress}
                  />
                  <GridContainer className="lg:grid-cols-2">
                    <Input
                      type="text"
                      name="country"
                      label="Country"
                      labelPlacement="outside"
                      placeholder="Enter your country"
                      classNames={{
                        inputWrapper: "border",
                        label: "font-semibold",
                      }}
                      value={values.country}
                      onChange={handleChange}
                      isInvalid={!!errors.country}
                      color={errors.country ? "danger" : "default"}
                      errorMessage={errors.country}
                    />
                    <Input
                      type="number"
                      name="pincode"
                      label="Pincode"
                      labelPlacement="outside"
                      placeholder="Enter your pin code"
                      classNames={{
                        inputWrapper: "border",
                        label: "font-semibold",
                      }}
                      //   endContent={
                      //     <NextButton
                      //       onClick={() => {
                      //         handleFetchLocation(
                      //           values.pincode,
                      //           setFieldValue,
                      //           setFieldError,
                      //         );
                      //       }}
                      //       className="-mr-2 h-auto w-auto min-w-0 rounded-md border bg-zinc-800 px-4 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 active:scale-95 active:bg-zinc-900"
                      //     >
                      //       Fetch
                      //     </NextButton>
                      //   }
                      value={values.pincode}
                      onChange={handleChange}
                      isInvalid={!!errors.pincode && touched.pincode}
                      color={errors.pincode ? "danger" : "default"}
                      errorMessage={errors.pincode}
                    />
                    <Input
                      type="text"
                      name="state"
                      label="State"
                      labelPlacement="outside"
                      placeholder="Enter your state"
                      classNames={{
                        inputWrapper: "border",
                        label: "font-semibold",
                      }}
                      value={values.state}
                      onChange={handleChange}
                      isInvalid={!!errors.state}
                      color={errors.state ? "danger" : "default"}
                      errorMessage={errors.state}
                    />
                    <Input
                      type="text"
                      name="district"
                      label="District"
                      labelPlacement="outside"
                      placeholder="Enter your district"
                      classNames={{
                        inputWrapper: "border",
                        label: "font-semibold",
                      }}
                      value={values.district}
                      onChange={handleChange}
                      isInvalid={!!errors.district}
                      color={errors.district ? "danger" : "default"}
                      errorMessage={errors.district}
                    />
                  </GridContainer>
                </FlexContainer>
              </FlexContainer>
              <div className="w-full p-5">
                <NextButton
                  type="submit"
                  colorScheme="primary"
                  className="w-full bg-zinc-900 py-6 text-white hover:bg-zinc-700"
                >
                  Place order & Pay
                </NextButton>
                <p className="mt-3 text-xs font-medium">
                  (Delivered within 5-7 working days, shipping charges may
                  apply)
                </p>
              </div>
            </FlexContainer>
            <FlexContainer
              variant="column-start"
              className="w-full max-w-lg p-5"
            >
              <Heading variant="h4">Order Summary</Heading>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Description</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y-1 *:font-medium">
                  <tr>
                    <td>Pages</td>
                    <td className="text-right">{Number(values.pages)}</td>
                  </tr>
                  <tr>
                    <td>
                      {values.color === "black&white"
                        ? "Black & White"
                        : "Colored"}{" "}
                      Print
                    </td>
                    <td className="text-right">
                      ₹
                      {values.color === "black&white"
                        ? Number(values.pages) * 2
                        : Number(values.pages) * 4}
                    </td>
                  </tr>
                  <tr>
                    <td>Spiral Binding</td>
                    <td className="text-right">
                      {values.spiralBinding ? "₹50" : "₹0"}
                    </td>
                  </tr>
                  <tr>
                    <td>Shipping Charges</td>
                    <td className="text-right">₹200</td>
                  </tr>
                  <tr>
                    <td>Total</td>
                    <td className="text-right">
                      ₹
                      {Number(values.pages) *
                        Number(values.color === "black&white" ? 2 : 4) +
                        (values.spiralBinding ? 50 : 0) +
                        200}
                    </td>
                  </tr>
                </tbody>
              </table>
            </FlexContainer>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Index;
