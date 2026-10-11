import { User, Pool, Entry, Draw, Destination, Transaction, NotificationItem, ActivityItem } from '../types';

export const initialUser: User = {
  id: 'usr_amara_01',
  name: 'Amara Okafor',
  email: 'amara.okafor@proton.me',
  avatarInitials: 'AO',
  memberSince: 'March 2026',
  region: 'United Kingdom',
  eligibilityConfirmed: true,
  depositAddress: '0x7A1fC920aD88B57D84bF1482fBEe6d1959C1c3D9',
};

// Target timestamps computed relative to now so countdowns always look alive
const now = Date.now();
const oneHour = 3600 * 1000;
const oneDay = 24 * oneHour;

export const initialPools: Pool[] = [
  {
    id: 'pool_d_1011',
    name: 'Daily Pool · Oct 11',
    cadence: 'daily',
    entryFee: 5,
    pot: 1085,
    currentEntries: 217,
    closesAt: new Date(now + 3 * oneHour + 42 * 60 * 1000 + 10 * 1000).toISOString(),
    status: 'open',
    description: 'Fixed $5 entry. Provably fair draw every 24 hours via Chainlink VRF on Base.'
  },
  {
    id: 'pool_w_41',
    name: 'Weekly Pool · Week 41',
    cadence: 'weekly',
    entryFee: 25,
    pot: 5950,
    currentEntries: 238,
    closesAt: new Date(now + 2 * oneDay + 14 * oneHour).toISOString(),
    status: 'open',
    description: 'Fixed $25 entry. High participation weekly flagship pool.'
  },
  {
    id: 'pool_m_10',
    name: 'Monthly Pool · October',
    cadence: 'monthly',
    entryFee: 100,
    pot: 21400,
    currentEntries: 214,
    closesAt: new Date(now + 19 * oneDay + 8 * oneHour).toISOString(),
    status: 'open',
    description: 'Fixed $100 entry. Large monthly grand pool with 95% net winner allocation.'
  },
  {
    id: 'pool_w_40',
    name: 'Weekly Pool · Week 40',
    cadence: 'weekly',
    entryFee: 25,
    pot: 5775,
    currentEntries: 231,
    closesAt: new Date(now - 7 * oneDay).toISOString(),
    status: 'settled',
    winnerEntryNumber: 117,
    winnerMaskedName: 'M****a',
    drawId: 'draw_w_40',
    description: 'Settled on Base block 38,219,842. Winner derived from Chainlink VRF.'
  },
  {
    id: 'pool_d_1010',
    name: 'Daily Pool · Oct 10',
    cadence: 'daily',
    entryFee: 5,
    pot: 1020,
    currentEntries: 204,
    closesAt: new Date(now - 1 * oneDay).toISOString(),
    status: 'settled',
    winnerEntryNumber: 42,
    winnerMaskedName: 'Priya S.',
    drawId: 'draw_d_1010',
    description: 'Settled on Base block 38,208,419. Winner Entry #42.'
  },
  {
    id: 'pool_d_1009',
    name: 'Daily Pool · Oct 9',
    cadence: 'daily',
    entryFee: 5,
    pot: 980,
    currentEntries: 196,
    closesAt: new Date(now - 2 * oneDay).toISOString(),
    status: 'settled',
    winnerEntryNumber: 88,
    winnerMaskedName: 'K*** M.',
    drawId: 'draw_d_1009',
    description: 'Settled on Base block 38,197,120.'
  }
];

export const initialDestinations: Destination[] = [
  {
    id: 'dest_01',
    name: 'Kraken · USDC (Base)',
    network: 'Base',
    address: '0x9C4d88e7A250B3eFa49B7b4759cD9fA1e6D4E21a',
    isDefault: true,
    status: 'active'
  },
  {
    id: 'dest_02',
    name: 'Ledger cold storage',
    network: 'Base',
    address: '0x31aF4829cD7e85Fa67E3c090De5aF8712C577b02',
    isDefault: false,
    status: 'active'
  },
  {
    id: 'dest_03',
    name: 'Coinbase',
    network: 'Base',
    address: '0x5e2F49781b4B991c784EbF1983eDa2B8673a5a88',
    isDefault: false,
    status: 'cooling_off',
    activatesAt: new Date(now + 23 * oneHour + 59 * 60 * 1000).toISOString()
  }
];

