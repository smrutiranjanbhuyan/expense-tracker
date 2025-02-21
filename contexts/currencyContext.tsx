import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
  currencySymbol: string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const getCurrencySymbol = (currency: string): string => {
  const symbols: { [key: string]: string } = {
    AED: "د.إ",
    AFN: "؋",
    ALL: "L",
    AMD: "֏",
    ANG: "ƒ",
    AOA: "Kz",
    ARS: "$",
    AUD: "$",
    AWG: "ƒ",
    AZN: "₼",
    BAM: "KM",
    BBD: "$",
    BDT: "৳",
    BGN: "лв",
    BHD: ".د.ب",
    BIF: "FBu",
    BMD: "$",
    BND: "$",
    BOB: "Bs.",
    BRL: "R$",
    BSD: "$",
    BTN: "Nu.",
    BWP: "P",
    BYN: "Br",
    BZD: "$",
    CAD: "$",
    CDF: "FC",
    CHF: "CHF",
    CLP: "$",
    CNY: "¥",
    COP: "$",
    CRC: "₡",
    CUC: "$",
    CUP: "$",
    CVE: "$",
    CZK: "Kč",
    DJF: "Fdj",
    DKK: "kr",
    DOP: "RD$",
    DZD: "دج",
    EGP: "£",
    ERN: "Nfk",
    ETB: "Br",
    EUR: "€",
    FJD: "$",
    FKP: "£",
    FOK: "kr",
    GBP: "£",
    GEL: "₾",
    GGP: "£",
    GHS: "GH₵",
    GIP: "£",
    GMD: "D",
    GNF: "FG",
    GTQ: "Q",
    GYD: "$",
    HKD: "$",
    HNL: "L",
    HRK: "kn",
    HTG: "G",
    HUF: "Ft",
    IDR: "Rp",
    ILS: "₪",
    IMP: "£",
    INR: "₹",
    IQD: "ع.د",
    IRR: "﷼",
    ISK: "kr",
    JMD: "$",
    JOD: "د.ا",
    JPY: "¥",
    KES: "KSh",
    KGS: "лв",
    KHR: "៛",
    KID: "$",
    KMF: "CF",
    KRW: "₩",
    KWD: "د.ك",
    KYD: "$",
    KZT: "₸",
    LAK: "₭",
    LBP: "ل.ل",
    LKR: "Rs",
    LRD: "$",
    LSL: "L",
    LYD: "ل.د",
    MAD: "د.م.",
    MDL: "L",
    MGA: "Ar",
    MKD: "ден",
    MMK: "K",
    MNT: "₮",
    MOP: "MOP$",
    MRU: "UM",
    MUR: "Rs",
    MVR: "Rf",
    MWK: "MK",
    MXN: "$",
    MYR: "RM",
    MZN: "MT",
    NAD: "$",
    NGN: "₦",
    NIO: "C$",
    NOK: "kr",
    NPR: "Rs",
    NZD: "$",
    OMR: "﷼",
    PAB: "B/.",
    PEN: "S/",
    PGK: "K",
    PHP: "₱",
    PKR: "Rs",
    PLN: "zł",
    PYG: "₲",
    QAR: "﷼",
    RON: "lei",
    RSD: "дин",
    RUB: "₽",
    RWF: "FRw",
    SAR: "﷼",
    SBD: "$",
    SCR: "Rs",
    SDG: "ج.س.",
    SEK: "kr",
    SGD: "$",
    SHP: "£",
    SLL: "Le",
    SOS: "Sh",
    SRD: "$",
    SSP: "£",
    STN: "Db",
    SYP: "£",
    SZL: "L",
    THB: "฿",
    TJS: "SM",
    TMT: "T",
    TND: "د.ت",
    TOP: "T$",
    TRY: "₺",
    TTD: "TT$",
    TVD: "$",
    TWD: "NT$",
    TZS: "Sh",
    UAH: "₴",
    UGX: "USh",
    USD: "$",
    UYU: "$U",
    UZS: "лв",
    VES: "Bs.S",
    VND: "₫",
    VUV: "VT",
    WST: "WS$",
    XAF: "FCFA",
    XCD: "$",
    XOF: "CFA",
    XPF: "₣",
    YER: "﷼",
    ZAR: "R",
    ZMW: "ZK",
    ZWL: "$",
  };

  return symbols[currency] || currency;
};

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<string>("USD");
  const currencySymbol = getCurrencySymbol(currency);


  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const storedCurrency = await AsyncStorage.getItem("currency");
        if (storedCurrency) {
          setCurrencyState(storedCurrency);
        }
      } catch (error) {
        console.error("Error loading currency from AsyncStorage", error);
      }
    };
    loadCurrency();
  }, []);


  useEffect(() => {
    const storeCurrency = async () => {
      try {
        await AsyncStorage.setItem("currency", currency);
      } catch (error) {
        console.error("Error saving currency to AsyncStorage", error);
      }
    };
    storeCurrency();
  }, [currency]);

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
