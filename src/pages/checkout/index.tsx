import AutoComplete, { Option } from "@/components/AutoComplete";
import FlexContainer from "@/components/FlexContainer";
import GridContainer from "@/components/GridContainer";
import Heading from "@/components/Heading";
import NextButton from "@/components/NextButton";
import NextInput from "@/components/NextInput";
import Wrapper from "@/components/Wrapper";
import useGet from "@/lib/hooks/get-api";
import { convertToHttpsLink, excerpt } from "@/lib/utils";
import { clearCart, removeItem, setOrderType } from "@/redux/slices/cart";
import { AppDispatch, RootState } from "@/redux/store";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Select,
  SelectItem,
  SelectSection,
  Selection,
} from "@nextui-org/react";
import { City, ICity, IState, State } from "country-state-city";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { Key, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useRazorpay, { RazorpayOptions } from "react-razorpay";
import { useDispatch, useSelector } from "react-redux";
// import useRazorpay from "src/hooks/useRazorpay";

interface RazorpayOptionsCustom extends Omit<RazorpayOptions, "amount"> {}

const StatesData = State.getStatesOfCountry("IN");

const Index = () => {
  const {
    order_type,
    softcopy_items,
    hardcopy_items,
    total_amount_hardcopy,
    total_items_hardcopy,
    total_amount_softcopy,
    total_items_softcopy,
  } = useSelector((state: RootState) => state.cart);
  const { isLoaded, isSignedIn, user } = useUser();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [CitiesData, setCitiesData] = useState<ICity[]>([]);
  // const [selectedState, setSelectedState] = useState<Option | null>(null);
  const [state, setState] = useState<React.Key>("");
  const [city, setCity] = useState<React.Key>("");
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponType, setCouponType] = useState<"flat" | "percentage" | null>();
  // const [selectedCity, setSelectedCity] = useState<Option | null>(null);
  // Add state variables
  const [discountType, setDiscountType] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [totalSoftcopyAmount, setTotalSoftcopyAmount] = useState<number>(0);
  const [totalHardcopyAmount, setTotalHardcopyAmount] = useState<number>(0);
  const [totalDiscountAmount, setTotalDiscountAmount] = useState<number>(0);

  const [paymentMethod, setPaymentMethod] = useState<Selection>(
    new Set(["online"]),
  );

  const { invalidateCache } = useGet();
  const [Razorpay, isRazorpayLoaded] = useRazorpay();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // form datas for the checkout page with the user's details types
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  }>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  // console.log(selectedState);
  // console.log(state, "state");
  // console.log(city, "city");

  const handlePlaceOrder = useCallback(async () => {
    const s = StatesData.find((s) => s.isoCode === state);
    console.log(s?.name, "state");
    console.log(city, "city");
    // return;
    if (!formData.name) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.email) {
      toast.error("Please enter your email");
      return;
    }
    if (!formData.phone) {
      toast.error("Please enter your phone number");
      return;
    }
    if (Array.from(paymentMethod).length === 0) {
      toast.error("Please select a payment method");
      return;
    }
    // const state = StatesData.find(
    //   (state) => state.isoCode === selectedState?.value,
    // );
    if (order_type === "softcopy") {
      const orderData = {
        ...formData,
        // city: city,
        // state: s?.name || (state as string),
        paymentMethod: Array.from(paymentMethod).toString(),
        items: softcopy_items,
        total_amount: total_amount_softcopy - totalDiscountAmount,
        isDiscounted: totalDiscountAmount > 0,
        discount_amount: totalDiscountAmount,
        total_items: total_items_softcopy,
        user_id: user?.id,
      };
      try {
        setIsOrderPlaced(true);
        const response = await fetch("/api/order/softcopy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });
        const data = (await response.json()) as {
          order_id: string;
          success: boolean;
        };
        console.log(orderData);
        const options: RazorpayOptionsCustom = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
          currency: "INR",
          name: "NeetBucket",
          description: "Softcopy Order",
          order_id: data.order_id,
          handler: function (response: any) {
            // alert(response.razorpay_payment_id);
            invalidateCache("orders");
            dispatch(clearCart());
            toast.success("Payment successful");
            router.push("/user/orders");
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          notes: {
            name: formData.name,
            address: formData.address,
            city: city,
            state: s?.name || (state as string),
            order_id: data.order_id,
            order_type: "softcopy",
          },
          theme: {
            color: "#F37254",
          },
        };
        const rzpay = new Razorpay(options as RazorpayOptions);
        rzpay.open();
      } catch (error) {
        const err = error as Error & { message: string };
        toast.error(err.message || "An error occurred while placing the order");
      } finally {
        setIsOrderPlaced(false);
      }
    }
    if (order_type === "hardcopy") {
      if (!formData.address) {
        toast.error("Please enter your address");
        return;
      }
      if (!city) {
        toast.error("Please enter your city");
        return;
      }
      if (!state) {
        toast.error("Please enter your state");
        return;
      }
      const mappedItems = hardcopy_items.map((item) => {
        return {
          id: item.sys.id,
          title: item.fields.heading,
          thumbnail: {
            url: convertToHttpsLink(
              item.fields.chapterThumbnail.fields.file.url,
            ),
            fileName: item.fields.heading,
          },
          quantity: 1,
          price: item.fields.price,
        };
      });
      const orderData = {
        ...formData,
        city: city,
        state: s?.name || (state as string),
        paymentMethod: Array.from(paymentMethod).toString(),
        items: mappedItems,
        total_amount: total_amount_hardcopy - totalDiscountAmount,
        total_items: total_items_hardcopy,
        user_id: user?.id,
        isDiscounted: totalDiscountAmount > 0,
        discount_amount: totalDiscountAmount,
      };
      console.log(orderData, "hardcopy");
      try {
        setIsOrderPlaced(true);
        const response = await fetch("/api/order/hardcopy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });
        const data = (await response.json()) as {
          order_id: string;
          success: boolean;
        };
        console.log(data);
        const options: RazorpayOptionsCustom = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
          currency: "INR",
          name: "NeetBucket",
          description: "Hardcopy Order",
          order_id: data.order_id,
          handler: function (response: any) {
            // alert(response.razorpay_payment_id);
            invalidateCache("orders");
            dispatch(clearCart());
            toast.success("Payment successful");
            router.push("/user/orders");
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          notes: {
            name: formData.name,
            address: formData.address,
            city: city,
            state: s?.name || (state as string),
            delivery_status: "pending",
            order_id: data.order_id,
            order_type: "hardcopy",
          },
          theme: {
            color: "#F37254",
          },
        };
        const rzpay = new Razorpay(options as RazorpayOptions);
        rzpay.open();
      } catch (error) {
        const err = error as Error & { message: string };
        toast.error(err.message || "An error occurred while placing the order");
      } finally {
        setIsOrderPlaced(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    Razorpay,
    formData,
    state,
    city,
    paymentMethod,
    softcopy_items,
    total_amount_softcopy,
    total_items_softcopy,
    couponDiscount,
    couponCode,
    totalHardcopyAmount,
    totalSoftcopyAmount,
    totalDiscountAmount,
  ]);

  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode) {
      toast.error("Please enter a coupon code");
      return;
    }
    try {
      const response = await fetch("/api/coupons/apply/" + couponCode, {
        method: "GET",
      });
      const data = (await response.json()) as {
        success: boolean;
        message: string;
        data: {
          code: string;
          name: string;
          type: string;
          expiry: string;
          discount: number;
          usedBy: string[];
          usedCount: number;
          createdAt: string;
        };
      };
      if (data.success) {
        toast.success(data.message);
        setCouponDiscount(data?.data?.discount);
        setCouponType(data?.data?.type === "flat" ? "flat" : "percentage");
      } else {
        setCouponCode("");
        setDiscountAmount(0);
        setTotalSoftcopyAmount(0);
        setTotalHardcopyAmount(0);
        setTotalDiscountAmount(0);
        setCouponDiscount(0);
        setCouponType(null);
        toast.error(data.message);
      }
    } catch (error) {
      const err = error as Error & { message: string };
      toast.error(err.message || "An error occurred while applying the coupon");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    couponCode,
    total_amount_softcopy,
    total_amount_hardcopy,
    couponDiscount,
  ]);

  // Update state variables based on order type and coupon type
  useEffect(() => {
    if (order_type === "softcopy") {
      if (couponType === "percentage") {
        setDiscountType("percentage");
        setDiscountAmount(
          (softcopy_items?.[0].fields.price * couponDiscount) / 100,
        );
      } else if (couponType === "flat") {
        setDiscountType("flat");
        setDiscountAmount(couponDiscount);
      }
      const totalDiscount = discountAmount * softcopy_items.length;
      setTotalDiscountAmount(totalDiscount);
      setTotalSoftcopyAmount(
        total_amount_softcopy - discountAmount * softcopy_items.length,
      );
    } else if (order_type === "hardcopy") {
      if (couponType === "percentage") {
        setDiscountType("percentage");
        setDiscountAmount(
          (hardcopy_items?.[0]?.fields.price * couponDiscount) / 100,
        );
      } else if (couponType === "flat") {
        setDiscountType("flat");
        setDiscountAmount(couponDiscount);
      }
      const totalDiscount = discountAmount * hardcopy_items.length;
      setTotalDiscountAmount(totalDiscount);
      setTotalHardcopyAmount(total_amount_hardcopy - discountAmount);
    }
  }, [
    order_type,
    couponType,
    couponDiscount,
    total_amount_softcopy,
    total_amount_hardcopy,
    softcopy_items.length,
    discountAmount,
    hardcopy_items,
    softcopy_items,
  ]);

  useEffect(() => {
    const cities = City.getCitiesOfState("IN", state as string);
    setCitiesData(cities);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const userObject = {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        phone: user.publicMetadata?.phone,
        address: user.publicMetadata?.address,
        city: user.publicMetadata?.city,
        state: user.publicMetadata?.state,
      } as typeof formData;
      setFormData(userObject);
    }
  }, [isSignedIn, isLoaded, user]);

  if (isLoaded && !isSignedIn) {
    return (
      <Wrapper>
        <FlexContainer variant="column-center" gap="xl">
          <Heading variant="h2">Please sign in to continue</Heading>
          <NextButton
            colorScheme="primary"
            // onClick={() => {
            //   user.signIn("sign_in");
            // }}
          >
            Sign In
          </NextButton>
        </FlexContainer>
      </Wrapper>
    );
  }

  if (!isLoaded) {
    return (
      <Wrapper>
        <FlexContainer variant="column-center" gap="xl">
          <Heading variant="h5">Loading...</Heading>
        </FlexContainer>
      </Wrapper>
    );
  }

  // if (!isRazorpayLoaded) {
  //   return (
  //     <div className="fixed inset-0 flex h-full w-full items-center justify-center">
  //       <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
  //     </div>
  //   );
  // }
  return (
    <Wrapper>
      <FlexContainer variant="column-start" gap="xl">
        <Heading variant="h2">Checkout</Heading>

        <GridContainer className="gap-16">
          <FlexContainer
            variant="column-start"
            gap="xl"
            className="lg:col-span-2"
          >
            <FlexContainer variant="row-between" wrap="nowrap">
              <Heading variant="h5">Shipping Address</Heading>
              <Select
                title="Order Type"
                label="Order Type"
                labelPlacement="outside"
                placeholder="Select your order type"
                className="w-48"
                classNames={{
                  label: "font-medium",
                }}
                selectedKeys={[order_type]}
                onChange={(e) => {
                  dispatch(
                    setOrderType(e.target.value as "softcopy" | "hardcopy"),
                  );
                }}
              >
                <SelectSection>
                  <SelectItem key={"softcopy"}>Softcopy</SelectItem>
                  <SelectItem key={"hardcopy"}>Hardcopy</SelectItem>
                </SelectSection>
              </Select>
            </FlexContainer>
            <GridContainer gap="md">
              <Input
                label="Name"
                labelPlacement="outside"
                placeholder="Enter your name"
                value={formData.name}
                onValueChange={(value) =>
                  setFormData({ ...formData, name: value })
                }
              />
              <Input
                type="email"
                label="Email"
                labelPlacement="outside"
                placeholder="Enter your email"
                value={formData.email}
                onValueChange={(value) =>
                  setFormData({ ...formData, email: value })
                }
              />
              <Input
                type="tel"
                label="Phone"
                labelPlacement="outside"
                placeholder="Enter your phone number"
                value={formData.phone}
                onValueChange={(value) =>
                  setFormData({ ...formData, phone: value })
                }
              />
              {order_type === "hardcopy" && (
                <>
                  <Input
                    label="Address"
                    labelPlacement="outside"
                    placeholder="Enter your address"
                    value={formData.address}
                    onValueChange={(value) =>
                      setFormData({ ...formData, address: value })
                    }
                  />
                  <Autocomplete
                    label="State"
                    labelPlacement="outside"
                    variant="flat"
                    defaultItems={StatesData.map((state) => ({
                      label: state.name,
                      value: state.isoCode,
                    }))}
                    placeholder="Search your state"
                    selectedKey={state as string}
                    onSelectionChange={setState}
                  >
                    {(item) => (
                      <AutocompleteItem key={item.value}>
                        {item.label}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                  <Autocomplete
                    label="City"
                    labelPlacement="outside"
                    variant="flat"
                    defaultItems={CitiesData.map((city) => ({
                      label: city.name,
                      value: city.name,
                    }))}
                    placeholder="Search your city"
                    selectedKey={city as string}
                    onSelectionChange={setCity}
                  >
                    {(item) => (
                      <AutocompleteItem key={item.value}>
                        {item.label}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </>
              )}
              {/* <AutoComplete
                label="State"
                placeholder="Enter your state"
                showClearButton={true}
                options={StatesData.map((state) => ({
                  name: state.name,
                  value: state.isoCode,
                }))}
                selectedOption={selectedState}
                setSelectedOption={setSelectedState}
                onSelectionChange={(option) => {
                  const cities = City.getCitiesOfState(
                    "IN",
                    option?.value as string,
                  );
                  setSelectedState(option);
                  setCitiesData(cities);
                }}
              /> */}
              {/* <AutoComplete
                label="City"
                placeholder="Enter your city"
                showClearButton={true}
                options={CitiesData.map((state) => ({
                  name: state.name,
                  value: state.name,
                }))}
                selectedOption={selectedCity}
                setSelectedOption={setSelectedCity}
                onSelectionChange={(option) => {
                  if (selectedState?.name === null) {
                    toast.error("Please select a state first");
                    return;
                  }
                }}
              /> */}
            </GridContainer>

            <Heading variant="h5">
              Cart Summary (
              {order_type === "softcopy"
                ? total_items_softcopy
                : total_items_hardcopy}{" "}
              ) items
            </Heading>

            <GridContainer gap="md" className="custom_scrollbar lg:grid-cols-2">
              {order_type === "softcopy" &&
                softcopy_items?.map((item) => {
                  const thumbnailUrl = convertToHttpsLink(
                    item.fields.chapterThumbnail.fields.file.url,
                  );
                  return (
                    <FlexContainer
                      key={item.sys.id}
                      gap="md"
                      className="relative items-center rounded-xl bg-zinc-100 p-2"
                    >
                      <Image
                        width={500}
                        height={500}
                        src={thumbnailUrl}
                        alt={item?.fields?.chapterName}
                        className="h-16 w-16 rounded-md border border-gray-200"
                      />
                      <FlexContainer variant="column-start" gap="xs">
                        <h1 className="max-w-[185px] font-sora text-xs font-medium">
                          {excerpt(item?.fields?.chapterName, 40)}
                        </h1>
                        <p className="text-xs text-gray-500">
                          {item?.fields?.subject?.fields?.subjectName}
                        </p>
                        <h1 className="font-sora text-sm font-semibold">
                          <span className="mr-2 text-xs font-normal text-gray-500">
                            x 1
                          </span>{" "}
                          ₹{item?.fields?.price}
                        </h1>
                      </FlexContainer>
                      <NextButton
                        colorScheme="error"
                        isIcon
                        className="absolute -right-2.5 -top-2.5"
                        onClick={() => {
                          dispatch(removeItem(item.sys.id));
                        }}
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </NextButton>
                    </FlexContainer>
                  );
                })}
              {order_type === "hardcopy" &&
                hardcopy_items.map((item) => {
                  const thumbnailUrl = convertToHttpsLink(
                    item.fields.chapterThumbnail.fields.file.url,
                  );
                  return (
                    <FlexContainer
                      key={item.sys.id}
                      gap="md"
                      className="items-center rounded-xl bg-zinc-100 p-2"
                    >
                      <Image
                        width={500}
                        height={500}
                        src={thumbnailUrl}
                        alt={item?.fields?.heading}
                        className="h-16 w-16 rounded-md border border-gray-200"
                      />
                      <FlexContainer variant="column-start" gap="xs">
                        <h1 className="max-w-[185px] font-sora text-xs font-medium">
                          {excerpt(item?.fields?.heading, 40)}
                        </h1>

                        <h1 className="font-sora text-sm font-semibold">
                          <span className="mr-2 text-xs font-normal text-gray-500">
                            x 1
                          </span>{" "}
                          ₹{item?.fields?.price}
                        </h1>
                      </FlexContainer>
                    </FlexContainer>
                  );
                })}
            </GridContainer>
          </FlexContainer>
          <FlexContainer variant="column-start" gap="xl">
            <Heading variant="h5">Payment</Heading>
            <GridContainer gap="lg" className="lg:grid-cols-2">
              {order_type === "hardcopy" && (
                <Select
                  label="Payment Method"
                  labelPlacement="outside"
                  placeholder="Select your payment method"
                  selectedKeys={paymentMethod}
                  onSelectionChange={setPaymentMethod}
                >
                  <SelectItem key="cod">Cash on Delivery</SelectItem>
                  <SelectItem key="online">Online Payment</SelectItem>
                </Select>
              )}
              <Input
                type="text"
                label="Coupon Code"
                labelPlacement="outside"
                placeholder="Enter your coupon code"
                value={couponCode}
                onValueChange={(value) => setCouponCode(value)}
                className="col-span-2"
                endContent={
                  <NextButton
                    colorScheme="primary"
                    className="text-sm"
                    onClick={handleApplyCoupon}
                  >
                    Apply
                  </NextButton>
                }
              />
            </GridContainer>
            <FlexContainer variant="column-start" gap="sm">
              <FlexContainer variant="row-between" gap="sm">
                <Heading variant="body1">Subtotal</Heading>
                <Heading variant="subtitle1">
                  ₹
                  {order_type === "softcopy"
                    ? total_amount_softcopy
                    : total_amount_hardcopy}
                </Heading>
              </FlexContainer>
              <FlexContainer variant="row-between" gap="md">
                <Heading variant="body1">Discount</Heading>
                <Heading variant="subtitle1">
                  {/* {order_type === "softcopy" &&
                    couponDiscount * softcopy_items.length} */}
                  {totalDiscountAmount.toFixed(2)}
                </Heading>
              </FlexContainer>
              <FlexContainer variant="row-between" gap="md">
                <Heading variant="body1">Total Amount</Heading>
                <Heading variant="subtitle1">
                  ₹
                  {order_type === "softcopy"
                    ? totalSoftcopyAmount.toFixed(2)
                    : totalHardcopyAmount.toFixed(2)}
                </Heading>
              </FlexContainer>
            </FlexContainer>
            <NextButton
              onClick={handlePlaceOrder}
              colorScheme="primary"
              className="text-md py-6"
            >
              {isOrderPlaced ? "Placing Order..." : "Place Order"}
            </NextButton>
          </FlexContainer>
        </GridContainer>
      </FlexContainer>
    </Wrapper>
  );
};

export default Index;