export const initialEntries: Entry[] = [
  {
    id: 'ent_user_w41_382',
    poolId: 'pool_w_41',
    poolName: 'Weekly Pool · Week 41',
    entryNumber: 238, // user's entry in current weekly pool
    userId: 'usr_amara_01',
    userName: 'Amara Okafor',
    maskedName: 'A****a',
    timestamp: new Date(now - 4 * oneHour).toISOString(),
    status: 'active',
    fee: 25
  },
  {
    id: 'ent_user_m10_29',
    poolId: 'pool_m_10',
    poolName: 'Monthly Pool · October',
    entryNumber: 29,
    userId: 'usr_amara_01',
    userName: 'Amara Okafor',
    maskedName: 'A****a',
    timestamp: new Date(now - 3 * oneDay).toISOString(),
    status: 'active',
    fee: 100
  },
  {
    id: 'ent_user_d1010_88',
    poolId: 'pool_d_1010',
    poolName: 'Daily Pool · Oct 10',
    entryNumber: 88,
    userId: 'usr_amara_01',
    userName: 'Amara Okafor',
    maskedName: 'A****a',
    timestamp: new Date(now - 1 * oneDay - 6 * oneHour).toISOString(),
    status: 'lost',
    fee: 5
  }
];

// Helper to compute verified winner modulo math
function createVerifiedDraw(
  id: string,
  poolId: string,
  poolName: string,
  cadence: 'daily' | 'weekly' | 'monthly',
  blockNumber: number,
  vrfRequestId: string,
  randomWord: string,
  entriesCount: number,
  winnerMaskedName: string,
  grossPot: number,
  daysAgo: number,
  isUserWinner: boolean = false
): Draw {
  const bigRandom = BigInt(randomWord);
  const bigEntries = BigInt(entriesCount);
  const winningEntryNumber = Number(bigRandom % bigEntries) + 1;
  const platformFee = Number((grossPot * 0.05).toFixed(2));
  const winnerPayout = Number((grossPot - platformFee).toFixed(2));

  return {
    id,
    poolId,
    poolName,
    cadence,
    blockNumber,
    vrfRequestId,
    randomWord,
    entriesCount,
    winningEntryNumber,
    winnerMaskedName,
    winnerPayout,
    platformFee,
    timestamp: new Date(now - daysAgo * oneDay).toISOString(),
    vrfStatus: 'fulfilled',
    txHash: `0x4be17f9${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}c09a`,
    isUserWinner
  };
}

