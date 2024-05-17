import { useDisclosure } from "@nextui-org/react";
import { ObjectId } from "mongodb";
import { FC, createContext, useContext, useState } from "react";

type Props = {
  children: React.ReactNode;
};

type User = {
  _id: ObjectId;
  name: string;
  email: string;
  avatar: string;
};

const GlobalContext = createContext<{
  cartOpen: boolean;
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  cartOpen: false,
  setCartOpen: () => {},
});

const ContextProvider: FC<Props> = (props: Props) => {
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  return (
    <GlobalContext.Provider
      value={{
        cartOpen,
        setCartOpen,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => useContext(GlobalContext);

export { ContextProvider, useGlobalContext };
