import { createContext, useContext, ReactNode, useState } from "react";

import { useCopilotReadable } from "@copilotkit/react-core";

export type Stage =
  | "buildTshirt"
  | "getContactInfo"
  | "getPaymentInfo"
  | "confirmOrder";

export type Tshirt = {
  id: number;
  name: string;
  price: number;
};

export type CardInfo = {
  number: string;
  exp_month: number;
  exp_year: number;
  cvc: string;
};

export type ContactInfo = {
  name: string;
  email: string;
  phone: string;
};

export type Order = {
  tshirt: Tshirt;
  creditCard: CardInfo;
  contactInfo: ContactInfo;
};

interface GlobalState {
  stage: Stage;
  setStage: React.Dispatch<React.SetStateAction<Stage>>;
  selectedTshirt: Tshirt | null;
  setSelectedTshirt: React.Dispatch<React.SetStateAction<Tshirt | null>>;
  contactInfo: ContactInfo | null;
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfo | null>>;
  cardInfo: CardInfo | null;
  setCardInfo: React.Dispatch<React.SetStateAction<CardInfo | null>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

export const GlobalStateContext = createContext<GlobalState | null>(null);

/**
  useGlobalState is a hook that will return the global state of the application. It must
  be used within a GlobalStateProvider. It keeps track of the:
  - Current stage of the application.
  - Selected car.
  - Contact information of the user.
  - Card information of the user.
  - Orders of the user.
  - Financing information of the user.
*/
export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
}

export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<Stage>("getContactInfo");
  const [selectedTshirt, setSelectedTshirt] = useState<Tshirt | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [cardInfo, setCardInfo] = useState<CardInfo | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useCopilotReadable({
    description: "Currently Specified Information",
    value: {
      contactInfo,
      selectedTshirt,
      cardInfo,
      orders,
      currentStage: stage,
    },
  });

  return (
    <GlobalStateContext.Provider
      value={{
        stage,
        setStage,
        selectedTshirt,
        setSelectedTshirt,
        contactInfo,
        setContactInfo,
        cardInfo,
        setCardInfo,
        orders,
        setOrders,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
}