export const initialDraws: Draw[] = [
  createVerifiedDraw(
    'draw_w_40',
    'pool_w_40',
    'Weekly Pool · Week 40',
    'weekly',
    38219842,
    '0x98f412a884ecb02941b3e1a0b3327f9814cebf7a1094038a9010e9c4091a7821',
    '8392104928174928374910293847192039481729384719283749182374918231',
    231,
    'M****a',
    5775,
    7
  ),
  createVerifiedDraw(
    'draw_d_1010',
    'pool_d_1010',
    'Daily Pool · Oct 10',
    'daily',
    38208419,
    '0x12a84f3910ebca904128f74a01c4819e9014b03847291a82b938174a91820491',
    '4729104829104820194820194820194820194820194820194820194820194841',
    204,
    'Priya S.',
    1020,
    1
  ),
  createVerifiedDraw(
    'draw_d_1009',
    'pool_d_1009',
    'Daily Pool · Oct 9',
    'daily',
    38197120,
    '0x44ab719283749182374918237491823749182374918237491823749182374918',
    '1928374918273645192837465192837465192837465192837465192837465192',
    196,
    'K*** M.',
    980,
    2
  ),
  createVerifiedDraw(
    'draw_w_39',
    'pool_w_39',
    'Weekly Pool · Week 39',
    'weekly',
    38150490,
    '0x87d612e3490184b274c910394817492837491029384719203948172938471920',
    '7283940192837465192837465192837465192837465192837465192837465183',
    224,
    'Amara Okafor', // User won on Week 39!
    223.58, // payout matching user history
    21,
    true
  ),
  createVerifiedDraw(
    'draw_d_1008',
    'pool_d_1008',
    'Daily Pool · Oct 8',
    'daily',
    38186540,
    '0x72a819b384c01928374910293847192039481729384719283749182374918237',
    '9182736451928374651928374651928374651928374651928374651928374651',
    210,
    'D*** O.',
    1050,
    3
  ),
  createVerifiedDraw(
    'draw_d_1007',
    'pool_d_1007',
    'Daily Pool · Oct 7',
    'daily',
    38175900,
    '0x63e9182736451928374651928374651928374651928374651928374651928374',
    '3847192039481729384719283749182374918231839210492817492837491029',
    188,
    'Stefan R.',
    940,
    4
  ),
  createVerifiedDraw(
    'draw_d_1006',
    'pool_d_1006',
    'Daily Pool · Oct 6',
    'daily',
    38164320,
    '0x52c8192837491823749182374918237491823749182374918237491823749182',
    '5928374651928374651928374651928374651928374651928374651928374652',
    195,
    'Luka M.',
    975,
    5
  ),
  createVerifiedDraw(
    'draw_w_38',
    'pool_w_38',
    'Weekly Pool · Week 38',
    'weekly',
    38090210,
    '0x41b7192837491823749182374918237491823749182374918237491823749182',
    '8392019283746519283746519283746519283746519283746519283746519283',
    218,
    'Elena V.',
    5450,
    28
  ),
  createVerifiedDraw(
    'draw_m_09',
    'pool_m_09',
    'Monthly Pool · September',
    'monthly',
    38001200,
    '0x30a6192837491823749182374918237491823749182374918237491823749182',
    '4729182736451928374651928374651928374651928374651928374651928374',
    205,
    'Marcus T.',
    20500,
    42
  ),
  createVerifiedDraw(
    'draw_d_1005',
    'pool_d_1005',
    'Daily Pool · Oct 5',
    'daily',
    38153200,
    '0x29f5192837491823749182374918237491823749182374918237491823749182',
    '9182736451928374651928374651928374651928374651928374651928374654',
    200,
    'Amina B.',
    1000,
    6
  ),
  createVerifiedDraw(
    'draw_d_1004',
    'pool_d_1004',
    'Daily Pool · Oct 4',
    'daily',
    38142100,
    '0x18e4192837491823749182374918237491823749182374918237491823749182',
    '2837465192837465192837465192837465192837465192837465192837465193',
    212,
    'Chen W.',
    1060,
    7
  ),
  createVerifiedDraw(
    'draw_w_37',
    'pool_w_37',
    'Weekly Pool · Week 37',
    'weekly',
    38031000,
    '0x07d3192837491823749182374918237491823749182374918237491823749182',
    '6382910293847192039481729384719283749182374918231839210492817492',
    220,
    'Fatima K.',
    5500,
    35
  )
];

export const initialTransactions: Transaction[] = [
  {
    id: 'tx_dep_02',
    type: 'deposit',
    amount: 50.00,
    status: 'credited',
    timestamp: new Date(now - 2 * oneDay).toISOString(),
    reference: 'Base Sub-Wallet Deposit',
    confirmations: 12,
    maxConfirmations: 12,
    networkFee: 0.0021,
    txHash: '0x8f192847291a82b938174a918204914be17f9284'
  },
  {
    id: 'tx_ent_02',
    type: 'entry',
    amount: -25.00,
    status: 'credited',
    timestamp: new Date(now - 4 * oneHour).toISOString(),
    reference: 'Entry: Weekly Pool · Week 41 (#238)',
    networkFee: 0.0018,
    txHash: '0x3a928174a918204914be17f92848f192847291a8'
  },
  {
    id: 'tx_dep_01',
    type: 'deposit',
    amount: 100.00,
    status: 'credited',
    timestamp: new Date(now - 8 * oneDay).toISOString(),
    reference: 'Base Sub-Wallet Deposit',
    confirmations: 12,
    maxConfirmations: 12,
    networkFee: 0.0023,
    txHash: '0x7b284918204914be17f92848f192847291a82b93'
  },
  {
    id: 'tx_win_01',
    type: 'win',
    amount: 212.40,
    status: 'arrived',
    timestamp: new Date(now - 20 * oneDay).toISOString(),
    reference: 'Win Payout: Weekly Pool · Week 39',
    destinationName: 'Kraken · USDC (Base)',
    networkFee: 0.0022,
    txHash: '0x9c48174a918204914be17f92848f192847291a82'
  },
  {
    id: 'tx_ent_01',
    type: 'entry',
    amount: -5.00,
    status: 'credited',
    timestamp: new Date(now - 1 * oneDay - 6 * oneHour).toISOString(),
    reference: 'Entry: Daily Pool · Oct 10 (#88)',
    networkFee: 0.0019,
    txHash: '0x1d8204914be17f92848f192847291a82b938174a'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif_01',
    title: 'Deposit credited',
    message: '$50.00 USDC has been credited to your available balance via sub-wallet sweep.',
    timestamp: '2 hours ago',
    read: false,
    link: '/app/wallet'
  },
  {
    id: 'notif_02',
    title: 'Daily pool closing soon',
    message: 'Daily Pool · Oct 11 closes in less than 4 hours. Current pot is $1,085.',
    timestamp: '3 hours ago',
    read: false,
    link: '/app/pools/pool_d_1011'
  },
  {
    id: 'notif_03',
    title: 'Payout completed',
    message: 'Previous prize payout of $212.40 settled directly to Kraken · USDC.',
    timestamp: 'Sep 21, 2026',
    read: true,
    link: '/app/withdrawals'
  }
];

