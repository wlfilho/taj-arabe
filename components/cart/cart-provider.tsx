"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type PropsWithChildren,
} from "react";

import { formatCurrency } from "@/lib/utils";
import type { MenuItem } from "@/types/menu";
import type { CartAction, CartLine, CartState } from "@/types/cart";

const STORAGE_KEY = "lilica:cart:v1";
const ENV_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

const initialState: CartState = {
  items: [],
  isOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const quantity = action.payload.quantity ?? 1;
      const existing = state.items.find((line) => line.item.id === action.payload.item.id);
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((line) =>
            line.item.id === action.payload.item.id
              ? { ...line, quantity: Math.min(line.quantity + quantity, 99) }
              : line,
          ),
        };
      }

      const nextLine: CartLine = {
        item: action.payload.item,
        quantity: Math.min(quantity, 99),
      };

      return {
        ...state,
        isOpen: true,
        items: [...state.items, nextLine],
      };
    }
    case "REMOVE": {
      return {
        ...state,
        items: state.items.filter((line) => line.item.id !== action.payload.id),
      };
    }
    case "SET_QUANTITY": {
      const mapped = state.items
        .map((line) => {
          if (line.item.id !== action.payload.id) {
            return line;
          }
          if (action.payload.quantity <= 0) {
            return null;
          }
          return {
            ...line,
            quantity: Math.min(action.payload.quantity, 99),
          };
        })
        .filter(Boolean) as CartLine[];

      return {
        ...state,
        items: mapped,
      };
    }
    case "CLEAR": {
      return {
        ...state,
        items: [],
      };
    }
    case "TOGGLE": {
      const isOpen = action.payload?.open ?? !state.isOpen;
      return {
        ...state,
        isOpen,
      };
    }
    case "HYDRATE": {
      return {
        ...state,
        items: action.payload.items,
      };
    }
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartLine[];
  itemCount: number;
  total: number;
  isOpen: boolean;
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
  buildWhatsAppMessage: () => string;
  buildWhatsAppLink: () => string;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

type CartProviderProps = PropsWithChildren<{ whatsappNumber?: string; restaurantName?: string }>;

export function CartProvider({ children, whatsappNumber: configWhatsapp, restaurantName = "Restaurante" }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);
  const whatsappNumber = useMemo(() => {
    const sanitizedConfig = configWhatsapp?.replace(/[^0-9]/g, "") ?? "";
    const fallback = ENV_WHATSAPP.replace(/[^0-9]/g, "");
    return sanitizedConfig || fallback;
  }, [configWhatsapp]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items: CartLine[] = JSON.parse(stored);
        dispatch({ type: "HYDRATE", payload: { items } });
      }
    } catch (error) {
      console.error("Failed to restore cart state", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error("Failed to persist cart state", error);
    }
  }, [state.items, isHydrated]);

  const itemCount = useMemo(
    () => state.items.reduce((total, line) => total + line.quantity, 0),
    [state.items],
  );

  const total = useMemo(
    () => state.items.reduce((sum, line) => sum + line.item.price * line.quantity, 0),
    [state.items],
  );

  const addItem = useCallback(
    (item: MenuItem, quantity = 1) => {
      if (!item.available) {
        return;
      }
      dispatch({ type: "ADD", payload: { item, quantity } });
    },
    [],
  );

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE", payload: { id } });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "SET_QUANTITY", payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const toggleCart = useCallback((open?: boolean) => {
    dispatch({ type: "TOGGLE", payload: { open } });
  }, []);

  const buildWhatsAppMessage = useCallback(() => {
    const lines = state.items.map((line, index) => {
      const subtotal = line.item.price * line.quantity;
      return `${index + 1}. ${line.item.name} x${line.quantity} — ${formatCurrency(subtotal)}`;
    });

    const message = [
      `*${restaurantName} - Pedido*`,
      ...lines,
      lines.length ? `Total: ${formatCurrency(total)}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    return message || "Olá, gostaria de fazer um pedido!";
  }, [state.items, total, restaurantName]);

  const buildWhatsAppLink = useCallback(() => {
    const message = encodeURIComponent(buildWhatsAppMessage());
    const baseUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me/";
    return `${baseUrl}?text=${message}`;
  }, [buildWhatsAppMessage, whatsappNumber]);

  const value = useMemo(
    () => ({
      items: state.items,
      itemCount,
      total,
      isOpen: state.isOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleCart,
      buildWhatsAppMessage,
      buildWhatsAppLink,
    }),
    [
      state.items,
      state.isOpen,
      itemCount,
      total,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleCart,
      buildWhatsAppMessage,
      buildWhatsAppLink,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }
  return context;
}
