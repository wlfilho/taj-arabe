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
};

export type SiteConfigWithComputed = SiteConfig & {
  formattedAddress: string;
  whatsappLink: string;
};