export const initialActivity: ActivityItem[] = [
  {
    id: 'act_01',
    type: 'entry',
    title: 'Contributed to Weekly Pool · Week 41',
    description: 'Secured Entry #238. Fixed contribution $25.00.',
    amount: 25.00,
    isPositive: false,
    timestamp: new Date(now - 4 * oneHour).toISOString(),
    dateGroup: 'Today',
    txHash: '0x3a92…91a8'
  },
  {
    id: 'act_02',
    type: 'deposit',
    title: 'Deposit Credited',
    description: 'Received $50.00 USDC on Base sub-wallet address.',
    amount: 50.00,
    isPositive: true,
    timestamp: new Date(now - 2 * oneDay).toISOString(),
    dateGroup: 'October 9, 2026',
    txHash: '0x8f19…7291'
  },
  {
    id: 'act_03',
    type: 'entry',
    title: 'Contributed to Daily Pool · Oct 10',
    description: 'Entry #88 sealed. Draw completed with Entry #42 selected.',
    amount: 5.00,
    isPositive: false,
    timestamp: new Date(now - 1 * oneDay - 6 * oneHour).toISOString(),
    dateGroup: 'October 10, 2026',
    txHash: '0x1d82…174a'
  },
  {
    id: 'act_04',
    type: 'deposit',
    title: 'Deposit Credited',
    description: 'Received $100.00 USDC on Base sub-wallet address.',
    amount: 100.00,
    isPositive: true,
    timestamp: new Date(now - 8 * oneDay).toISOString(),
    dateGroup: 'October 3, 2026',
    txHash: '0x7b28…2b93'
  },
  {
    id: 'act_05',
    type: 'win',
    title: 'Prize Awarded · Weekly Pool Week 39',
    description: 'Entry #19 derived by Chainlink VRF as winner. Net payout $212.40.',
    amount: 212.40,
    isPositive: true,
    timestamp: new Date(now - 20 * oneDay).toISOString(),
    dateGroup: 'September 21, 2026',
    txHash: '0x9c48…1a82'
  },
  {
    id: 'act_06',
    type: 'payout',
    title: 'Automated Payout Dispatched',
    description: 'Auto-routed $212.40 to Kraken · USDC (Base) with $0.002 network fee.',
    amount: 212.40,
    isPositive: false,
    timestamp: new Date(now - 20 * oneDay + 10 * 60 * 1000).toISOString(),
    dateGroup: 'September 21, 2026',
    txHash: '0x4fa8…81b2'
  }
];

// Historical 8-week performance trend for dashboard SVG chart
export const trendData = [
  { week: 'Wk 34', contributions: 30, winnings: 0 },
  { week: 'Wk 35', contributions: 55, winnings: 0 },
  { week: 'Wk 36', contributions: 80, winnings: 0 },
  { week: 'Wk 37', contributions: 110, winnings: 0 },
  { week: 'Wk 38', contributions: 160, winnings: 0 },
  { week: 'Wk 39', contributions: 210, winnings: 212.4 },
  { week: 'Wk 40', contributions: 310, winnings: 212.4 },
  { week: 'Wk 41', contributions: 430, winnings: 212.4 }
];
