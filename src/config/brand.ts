export const BRAND = {
  name: 'Stratum',
  tagline: 'Every part number. Every price. One memory.',
  subtagline: 'Spare parts commercial intelligence for mining equipment traders.',
  shortDescription: 'One searchable memory for every OEM reference, supplier price and customer quote. Built for traders who work across countries, currencies and catalogues.',
  contactEmail: 'contact@stratum-mining.demo',
  version: '1.0.0-prototype',
  footerDisclaimer: 'Interactive prototype · sample data only. Built for review.',
  demoDate: '2026-10-10', // Fixed demo today as per PRD Section 22
};

export interface EntityConfig {
  id: string;
  name: string;
  shortName: string;
  country: string;
  countryCode: 'PE' | 'ZM' | 'INT';
  city: string;
  baseCurrency: 'USD' | 'PEN' | 'ZMW';
  tradeCurrency: 'USD';
  prefix: 'PE' | 'ZM' | 'INT';
  taxId: string;
  address: string;
  bankBlock: string;
  userCount: number;
}

export const ENTITIES: Record<string, EntityConfig> = {
  'consolidated': {
    id: 'consolidated',
    name: 'Consolidated View (All Entities)',
    shortName: 'Consolidated',
    country: 'Global',
    countryCode: 'INT',
    city: 'All Territories',
    baseCurrency: 'USD',
    tradeCurrency: 'USD',
    prefix: 'INT',
    taxId: 'CONSOL-000',
    address: 'Consolidated Global Group',
    bankBlock: 'Multiple Accounts',
    userCount: 5,
  },
  'peru': {
    id: 'peru',
    name: 'Stratum Perú S.A.C.',
    shortName: 'Stratum Perú',
    country: 'Peru',
    countryCode: 'PE',
    city: 'Lima',
    baseCurrency: 'PEN',
    tradeCurrency: 'USD',
    prefix: 'PE',
    taxId: 'RUC 20608912341',
    address: 'Av. El Derby 254, Of. 804, Santiago de Surco, Lima, Perú',
    bankBlock: 'BCP USD: 194-28819034-1-29 / PEN: 194-28819034-0-28',
    userCount: 2,
  },
  'zambia': {
    id: 'zambia',
    name: 'Stratum Zambia Ltd',
    shortName: 'Stratum Zambia',
    country: 'Zambia',
    countryCode: 'ZM',
    city: 'Kitwe',
    baseCurrency: 'ZMW',
    tradeCurrency: 'USD',
    prefix: 'ZM',
    taxId: 'TPIN 1004928172',
    address: 'Plot 4410, Independence Ave, Heavy Industrial Area, Kitwe, Copperbelt',
    bankBlock: 'Stanbic Bank Kitwe · USD: 0140092818201 · ZMW: 0140092818200',
    userCount: 2,
  },
  'international': {
    id: 'international',
    name: 'Stratum International FZE',
    shortName: 'Stratum Intl',
    country: 'UAE / International',
    countryCode: 'INT',
    city: 'Dubai',
    baseCurrency: 'USD',
    tradeCurrency: 'USD',
    prefix: 'INT',
    taxId: 'TRN 100293817200003',
    address: 'Building A2, Dubai South Logistics City, Dubai, UAE',
    bankBlock: 'Emirates NBD · USD IBAN: AE2902600010192837465',
    userCount: 1,
  },
};
