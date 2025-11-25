export type SiteConfig = {
  restaurantName: string;
  cnpj: string;
  phone: string;
  whatsapp: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  instagram: string;
  facebook: string;
  logoUrl: string;
  formularioCupom: boolean;
};

export type SiteConfigWithComputed = SiteConfig & {
  formattedAddress: string;
  whatsappLink: string;
};
