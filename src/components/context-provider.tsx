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
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoadingUser: boolean;
  setIsLoadingUser: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
}>({
  user: null,
  setUser: () => {},
  isLoadingUser: true,
  setIsLoadingUser: () => {},
  isOpen: false,
  onOpen: () => {},
  onOpenChange: () => {},
});

const ContextProvider: FC<Props> = (props: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        isLoadingUser,
        setIsLoadingUser,
        isOpen,
        onOpen,
        onOpenChange,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => useContext(GlobalContext);

export { ContextProvider, useGlobalContext };
